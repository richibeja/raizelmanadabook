'use client';
import { useState, useEffect } from 'react';
import { 
  getUserProfile, 
  updateUserProfile, 
  UserProfile,
  subscribeToUserPets,
  Pet
} from '@/lib/firebase';
import { useAuthContext } from '../contexts/AuthContext';

export const useUserProfile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      setPets([]);
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);

        // Subscribe to user's pets in real-time
        const unsubscribePets = subscribeToUserPets(user.uid, (userPets) => {
          setPets(userPets);
          
          // Update pets count in profile if needed
          if (userProfile && userProfile.stats.petsCount !== userPets.length) {
            updateUserProfile(userProfile.id, {
              stats: {
                ...userProfile.stats,
                petsCount: userPets.length
              }
            });
          }
        });

        setLoading(false);
        return unsubscribePets;
        
      } catch (err: any) {
        setError(err.message || 'Error al cargar perfil');
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.uid]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    try {
      await updateUserProfile(profile.id, updates);
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
    }
  };

  return {
    profile,
    pets,
    loading,
    error,
    updateProfile
  };
};