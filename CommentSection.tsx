
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { collection, query, orderBy, onSnapshot, doc, writeBatch, increment, serverTimestamp, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '@/AuthContext';

interface Comment {
  id: string;
  authorName: string;
  text: string;
  createdAt: Date;
}

interface CommentSectionProps {
  postId: string;
  postOwnerId: string;
}

export default function CommentSection({ postId, postOwnerId }: CommentSectionProps) {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserPetName, setCurrentUserPetName] = useState('');

  // Obtener el nombre de la mascota del usuario actual para los comentarios y notificaciones
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
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          authorName: data.authorName,
          text: data.text,
          createdAt: (data.createdAt as Timestamp).toDate(),
        };
      });
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || newComment.trim() === '') return;

    const batch = writeBatch(db);
    const postRef = doc(db, 'posts', postId);
    const newCommentRef = doc(collection(db, 'posts', postId, 'comments'));

    // --- Lógica de Comentario ---
    batch.set(newCommentRef, {
      authorId: currentUser.uid,
      authorName: currentUserPetName || currentUser.displayName || 'Anónimo',
      text: newComment,
      createdAt: serverTimestamp(),
    });
    batch.update(postRef, { commentsCount: increment(1) });

    // --- Lógica de Notificación ---
    if (currentUser.uid !== postOwnerId) {
      const notificationRef = doc(collection(db, 'users', postOwnerId, 'notifications'));
      batch.set(notificationRef, {
        type: 'new_comment',
        fromUserId: currentUser.uid,
        fromUserName: currentUserPetName || currentUser.displayName || 'Alguien',
        postId: postId,
        commentText: newComment.substring(0, 50), // Un extracto del comentario
        read: false,
        createdAt: serverTimestamp(),
      });
    }

    // --- LÓGICA DE GAMIFICACIÓN (NUEVO) ---
    const commenterBadgeRef = doc(db, 'users', currentUser.uid, 'badges', 'comentarista');
    const docSnap = await getDoc(commenterBadgeRef);
    if (!docSnap.exists()) {
        batch.set(commenterBadgeRef, {
            name: "Comentarista",
            description: "Otorgada por escribir tu primer comentario.",
            earnedAt: serverTimestamp(),
        });
    }

    await batch.commit().catch(error => {
        console.error("Error adding comment: ", error);
    });
    setNewComment(''); // Limpiar el input
  };

  return (
    <div className="comment-section-container">
      <h4>Comentarios</h4>
      {loading && <p>Cargando comentarios...</p>}
      <div className="comment-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <p><strong>{comment.authorName}:</strong> {comment.text}</p>
          </div>
        ))}
      </div>

      {currentUser && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Añade un comentario..."
            required
          />
          <button type="submit">Publicar</button>
        </form>
      )}
    </div>
  );
}
