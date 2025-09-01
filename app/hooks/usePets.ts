'use client';
import { useState, useEffect } from 'react';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age: number;
  age_unit: 'years' | 'months' | 'estimated';
  gender: 'macho' | 'hembra' | 'indefinido';
  personality: string;
  interests: string[];
  location?: string;
  bio: string;
  owner_id: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pets');
        const result = await response.json();
        
        if (result.success) {
          setPets(result.data);
        } else {
          setError(result.message || 'Error al cargar mascotas');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return { pets, loading, error };
};
