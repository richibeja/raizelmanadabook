'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '../contexts/AuthContext';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePetsRealtime } from '../hooks/usePetsRealtime';
import { Camera, Edit3, Plus, MapPin, Users, Heart, Calculator } from 'lucide-react';
import '../globals.css';

export default function ProfilePage() {
  const { user, signOut } = useAuthContext();
  const { profile, pets, loading: profileLoading, updateProfile } = useUserProfile();
  const { addPet, loading: petLoading } = usePetsRealtime();
  const [editing, setEditing] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);

  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    city: '',
    country: 'Colombia'
  });

  const [petForm, setPetForm] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat',
    breed: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female',
    weight: '',
    bio: '',
    isPublic: true
  });

  React.useEffect(() => {
    if (profile && !editing) {
      setEditForm({
        displayName: profile.displayName || '',
        bio: profile.bio || '',
        city: profile.location?.city || '',
        country: profile.location?.country || 'Colombia'
      });
    }
  }, [profile, editing]);

  const handleUpdateProfile = async () => {
    if (!profile) return;

    await updateProfile({
      displayName: editForm.displayName,
      bio: editForm.bio,
      location: {
        city: editForm.city,
        country: editForm.country
      }
    });
    setEditing(false);
  };

  const handleAddPet = async () => {
    const petData = {
      name: petForm.name,
      species: petForm.species,
      breed: petForm.breed,
      birthDate: petForm.birthDate ? new Date(petForm.birthDate) : undefined,
      gender: petForm.gender,
      weight: petForm.weight ? parseFloat(petForm.weight) : undefined,
      bio: petForm.bio,
      isPublic: petForm.isPublic,
      medicalInfo: {
        vaccinated: false,
        spayed: false,
        allergies: [],
        conditions: []
      }
    };

    const petId = await addPet(petData);
    if (petId) {
      setShowAddPet(false);
      setPetForm({
        name: '',
        species: 'dog',
        breed: '',
        birthDate: '',
        gender: 'male',
        weight: '',
        bio: '',
        isPublic: true
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso requerido
          </h1>
          <p className="text-gray-600 mb-6">
            Inicia sesión para ver tu perfil de ManadaBook
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil ManadaBook</h1>
            <button
              onClick={signOut}
              className="text-gray-600 hover:text-gray-900"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Perfil Usuario */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user.photoURL || '/api/placeholder/80/80'}
                  alt={profile?.displayName || user.displayName || 'Usuario'}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({...prev, displayName: e.target.value}))}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    profile?.displayName || user.displayName || profile?.username || 'Usuario'
                  )}
                </h2>
                <p className="text-gray-600">@{profile?.username || 'usuario'}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
                
                {profile?.location && (
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm(prev => ({...prev, city: e.target.value}))}
                        placeholder="Ciudad"
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      />
                    ) : (
                      `${profile.location.city}, ${profile.location.country}`
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (editing) {
                  handleUpdateProfile();
                } else {
                  setEditing(true);
                }
              }}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              {editing ? 'Guardar' : 'Editar'}
            </button>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Biografía</h3>
            {editing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({...prev, bio: e.target.value}))}
                placeholder="Cuéntanos sobre ti y tus mascotas..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-600">
                {profile?.bio || 'Amante de las mascotas y la alimentación natural Raízel 🐾'}
              </p>
            )}
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile?.stats.petsCount || 0}</p>
              <p className="text-sm text-gray-600">Mascotas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile?.stats.postsCount || 0}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile?.stats.followersCount || 0}</p>
              <p className="text-sm text-gray-600">Seguidores</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile?.stats.followingCount || 0}</p>
              <p className="text-sm text-gray-600">Siguiendo</p>
            </div>
          </div>
        </div>

        {/* Mascotas */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Mis Mascotas ({pets.length})
            </h3>
            <button
              onClick={() => setShowAddPet(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Mascota
            </button>
          </div>

          {/* Grid de mascotas */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map(pet => (
              <div key={pet.id} className="border border-gray-200 rounded-lg p-4">
                <img
                  src={pet.photoURL || '/api/placeholder/100/100'}
                  alt={pet.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold">{pet.name}</h4>
                <p className="text-sm text-gray-600">
                  {pet.species} {pet.breed && `• ${pet.breed}`}
                </p>
                {pet.weight && (
                  <p className="text-xs text-gray-500">{pet.weight}kg</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <Heart className="w-3 h-3 mr-1" />
                    {pet.stats.followersCount}
                  </div>
                  <button className="text-blue-600 text-xs hover:underline">
                    Ver perfil
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pets.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Aún no tienes mascotas registradas</p>
              <p className="text-sm">¡Agrega tu primera mascota para empezar en ManadaBook!</p>
            </div>
          )}
        </div>

        {/* Modal Agregar Mascota */}
        {showAddPet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Agregar Nueva Mascota</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={petForm.name}
                    onChange={(e) => setPetForm(prev => ({...prev, name: e.target.value}))}
                    placeholder="Nombre de tu mascota"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Especie</label>
                    <select
                      value={petForm.species}
                      onChange={(e) => setPetForm(prev => ({...prev, species: e.target.value as 'dog' | 'cat'}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="dog">Perro</option>
                      <option value="cat">Gato</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                    <select
                      value={petForm.gender}
                      onChange={(e) => setPetForm(prev => ({...prev, gender: e.target.value as 'male' | 'female'}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="male">Macho</option>
                      <option value="female">Hembra</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
                  <input
                    type="text"
                    value={petForm.breed}
                    onChange={(e) => setPetForm(prev => ({...prev, breed: e.target.value}))}
                    placeholder="Ej: Golden Retriever"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento</label>
                    <input
                      type="date"
                      value={petForm.birthDate}
                      onChange={(e) => setPetForm(prev => ({...prev, birthDate: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      value={petForm.weight}
                      onChange={(e) => setPetForm(prev => ({...prev, weight: e.target.value}))}
                      placeholder="15.5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={petForm.bio}
                    onChange={(e) => setPetForm(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Cuéntanos sobre la personalidad de tu mascota..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={petForm.isPublic}
                    onChange={(e) => setPetForm(prev => ({...prev, isPublic: e.target.checked}))}
                    className="mr-2"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Perfil público en ManadaBook
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddPet(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddPet}
                  disabled={!petForm.name || petLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {petLoading ? 'Guardando...' : 'Agregar Mascota'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navegación rápida */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link
            href="/feed"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition-shadow"
          >
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">Feed ManadaBook</p>
          </Link>
          
          <Link
            href="/calculadora"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition-shadow"
          >
            <Calculator className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">Calculadora BARF</p>
          </Link>
          
          <Link
            href="/hacer-pedido"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition-shadow"
          >
            <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
            <p className="text-sm font-medium">Productos Raízel</p>
          </Link>
          
          <Link
            href="/aliados"
            className="bg-white p-4 rounded-lg border text-center hover:shadow-md transition-shadow"
          >
            <MapPin className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">Aliados</p>
          </Link>
        </div>
      </div>
    </div>
  );
}




