
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/AuthContext'; // Assuming you have an AuthContext
import { db } from '@/lib/firebase';

interface FavoriteButtonProps {
  contentId: string;
  contentType: 'adoption' | 'post' | 'product'; // Example content types
}

export default function FavoriteButton({ contentId, contentType }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the item is already favorited
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const favRef = doc(db, 'users', user.uid, 'favorites', contentId);
    getDoc(favRef).then(docSnap => {
      setIsFavorited(docSnap.exists());
    }).finally(() => setLoading(false));
  }, [user, contentId]);

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent parent Link navigation
    e.stopPropagation();

    if (!user || loading) return;

    setLoading(true);
    const favRef = doc(db, 'users', user.uid, 'favorites', contentId);

    try {
      if (isFavorited) {
        await deleteDoc(favRef);
        setIsFavorited(false);
      } else {
        await setDoc(favRef, {
          contentType: contentType,
          createdAt: serverTimestamp(),
        });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleFavorite} disabled={!user || loading} title={isFavorited ? "Quitar de favoritos" : "Añadir a favoritos"}>
      {isFavorited ? '❤️' : '🤍'}
    </button>
  );
}
