'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PetProfileCard from '../../components/PetProfileCard';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  date_of_birth?: string;
  age_years?: number;
  age_months?: number;
  age_estimated?: string;
  gender: string;
  weight?: number;
  color?: string;
  bio?: string;
  personality?: string;
  interests: string[];
  pet_location?: string;
  microchip?: string;
  adoption_date?: string;
  special_needs?: string;
  favorite_food?: string;
  favorite_activities?: string;
  social_media_handle?: string;
  is_sterilized: boolean;
  vaccines: string[];
  medical_notes?: string;
  privacy_level: 'public' | 'friends' | 'private';
  avatar_url?: string;
  followers_count: number;
  posts_count: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export default function PetProfilePage() {
  const params = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/pets/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Mascota no encontrada');
          } else {
            setError('Error al cargar la mascota');
          }
          return;
        }

        const petData = await response.json();
        setPet(petData);
      } catch (err) {
        setError('Error al cargar la mascota');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPet();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando perfil de mascota...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Mascota no encontrada'}
          </h1>
          <p className="text-gray-600 mb-6">
            La mascota que buscas no existe o ha sido eliminada.
          </p>
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a mascotas
          </Link>
        </div>
      </div>
    );
  }

  // Transformar datos para el componente PetProfileCard
  const petForCard = {
    ...pet,
    owner: {
      id: pet.owner_id,
      username: 'usuario_' + pet.owner_id,
      first_name: 'Usuario',
      last_name: pet.owner_id,
      avatar_url: undefined
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con botón de regreso */}
        <div className="mb-6">
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a mascotas
          </Link>
        </div>

        {/* Perfil de mascota */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <img
              src="/api/placeholder/200/200"
              alt={petForCard.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-900">{petForCard.name}</h1>
            <p className="text-gray-600">{petForCard.species} • {petForCard.breed}</p>
            <p className="text-sm text-gray-500 mt-2">{petForCard.bio || 'Una mascota especial'}</p>
            
            <div className="flex justify-center gap-4 mt-6">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Seguir
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                Mensaje
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
