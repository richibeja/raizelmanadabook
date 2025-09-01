'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, writeBatch, increment, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './Reacciones.css'; // Importar el archivo CSS

interface ReaccionesProps {
  postId: string;
  postOwnerId: string;
  initialLikesCount: number;
}

export default function Reacciones({ postId, postOwnerId, initialLikesCount }: ReaccionesProps) {
  const { user: currentUser } = useAuth();
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [loading, setLoading] = useState(true);
  const [currentUserPetName, setCurrentUserPetName] = useState('');

  // Obtener el nombre de la mascota del usuario actual para las notificaciones
  useEffect(() => {
    if (currentUser) {
      const fetchPetName = async () => {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().primaryPetId) {
          const petDoc = await getDoc(doc(db, 'users', currentUser.uid, 'pets', userDoc.data().primaryPetId));
          if (petDoc.exists()) {
            setCurrentUserPetName(petDoc.data().name);
          }
        }
      };
      fetchPetName();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const checkLikeStatus = async () => {
      const likeDocRef = doc(db, 'posts', postId, 'likes', currentUser.uid);
      const docSnap = await getDoc(likeDocRef);
      setHasLiked(docSnap.exists());
      setLoading(false);
    };

    checkLikeStatus();
  }, [currentUser, postId]);

  const handleLike = async () => {
    if (!currentUser || loading) return;
    setLoading(true);

    const batch = writeBatch(db);
    const postRef = doc(db, 'posts', postId);
    const likeRef = doc(db, 'posts', postId, 'likes', currentUser.uid);

    // Actualizar estado local inmediatamente para una UI más rápida
    setHasLiked(true);
    setLikesCount(prev => prev + 1);

    // --- Lógica de Base de Datos ---
    batch.set(likeRef, { timestamp: serverTimestamp() });
    batch.update(postRef, { likesCount: increment(1) });

    // --- Lógica de Notificación (solo si no le estás dando like a tu propio post) ---
    if (currentUser.uid !== postOwnerId) {
        const notificationRef = doc(collection(db, 'users', postOwnerId, 'notifications'));
        batch.set(notificationRef, {
            type: 'new_like',
            fromUserId: currentUser.uid,
            fromUserName: currentUserPetName || currentUser.displayName || 'Alguien',
            postId: postId,
            read: false,
            createdAt: serverTimestamp(),
        });
    }

    await batch.commit().catch(error => {
        console.error("Error liking post: ", error);
        // Revert local state if the batch fails
        setHasLiked(false);
        setLikesCount(prev => prev - 1);
    });
    setLoading(false);
  };

  const handleUnlike = async () => {
    if (!currentUser || loading) return;
    setLoading(true);

    const batch = writeBatch(db);
    const postRef = doc(db, 'posts', postId);
    const likeRef = doc(db, 'posts', postId, 'likes', currentUser.uid);

    // Actualizar estado local
    setHasLiked(false);
    setLikesCount(prev => prev - 1);

    // --- Lógica de Base de Datos ---
    batch.delete(likeRef);
    batch.update(postRef, { likesCount: increment(-1) });

    await batch.commit().catch(error => {
        console.error("Error unliking post: ", error);
        // Revert local state if the batch fails
        setHasLiked(true);
        setLikesCount(prev => prev + 1);
    });
    setLoading(false);
  };

  return (
    <div className="reactions-container">
      <button onClick={hasLiked ? handleUnlike : handleLike} disabled={!currentUser || loading} className="reactions-button">
        {hasLiked ? '❤️ Te gusta' : '🤍 Me gusta'}
      </button>
      <span className="likes-count">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
    </div>
  );
}
