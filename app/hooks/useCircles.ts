'use client';
import { useState, useEffect } from 'react';
import {
  subscribeToCircles,
  subscribeToUserCircles,
  createCircle,
  joinCircle,
  leaveCircle,
  Circle as FirebaseCircle,
  CircleMember,
  subscribeToCircleMembers
} from '@/lib/firebase';
import { useAuthContext } from '../contexts/AuthContext';

// Legacy interface para compatibilidad
export interface Circle {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  max_members?: number;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Mapear Firebase Circle a Legacy Circle
function mapFirebaseCircleToLegacy(firebaseCircle: FirebaseCircle): Circle {
  return {
    id: firebaseCircle.id,
    name: firebaseCircle.name,
    description: firebaseCircle.description,
    category: firebaseCircle.tags[0] || 'general',
    member_count: firebaseCircle.stats.membersCount,
    max_members: undefined,
    is_private: firebaseCircle.isPrivate,
    created_by: firebaseCircle.createdBy,
    created_at: firebaseCircle.createdAt.toISOString(),
    updated_at: firebaseCircle.updatedAt.toISOString()
  };
}

// Hook principal para círculos (mantiene compatibilidad + tiempo real)
export const useCircles = (filters?: { city?: string; tags?: string[]; limit?: number }) => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Suscripción Firebase tiempo real
    const unsubscribe = subscribeToCircles(filters || {}, (firebaseCircles) => {
      const legacyCircles = firebaseCircles.map(mapFirebaseCircleToLegacy);
      setCircles(legacyCircles);
      setLoading(false);
    });

    return unsubscribe;
  }, [filters]); // Simplificar dependencias para evitar warnings complejos

  const createNew = async (circleData: Omit<FirebaseCircle, 'id' | 'createdAt' | 'updatedAt' | 'stats'>) => {
    try {
      const circleId = await createCircle(circleData);
      return circleId;
    } catch (err: any) {
      setError(err.message || 'Error al crear círculo');
      return null;
    }
  };

  return { circles, loading, error, createNew };
};

// Hook para círculos del usuario
export const useUserCircles = () => {
  const { user } = useAuthContext();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setCircles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserCircles(user.uid, (firebaseCircles) => {
      const legacyCircles = firebaseCircles.map(mapFirebaseCircleToLegacy);
      setCircles(legacyCircles);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  const join = async (circleId: string) => {
    if (!user?.uid) return false;
    
    try {
      await joinCircle(circleId, user.uid);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al unirse al círculo');
      return false;
    }
  };

  const leave = async (circleId: string) => {
    if (!user?.uid) return false;
    
    try {
      await leaveCircle(circleId, user.uid);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al salir del círculo');
      return false;
    }
  };

  return { circles, loading, error, join, leave };
};

// Hook para miembros de un círculo
export const useCircleMembers = (circleId: string) => {
  const [members, setMembers] = useState<CircleMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!circleId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToCircleMembers(circleId, (circleMembers) => {
      setMembers(circleMembers);
      setLoading(false);
    });

    return unsubscribe;
  }, [circleId]);

  return { members, loading, error };
};
