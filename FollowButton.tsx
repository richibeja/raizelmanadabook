'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/AuthContext';
import './FollowButton.css';

interface FollowButtonProps {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const followingRef = doc(db, 'users', user.uid, 'following', targetUserId);
    getDoc(followingRef).then(docSnap => {
      setIsFollowing(docSnap.exists());
      setLoading(false);
    });
  }, [user, targetUserId]);

  const handleFollowToggle = async () => {
    if (!user || loading || user.uid === targetUserId) return;

    setLoading(true);
    const batch = writeBatch(db);

    // Referencias a los documentos principales de los usuarios
    const currentUserRef = doc(db, 'users', user.uid);
    const targetUserRef = doc(db, 'users', targetUserId);

    // Referencias a las subcolecciones de seguimiento
    const followingRef = doc(currentUserRef, 'following', targetUserId);
    const followerRef = doc(targetUserRef, 'followers', user.uid);

    try {
      if (isFollowing) {
        // Dejar de seguir
        batch.delete(followingRef);
        batch.delete(followerRef);
        batch.update(currentUserRef, { following: increment(-1) });
        batch.update(targetUserRef, { followers: increment(-1) });
        setIsFollowing(false);
      } else {
        // Seguir
        batch.set(followingRef, { userId: targetUserId });
        batch.set(followerRef, { userId: user.uid });
        batch.update(currentUserRef, { following: increment(1) });
        batch.update(targetUserRef, { followers: increment(1) });
        setIsFollowing(true);
      }
      await batch.commit();
    } catch (error) {
      console.error("Error al actualizar el seguimiento: ", error);
      // Revertir el cambio en la UI si hay un error
      setIsFollowing(!isFollowing);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.uid === targetUserId) return null;

  return (
    <button onClick={handleFollowToggle} disabled={loading} className={`follow-button ${isFollowing ? 'following' : 'not-following'}`}>
      {loading ? '...' : (isFollowing ? 'Siguiendo' : 'Seguir')}
    </button>
  );
}