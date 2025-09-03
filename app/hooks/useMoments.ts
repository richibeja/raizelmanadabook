'use client';
import { useState, useEffect } from 'react';
import {
  subscribeToMoments,
  createMoment,
  recordMomentView,
  Moment,
} from '@/lib/firebase';
import { useAuthContext } from '../contexts/AuthContext';

export const useMoments = (filters?: { circleId?: string; limit?: number }) => {
  const { user } = useAuthContext();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Suscripción Firebase tiempo real con auto-filtro de expirados
    const unsubscribe = subscribeToMoments(filters || {}, (activeMoments) => {
      setMoments(activeMoments);
      setLoading(false);
    });

    return unsubscribe;
  }, [filters]); // Incluir filters completo para evitar warnings

  const upload = async (momentData: {
    content?: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    duration?: number;
    circleId?: string;
    tags?: string[];
  }) => {
    if (!user?.uid) {
      setError('Usuario no autenticado');
      return null;
    }

    try {
      setError(null);
      
      const newMomentData = {
        ...momentData,
        authorId: user.uid,
        location: undefined // TODO: Get user location if available
      };

      const momentId = await createMoment(newMomentData);
      return momentId;
    } catch (err: any) {
      setError(err.message || 'Error al crear moment');
      return null;
    }
  };

  const view = async (momentId: string, completed: boolean = false) => {
    if (!user?.uid) return;
    
    try {
      await recordMomentView(momentId, user.uid, completed);
    } catch (err: any) {
      console.error('Error recording view:', err);
    }
  };

  // Calculate time remaining for moments
  const getTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const remaining = expiresAt.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Expirado';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Calculate progress (how much time has passed)
  const getProgress = (createdAt: Date, expiresAt: Date): number => {
    const now = new Date();
    const total = expiresAt.getTime() - createdAt.getTime();
    const elapsed = now.getTime() - createdAt.getTime();
    
    return Math.min(Math.max(elapsed / total, 0), 1);
  };

  return {
    moments,
    loading,
    error,
    upload,
    view,
    getTimeRemaining,
    getProgress
  };
};

// Hook específico para moments del usuario
export const useUserMoments = () => {
  const { user } = useAuthContext();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setMoments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMoments(
      { authorId: user.uid, limit: 10 },
      (userMoments) => {
        setMoments(userMoments);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  return { moments, loading };
};