'use client';
import React from 'react';
import { Heart, MapPin, Calendar, Edit, Share2, MessageCircle } from 'lucide-react';

interface Pet {
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

interface PetProfileCardProps {
  pet: Pet;
  onEdit?: (pet: Pet) => void;
  onShare?: (pet: Pet) => void;
  onMessage?: (pet: Pet) => void;
  showActions?: boolean;
}

const PetProfileCard: React.FC<PetProfileCardProps> = ({
  pet,
  onEdit,
  onShare,
  onMessage,
  showActions = true
}) => {
  const formatAge = () => {
    const ageText = pet.age === 1 ? 
      (pet.age_unit === 'years' ? 'año' : pet.age_unit === 'months' ? 'mes' : 'estimado') :
      (pet.age_unit === 'years' ? 'años' : pet.age_unit === 'months' ? 'meses' : 'estimado');
    
    return `${pet.age} ${ageText}`;
  };

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'perro':
        return '🐕';
      case 'gato':
        return '🐱';
      case 'ave':
        return '🐦';
      case 'pez':
        return '🐠';
      case 'reptil':
        return '🦎';
      case 'roedor':
        return '🐹';
      case 'caballo':
        return '🐴';
      default:
        return '🐾';
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'macho':
        return 'bg-blue-100 text-blue-800';
      case 'hembra':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header con imagen */}
      <div className="relative h-48 bg-gradient-to-br from-green-50 to-blue-50">
        {pet.profile_image_url ? (
          <img
            src={pet.profile_image_url}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">{getSpeciesIcon(pet.species)}</div>
          </div>
        )}
        
        {/* Badge de especie */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white bg-opacity-90 rounded-full text-sm font-medium text-gray-800">
            {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
          </span>
        </div>

        {/* Acciones */}
        {showActions && (
          <div className="absolute top-4 right-4 flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(pet)}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              >
                <Edit size={16} className="text-gray-600" />
              </button>
            )}
            {onShare && (
              <button
                onClick={() => onShare(pet)}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              >
                <Share2 size={16} className="text-gray-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Nombre y información básica */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{formatAge()}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenderColor(pet.gender)}`}>
              {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
            </span>
            {pet.breed && (
              <span className="text-gray-500">{pet.breed}</span>
            )}
          </div>
        </div>

        {/* Ubicación */}
        {pet.location && (
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm">{pet.location}</span>
          </div>
        )}

        {/* Personalidad */}
        {pet.personality && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Personalidad</h3>
            <p className="text-sm text-gray-600">{pet.personality}</p>
          </div>
        )}

        {/* Intereses */}
        {pet.interests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Intereses</h3>
            <div className="flex flex-wrap gap-2">
              {pet.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                >
                  <Heart size={12} className="mr-1" />
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Biografía */}
        {pet.bio && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sobre {pet.name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{pet.bio}</p>
          </div>
        )}

        {/* Acciones del footer */}
        {showActions && (
          <div className="flex space-x-3">
            {onMessage && (
              <button
                onClick={() => onMessage(pet)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle size={16} className="mr-2" />
                Enviar mensaje
              </button>
            )}
            {onShare && (
              <button
                onClick={() => onShare(pet)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Share2 size={16} className="mr-2" />
                Compartir
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetProfileCard;


