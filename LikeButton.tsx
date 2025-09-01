'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, writeBatch, increment, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './LikeButton.css';

interface LikeButtonProps {
  postId: string;
  postOwnerId: string;
  initialLikesCount: number;
}

export default function LikeButton({ postId, postOwnerId, initialLikesCount }: LikeButtonProps) {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    const checkLikeStatus = async () => {
      const likeDocRef = doc(db, 'posts', postId, 'likes', currentUser.uid);
      const docSnap = await getDoc(likeDocRef);
      setIsLiked(docSnap.exists());
      setIsLoading(false);
    };
    checkLikeStatus();
  }, [currentUser, postId]);

  const handleLikeToggle = async () => {
    if (!currentUser || isLoading) return;
    setIsLoading(true);

    const batch = writeBatch(db);
    const postRef = doc(db, 'posts', postId);
    const likeRef = doc(db, 'posts', postId, 'likes', currentUser.uid);
    const isCurrentlyLiked = isLiked;

    if (isCurrentlyLiked) {
      batch.delete(likeRef);
      batch.update(postRef, { likesCount: increment(-1) });
    } else {
      batch.set(likeRef, { likedAt: serverTimestamp() });
      batch.update(postRef, { likesCount: increment(1) });

      // Notificación solo si le da like a la publicación de otro usuario
      if (currentUser.uid !== postOwnerId) {
          const notificationRef = doc(collection(db, 'users', postOwnerId, 'notifications'));
          batch.set(notificationRef, {
              type: 'new_like',
              fromUserId: currentUser.uid,
              fromUserName: currentUser.displayName || currentUser.email,
              postId: postId,
              read: false,
              createdAt: serverTimestamp(),
          });
      }
    }

    try {
        await batch.commit();
        setIsLiked(!isCurrentlyLiked);
        setLikesCount(prev => isCurrentlyLiked ? prev - 1 : prev + 1);
    } catch (error) {
        console.error("Error toggling like: ", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <button onClick={handleLikeToggle} disabled={!currentUser || isLoading} className={`like-button ${isLiked ? 'liked' : ''}`}>
      ❤️ {likesCount}
    </button>
  );
}
