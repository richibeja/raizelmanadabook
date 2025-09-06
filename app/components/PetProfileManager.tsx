'use client';

import React, { useState } from 'react';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Plus, Edit, Trash2, Camera, MapPin, Heart, Star } from 'lucide-react';

interface PetProfileManagerProps {
  onClose: () => void;
}

export default function PetProfileManager({ onClose }: PetProfileManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const [isEditing, setIsEditing] = useState(false);
  const [editingPet, setEditingPet] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'rodent' | 'horse' | 'exotic' | 'other',
    breed: '',
    age: 0,
    gender: 'male' as 'male' | 'female',
    personality: [] as string[],
    interests: [] as string[],
    location: '',
    bio: '',
    privacy: 'public' as 'public' | 'friends' | 'private',
    vaccines: [] as string[],
  });
  const [newPersonality, setNewPersonality] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newVaccine, setNewVaccine] = useState('');

  const speciesOptions = [
    { value: 'dog', label: '🐕 Perro', emoji: '🐕' },
    { value: 'cat', label: '🐱 Gato', emoji: '🐱' },
    { value: 'bird', label: '🐦 Ave', emoji: '🐦' },
    { value: 'fish', label: '🐠 Pez', emoji: '🐠' },
    { value: 'reptile', label: '🦎 Reptil', emoji: '🦎' },
    { value: 'rodent', label: '🐹 Roedor', emoji: '🐹' },
    { value: 'horse', label: '🐴 Caballo', emoji: '🐴' },
    { value: 'exotic', label: '🦜 Exótico', emoji: '🦜' },
    { value: 'other', label: '🐾 Otro', emoji: '🐾' },
  ];

  const personalityTraits = [
    'Juguetón', 'Tranquilo', 'Energético', 'Cariñoso', 'Independiente',
    'Sociable', 'Protector', 'Curioso', 'Tímido', 'Aventurero',
    'Inteligente', 'Paciente', 'Activo', 'Relajado', 'Leal'
  ];

  const interestOptions = [
    'Jugar con pelotas', 'Nadar', 'Correr', 'Dormir', 'Comer',
    'Paseos', 'Juguetes', 'Otros perros', 'Gatos', 'Niños',
    'Entrenamiento', 'Aventuras', 'Relajarse', 'Explorar', 'Socializar'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPersonality = () => {
    if (newPersonality.trim() && !formData.personality.includes(newPersonality.trim())) {
      setFormData(prev => ({
        ...prev,
        personality: [...prev.personality, newPersonality.trim()]
      }));
      setNewPersonality('');
    }
  };

  const handleRemovePersonality = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      personality: prev.personality.filter(p => p !== trait)
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

  const handleAddVaccine = () => {
    if (newVaccine.trim() && !formData.vaccines.includes(newVaccine.trim())) {
      setFormData(prev => ({
        ...prev,
        vaccines: [...prev.vaccines, newVaccine.trim()]
      }));
      setNewVaccine('');
    }
  };

  const handleRemoveVaccine = (vaccine: string) => {
    setFormData(prev => ({
      ...prev,
      vaccines: prev.vaccines.filter(v => v !== vaccine)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPet) {
        await updatePet(editingPet, formData);
      } else {
        await addPet(formData);
      }
      
      // Reset form
      setFormData({
        name: '',
        species: 'dog',
        breed: '',
        age: 0,
        gender: 'male',
        personality: [],
        interests: [],
        location: '',
        bio: '',
        privacy: 'public',
        vaccines: [],
      });
      setIsEditing(false);
      setEditingPet(null);
    } catch (error) {
      console.error('Error saving pet:', error);
    }
  };

  const handleEditPet = (pet: any) => {
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: pet.age,
      gender: pet.gender,
      personality: pet.personality || [],
      interests: pet.interests || [],
      location: pet.location || '',
      bio: pet.bio || '',
      privacy: pet.privacy || 'public',
      vaccines: pet.vaccines || [],
    });
    setEditingPet(pet.id);
    setIsEditing(true);
  };

  const handleNewPet = () => {
    setFormData({
      name: '',
      species: 'dog',
      breed: '',
      age: 0,
      gender: 'male',
      personality: [],
      interests: [],
      location: '',
      bio: '',
      privacy: 'public',
      vaccines: [],
    });
    setEditingPet(null);
    setIsEditing(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {isEditing ? (editingPet ? 'Editar Mascota' : 'Agregar Mascota') : 'Mis Mascotas'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!isEditing ? (
            // Lista de mascotas
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Tus Mascotas</h3>
                <button
                  onClick={handleNewPet}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Mascota
                </button>
              </div>

              {userProfile?.pets && userProfile.pets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProfile.pets.map((pet) => (
                    <div key={pet.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                          {speciesOptions.find(s => s.value === pet.species)?.emoji || '🐾'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{pet.name}</h4>
                          <p className="text-gray-600 text-sm">
                            {speciesOptions.find(s => s.value === pet.species)?.label} • {pet.age} años
                          </p>
                        </div>
                      </div>
                      
                      {pet.bio && (
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{pet.bio}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pet.personality.slice(0, 3).map((trait, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {trait}
                          </span>
                        ))}
                        {pet.personality.length > 3 && (
                          <span className="text-gray-500 text-xs">+{pet.personality.length - 3} más</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          pet.privacy === 'public' ? 'bg-green-100 text-green-800' :
                          pet.privacy === 'friends' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pet.privacy === 'public' ? 'Público' :
                           pet.privacy === 'friends' ? 'Solo Amigos' : 'Privado'}
                        </span>
                        <button
                          onClick={() => handleEditPet(pet)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🐾</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes mascotas registradas</h3>
                  <p className="text-gray-500 mb-6">Agrega tu primera mascota para comenzar a compartir momentos especiales</p>
                  <button
                    onClick={handleNewPet}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-5 w-5" />
                    Agregar Primera Mascota
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Formulario de mascota
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la mascota *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Luna, Max, Bella"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especie *
                  </label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {speciesOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Raza
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Golden Retriever, Persa, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad (años) *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacidad
                  </label>
                  <select
                    name="privacy"
                    value={formData.privacy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="public">Público</option>
                    <option value="friends">Solo Amigos</option>
                    <option value="private">Privado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ciudad, País"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografía
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cuéntanos sobre la personalidad y características especiales de tu mascota..."
                />
              </div>

              {/* Personalidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personalidad
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.personality.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {trait}
                      <button
                        type="button"
                        onClick={() => handleRemovePersonality(trait)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newPersonality}
                    onChange={(e) => setNewPersonality(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar rasgo...</option>
                    {personalityTraits.map(trait => (
                      <option key={trait} value={trait}>{trait}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddPersonality}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Intereses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intereses
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar interés...</option>
                    {interestOptions.map(interest => (
                      <option key={interest} value={interest}>{interest}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Vacunas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vacunas
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.vaccines.map((vaccine, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {vaccine}
                      <button
                        type="button"
                        onClick={() => handleRemoveVaccine(vaccine)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVaccine}
                    onChange={(e) => setNewVaccine(e.target.value)}
                    placeholder="Nombre de la vacuna"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddVaccine}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingPet ? 'Actualizar Mascota' : 'Agregar Mascota'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
