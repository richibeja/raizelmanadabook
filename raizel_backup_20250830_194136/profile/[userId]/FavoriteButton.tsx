'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, writeBatch, serverTimestamp, deleteDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../AuthContext';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  contentId: string;
  contentType: 'marketplace_listing' | 'adoption_listing';
  contentData: { // Pasamos los datos básicos para guardarlos en favoritos
    title: string;
    imageUrl?: string;
  };
}

export default function FavoriteButton({ contentId, contentType, contentData }: FavoriteButtonProps) {
  const { user: currentUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    const checkFavoriteStatus = async () => {
      const favoriteDocRef = doc(db, 'users', currentUser.uid, 'favorites', contentId);
      const docSnap = await getDoc(favoriteDocRef);
      setIsFavorite(docSnap.exists());
      setIsLoading(false);
    };
    checkFavoriteStatus();
  }, [currentUser, contentId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir la navegación si el botón está en un Link
    e.stopPropagation();

    if (!currentUser || isLoading) return;
    setIsLoading(true);

    const batch = writeBatch(db);
    const favoriteRef = doc(db, 'users', currentUser.uid, 'favorites', contentId);
    const originalContentCollection = contentType === 'marketplace_listing' ? 'marketplace_listings' : 'adoption_listings';
    const contentRef = doc(db, originalContentCollection, contentId);

    const isCurrentlyFavorite = isFavorite;

    if (isCurrentlyFavorite) {
      batch.delete(favoriteRef);
      batch.update(contentRef, { favoritesCount: increment(-1) });
    } else {
      batch.set(favoriteRef, {
        ...contentData,
        contentType: contentType,
        favoritedAt: serverTimestamp(),
      });
      batch.update(contentRef, { favoritesCount: increment(1) });
    }

    try {
      await batch.commit();
      setIsFavorite(!isCurrentlyFavorite);
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <button onClick={handleToggleFavorite} disabled={isLoading} className={`favorite-button ${isFavorite ? 'favorited' : ''}`}>
      {isFavorite ? '★' : '☆'}
    </button>
  );
}