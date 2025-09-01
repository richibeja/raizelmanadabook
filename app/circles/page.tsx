'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, Users, Star, MapPin } from 'lucide-react';
import CircleCard from '../components/CircleCard';
import { useCircles } from '../hooks/useCircles';

const categories = [
  { name: 'Todos', value: '' },
  { name: 'Perros', value: 'Perros' },
  { name: 'Gatos', value: 'Gatos' },
  { name: 'Aves', value: 'Aves' },
  { name: 'Peces', value: 'Peces' },
  { name: 'Reptiles', value: 'Reptiles' },
  { name: 'Roedores', value: 'Roedores' },
  { name: 'Caballos', value: 'Caballos' },
  { name: 'Adopción', value: 'Adopción' },
  { name: 'Salud', value: 'Salud' },
  { name: 'Entrenamiento', value: 'Entrenamiento' },
  { name: 'Eventos', value: 'Eventos' },
  { name: 'Comercio', value: 'Comercio' },
];

const types = [
  { name: 'Todos', value: '' },
  { name: 'Públicos', value: 'public' },
  { name: 'Privados', value: 'private' },
  { name: 'Secretos', value: 'secret' },
];

export default function CirclesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFeatured, setShowFeatured] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { circles, loading, error } = useCircles();

  const handleJoinCircle = async (circle: any) => {
    try {
      // await joinCircle(circle.id);
      console.log('Joining circle:', circle.id);
      // El hook ya actualiza el estado automáticamente
    } catch (error) {
      console.error('Error al unirse al círculo:', error);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedType('');
    setShowFeatured(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Círculos</h1>
              <p className="text-gray-600 mt-1">
                Únete a comunidades de mascotas y conecta con otros amantes de animales
              </p>
            </div>
            <Link
              href="/circles/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Círculo
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar círculos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opciones
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={showFeatured}
                    onChange={(e) => setShowFeatured(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                    Solo destacados
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md animate-pulse">
                <div className="h-32 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : circles.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron círculos
            </h3>
            <p className="text-gray-600 mb-6">
              {search || selectedCategory || selectedType || showFeatured
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Aún no hay círculos creados. ¡Sé el primero en crear uno!'}
            </p>
            {!search && !selectedCategory && !selectedType && !showFeatured && (
              <Link
                href="/circles/create"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crear Primer Círculo
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {circles.length} círculo{circles.length !== 1 ? 's' : ''} encontrado{circles.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{circles.filter(c => (c as any).is_featured).length} destacados</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{circles.filter(c => (c as any).location).length} con ubicación</span>
                </div>
              </div>
            </div>

            {/* Circles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {circles.map((circle) => (
                <CircleCard
                  key={circle.id}
                  circle={circle}
                  onJoin={handleJoinCircle}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
