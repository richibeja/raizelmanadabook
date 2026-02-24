'use client';

import React, { useState } from 'react';
import { X, Upload, Camera, Save, User, Heart, Star } from 'lucide-react';

interface PetProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: any) => void;
  initialData?: any;
}

export default function PetProfileEditor({ isOpen, onClose, onSave, initialData }: PetProfileEditorProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    username: initialData?.username || '',
    species: initialData?.species || 'Perro',
    breed: initialData?.breed || '',
    age: initialData?.age || '',
    bio: initialData?.bio || '',
    personality: initialData?.personality || [],
    interests: initialData?.interests || [],
    location: initialData?.location || '',
    avatar: initialData?.avatar || '',
    cover: initialData?.cover || '',
    isPublic: initialData?.isPublic || true,
    ...initialData
  });

  const [selectedPersonality, setSelectedPersonality] = useState<string[]>(formData.personality);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(formData.interests);
  const [uploading, setUploading] = useState(false);

  const speciesOptions = ['Perro', 'Gato', 'Conejo', 'Hamster', 'Pájaro', 'Pez', 'Tortuga', 'Otro'];
  
  const personalityTraits = [
    'Juguetón', 'Tranquilo', 'Energético', 'Cariñoso', 'Independiente', 
    'Sociable', 'Protector', 'Curioso', 'Tímido', 'Aventurero'
  ];

  const interestOptions = [
    'Jugar con pelotas', 'Correr', 'Nadar', 'Dormir', 'Comer', 
    'Paseos', 'Juguetes', 'Otros animales', 'Personas', 'Aventuras'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalityToggle = (trait: string) => {
    setSelectedPersonality(prev => 
      prev.includes(trait) 
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleImageUpload = (type: 'avatar' | 'cover') => {
    // Simular subida de imagen
    setUploading(true);
    setTimeout(() => {
      const mockUrl = type === 'avatar' 
        ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
      
      handleInputChange(type, mockUrl);
      setUploading(false);
    }, 1000);
  };

  const handleSave = () => {
    const profileData = {
      ...formData,
      personality: selectedPersonality,
      interests: selectedInterests,
      username: formData.username.startsWith('@') ? formData.username : `@${formData.username}`
    };
    
    onSave(profileData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {initialData ? 'Editar Perfil de Mascota' : 'Crear Perfil de Mascota'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Cover Photo */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg overflow-hidden">
              {formData.cover ? (
                <img
                  src={formData.cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <button
              onClick={() => handleImageUpload('cover')}
              disabled={uploading}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Avatar */}
          <div className="flex items-center space-x-4 -mt-16 ml-4">
            <div className="relative">
              <img
                src={formData.avatar || 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
                alt="Avatar"
                className="w-20 h-20 rounded-full border-4 border-gray-900 object-cover"
              />
              <button
                onClick={() => handleImageUpload('avatar')}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className="pt-12">
              <h3 className="text-white font-bold text-lg">Foto de perfil</h3>
              <p className="text-gray-400 text-sm">Sube una foto clara de tu mascota</p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Nombre de la mascota *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                placeholder="Ej: Max, Luna, Bobby"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Usuario *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                placeholder="max_golden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Especie *</label>
              <select
                value={formData.species}
                onChange={(e) => handleInputChange('species', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
              >
                {speciesOptions.map(species => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Raza</label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                placeholder="Golden Retriever"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Edad</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                placeholder="2 años"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Biografía</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              rows={3}
              placeholder="Cuéntanos sobre tu mascota..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/200 caracteres</p>
          </div>

          {/* Personality */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Personalidad</label>
            <div className="flex flex-wrap gap-2">
              {personalityTraits.map(trait => (
                <button
                  key={trait}
                  onClick={() => handlePersonalityToggle(trait)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedPersonality.includes(trait)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Intereses</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedInterests.includes(interest)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Ubicación</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              placeholder="Ciudad, País"
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              className="w-4 h-4 text-red-500 bg-gray-800 border-gray-700 rounded focus:ring-red-500"
            />
            <label htmlFor="isPublic" className="text-gray-300 text-sm">
              Perfil público (visible para todos)
            </label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.username}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Guardar Cambios' : 'Crear Perfil'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
