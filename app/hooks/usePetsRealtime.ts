'use client';
import { useState } from 'react';
import { 
  createPet, 
  updatePet, 
  deletePet, 
  Pet 
} from '@/lib/firebase';
import { useAuthContext } from '../contexts/AuthContext';

export const usePetsRealtime = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPet = async (petData: Omit<Pet, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'stats'>) => {
    if (!user?.uid) {
      setError('Usuario no autenticado');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const newPetData = {
        ...petData,
        ownerId: user.uid,
        stats: {
          followersCount: 0,
          postsCount: 0
        }
      };

      const petId = await createPet(newPetData);
      setLoading(false);
      return petId;
    } catch (err: any) {
      setError(err.message || 'Error al crear mascota');
      setLoading(false);
      return null;
    }
  };

  const editPet = async (petId: string, updates: Partial<Pet>) => {
    try {
      setLoading(true);
      setError(null);
      
      await updatePet(petId, updates);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar mascota');
      setLoading(false);
    }
  };

  const removePet = async (petId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deletePet(petId);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar mascota');
      setLoading(false);
    }
  };

  // Calculate age from birth date
  const calculateAge = (birthDate: Date): string => {
    const now = new Date();
    const diffInMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
    
    if (diffInMonths < 12) {
      return `${diffInMonths} meses`;
    } else {
      const years = Math.floor(diffInMonths / 12);
      const months = diffInMonths % 12;
      return months > 0 ? `${years} años, ${months} meses` : `${years} años`;
    }
  };

  // Calculate BARF portion for pet
  const calculateBARFPortion = (weight: number, age: number, activity: 'low' | 'normal' | 'high' = 'normal'): number => {
    let percentage = 0.025; // 2.5% base
    
    // Adjust for age
    if (age < 1) percentage += 0.005; // Puppies need more
    if (age > 8) percentage -= 0.003; // Seniors need less
    
    // Adjust for activity
    if (activity === 'high') percentage += 0.004;
    if (activity === 'low') percentage -= 0.003;
    
    return Math.round(weight * percentage * 1000); // Convert to grams
  };

  return {
    addPet,
    editPet, 
    removePet,
    loading,
    error,
    // Utility functions
    calculateAge,
    calculateBARFPortion
  };
};
