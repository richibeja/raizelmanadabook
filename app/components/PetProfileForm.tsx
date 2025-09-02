'use client';
import React, { useState } from 'react';
import { Save, X, Upload, MapPin, Calendar, Heart } from 'lucide-react';

interface PetProfileFormProps {
  pet?: {
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
    profile_image_url?: string;
  };
  onSubmit: (petData: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const PetProfileForm: React.FC<PetProfileFormProps> = ({
  pet,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: pet?.name || '',
    species: pet?.species || 'perro',
    breed: pet?.breed || '',
    age: pet?.age || 1,
    age_unit: pet?.age_unit || 'years',
    gender: pet?.gender || 'indefinido',
    personality: pet?.personality || '',
    interests: pet?.interests || [],
    location: pet?.location || '',
    bio: pet?.bio || '',
    profile_image_url: pet?.profile_image_url || ''
  });

  const [newInterest, setNewInterest] = useState('');

  const speciesOptions = [
    'perro', 'gato', 'ave', 'pez', 'reptil', 'roedor', 'caballo', 'exótica', 'otro'
  ];

  const breedOptions = {
    perro: ['Labrador', 'Golden Retriever', 'Pastor Alemán', 'Bulldog', 'Poodle', 'Chihuahua', 'Otro'],
    gato: ['Persa', 'Siamés', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Sphynx', 'Otro'],
    ave: ['Canario', 'Periquito', 'Cockatiel', 'Agapornis', 'Otro'],
    pez: ['Goldfish', 'Betta', 'Guppy', 'Tetra', 'Otro'],
    reptil: ['Gecko', 'Iguana', 'Tortuga', 'Serpiente', 'Otro'],
    roedor: ['Hámster', 'Cobaya', 'Conejo', 'Chinchilla', 'Otro'],
    caballo: ['Árabe', 'Pura Sangre', 'Pony', 'Otro'],
    exótica: ['Hurón', 'Erizo', 'Otro'],
    otro: ['Otro']
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {pet ? 'Editar Mascota' : 'Nueva Mascota'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especie *
            </label>
            <select
              value={formData.species}
              onChange={(e) => handleInputChange('species', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              {speciesOptions.map(species => (
                <option key={species} value={species}>
                  {species.charAt(0).toUpperCase() + species.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Raza
            </label>
            <select
              value={formData.breed}
              onChange={(e) => handleInputChange('breed', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Seleccionar raza</option>
              {(breedOptions[formData.species as keyof typeof breedOptions] || []).map(breed => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edad *
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <select
                value={formData.age_unit}
                onChange={(e) => handleInputChange('age_unit', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="years">Años</option>
                <option value="months">Meses</option>
                <option value="estimated">Estimado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Género *
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
              <option value="indefinido">Indefinido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación
            </label>
            <div className="relative">
              <MapPin size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ciudad, País"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Personalidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personalidad
          </label>
          <textarea
            value={formData.personality}
            onChange={(e) => handleInputChange('personality', e.target.value)}
            placeholder="Describe la personalidad de tu mascota..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Intereses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intereses
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Agregar interés..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Agregar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                <Heart size={14} className="mr-1" />
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Biografía */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biografía
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Cuéntanos más sobre tu mascota..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Botones */}
        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save size={20} className="mr-2" />
            )}
            {pet ? 'Actualizar Mascota' : 'Crear Mascota'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PetProfileForm;


