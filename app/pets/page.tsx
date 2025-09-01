'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PetProfileForm from '../components/PetProfileForm';
import { usePets } from '../hooks/usePets';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';

export default function PetsPage() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');

  const { pets, loading, error, createPet } = usePets({
    search: searchTerm,
    species: filterSpecies,
    limit: 20
  });

  const speciesOptions = Array.from(new Set(pets.map(pet => pet.species)));

  const handleCreatePet = async (petData: any) => {
    try {
      await createPet({
        ...petData,
        owner_id: '1', // Simular usuario actual
        followers_count: 0,
        posts_count: 0
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error al crear mascota:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando mascotas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Perfiles de Mascotas
          </h1>
          <p className="text-gray-600">
            Descubre y conecta con mascotas increíbles de todo tipo
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar mascotas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filtro por especie */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterSpecies}
                  onChange={(e) => setFilterSpecies(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Todas las especies</option>
                  {speciesOptions.map(species => (
                    <option key={species} value={species}>{species}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón agregar mascota */}
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar Mascota
            </button>
          </div>
        </div>

        {/* Grid de mascotas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {pets.map(pet => (
            <div key={pet.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Imagen de portada */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                {pet.avatar_url ? (
                  <img 
                    src={pet.avatar_url} 
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl">
                      {pet.species === 'Perro' ? '🐕' : 
                       pet.species === 'Gato' ? '🐱' : 
                       pet.species === 'Perico' ? '🦜' : '🐾'}
                    </div>
                  </div>
                )}
                
                {/* Overlay con información básica */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{pet.name}</h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <span>{pet.species}</span>
                    {pet.breed && (
                      <>
                        <span>•</span>
                        <span>{pet.breed}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Información rápida */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Edad:</span>
                    <span className="font-medium">{pet.age_estimated || 'No especificada'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Ubicación:</span>
                    <span className="font-medium">{pet.pet_location || 'No especificada'}</span>
                  </div>
                </div>

                {pet.personality && (
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {pet.personality}
                    </span>
                  </div>
                )}

                {pet.bio && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {pet.bio}
                  </p>
                )}

                {/* Intereses */}
                {pet.interests && pet.interests.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Intereses:</div>
                    <div className="flex flex-wrap gap-1">
                      {pet.interests.slice(0, 3).map(interest => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {pet.interests.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{pet.interests.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats y acciones */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{pet.followers_count} seguidores</span>
                    <span>{pet.posts_count} posts</span>
                  </div>
                  <Link
                    href={`/pets/${pet.id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors"
                  >
                    Ver Perfil
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal para formulario de mascota */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Agregar Nueva Mascota</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <PetProfileForm
                  onSubmit={handleCreatePet}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mensaje si no hay resultados */}
        {pets.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron mascotas
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros de búsqueda o agrega la primera mascota
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
