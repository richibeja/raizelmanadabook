'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified: boolean;
  createdAt: Date;
  isFollowing?: boolean;
  isFollower?: boolean;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export function useFollow() {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setFollowers([]);
      setFollowing([]);
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Cargar seguidores
    const followersQuery = query(
      collection(db, 'follows'),
      where('followingId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const followersUnsubscribe = onSnapshot(
      followersQuery,
      async (snapshot) => {
        try {
          const followersData: User[] = [];
          
          for (const followDoc of snapshot.docs) {
            const followData = followDoc.data();
            const userDoc = await doc(db, 'users', followData.followerId).get();
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              followersData.push({
                id: userData.id || followData.followerId,
                name: userData.name || 'Usuario Anónimo',
                email: userData.email || '',
                avatarUrl: userData.avatarUrl || '',
                bio: userData.bio || '',
                location: userData.location || '',
                followersCount: userData.followersCount || 0,
                followingCount: userData.followingCount || 0,
                postsCount: userData.postsCount || 0,
                isVerified: userData.isVerified || false,
                createdAt: userData.createdAt?.toDate() || new Date(),
                isFollower: true,
              });
            }
          }
          
          setFollowers(followersData);
        } catch (err) {
          console.error('Error fetching followers:', err);
          setError('Error al cargar los seguidores');
        }
      }
    );

    // Cargar seguidos
    const followingQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const followingUnsubscribe = onSnapshot(
      followingQuery,
      async (snapshot) => {
        try {
          const followingData: User[] = [];
          
          for (const followDoc of snapshot.docs) {
            const followData = followDoc.data();
            const userDoc = await doc(db, 'users', followData.followingId).get();
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              followingData.push({
                id: userData.id || followData.followingId,
                name: userData.name || 'Usuario Anónimo',
                email: userData.email || '',
                avatarUrl: userData.avatarUrl || '',
                bio: userData.bio || '',
                location: userData.location || '',
                followersCount: userData.followersCount || 0,
                followingCount: userData.followingCount || 0,
                postsCount: userData.postsCount || 0,
                isVerified: userData.isVerified || false,
                createdAt: userData.createdAt?.toDate() || new Date(),
                isFollowing: true,
              });
            }
          }
          
          setFollowing(followingData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching following:', err);
          setError('Error al cargar los seguidos');
          setLoading(false);
        }
      }
    );

    // Cargar sugerencias
    loadSuggestions();

    return () => {
      followersUnsubscribe();
      followingUnsubscribe();
    };
  }, [user, loadSuggestions]);

  const loadSuggestions = async () => {
    if (!user) return;

    try {
      // Obtener usuarios que no seguimos
      const allUsersQuery = query(
        collection(db, 'users'),
        where('__name__', '!=', user.uid),
        orderBy('followersCount', 'desc'),
        limit(20)
      );

      const snapshot = await getDocs(allUsersQuery);
      const suggestionsData: User[] = [];

      for (const userDoc of snapshot.docs) {
        const userData = userDoc.data();
        
        // Verificar si ya seguimos a este usuario
        const followQuery = query(
          collection(db, 'follows'),
          where('followerId', '==', user.uid),
          where('followingId', '==', userDoc.id)
        );
        const followSnapshot = await getDocs(followQuery);
        
        if (followSnapshot.empty) {
          suggestionsData.push({
            id: userDoc.id,
            name: userData.name || 'Usuario Anónimo',
            email: userData.email || '',
            avatarUrl: userData.avatarUrl || '',
            bio: userData.bio || '',
            location: userData.location || '',
            followersCount: userData.followersCount || 0,
            followingCount: userData.followingCount || 0,
            postsCount: userData.postsCount || 0,
            isVerified: userData.isVerified || false,
            createdAt: userData.createdAt?.toDate() || new Date(),
          });
        }
      }

      setSuggestions(suggestionsData.slice(0, 10));
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const followUser = async (userId: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (userId === user.uid) throw new Error('No puedes seguirte a ti mismo');

    try {
      // Verificar si ya seguimos a este usuario
      const existingFollowQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', user.uid),
        where('followingId', '==', userId)
      );
      const existingFollowSnapshot = await getDocs(existingFollowQuery);

      if (!existingFollowSnapshot.empty) {
        throw new Error('Ya sigues a este usuario');
      }

      // Crear relación de seguimiento
      await addDoc(collection(db, 'follows'), {
        followerId: user.uid,
        followingId: userId,
        createdAt: Timestamp.now(),
      });

      // Actualizar contadores
      await updateUserCounters(userId, 'followers', 1);
      await updateUserCounters(user.uid, 'following', 1);
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Buscar relación de seguimiento
      const followQuery = query(
        collection(db, 'follows'),
        where('followerId', '==', user.uid),
        where('followingId', '==', userId)
      );
      const followSnapshot = await getDocs(followQuery);

      if (followSnapshot.empty) {
        throw new Error('No sigues a este usuario');
      }

      // Eliminar relación
      const followDoc = followSnapshot.docs[0];
      await deleteDoc(doc(db, 'follows', followDoc.id));

      // Actualizar contadores
      await updateUserCounters(userId, 'followers', -1);
      await updateUserCounters(user.uid, 'following', -1);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  };

  const updateUserCounters = async (userId: string, counterType: 'followers' | 'following' | 'posts', change: number) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentCount = userData[`${counterType}Count`] || 0;
        const newCount = Math.max(0, currentCount + change);
        
        await updateDoc(userRef, {
          [`${counterType}Count`]: newCount,
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error updating user counters:', error);
    }
  };

  const isFollowing = (userId: string) => {
    return following.some(user => user.id === userId);
  };

  const isFollower = (userId: string) => {
    return followers.some(user => user.id === userId);
  };

  const getFollowStatus = (userId: string) => {
    if (isFollowing(userId)) return 'following';
    if (isFollower(userId)) return 'follower';
    return 'none';
  };

  return {
    followers,
    following,
    suggestions,
    loading,
    error,
    followUser,
    unfollowUser,
    isFollowing,
    isFollower,
    getFollowStatus,
    loadSuggestions,
  };
}
