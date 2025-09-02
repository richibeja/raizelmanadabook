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

// Hook existente mantenido para compatibilidad
export const usePets = (filters?: { search?: string; species?: string; limit?: number }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.species) params.append('species', filters.species);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        
        const response = await fetch(`/api/pets?${params.toString()}`);
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
  }, [filters?.search, filters?.species, filters?.limit]);

  const createPet = async (petData: Omit<Pet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(petData)
      });
      
      const result = await response.json();
      if (result.success) {
        setPets(prev => [result.data, ...prev]);
        return result.data;
      } else {
        setError(result.error || 'Error al crear mascota');
      }
    } catch (err) {
      setError('Error al crear mascota');
    }
  };

  return { pets, loading, error, createPet };
};
