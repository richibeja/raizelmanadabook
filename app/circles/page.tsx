'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, Users, Star, MapPin } from 'lucide-react';
import CircleCard from '../components/CircleCard';
import { useCircles, useUserCircles } from '../hooks/useCircles';

const categories = [
  { name: 'Todos', value: '' },
  { name: 'Perros', value: 'perros' },
  { name: 'Gatos', value: 'gatos' },
  { name: 'BARF', value: 'barf' },
  { name: 'Adopción', value: 'adopcion' },
  { name: 'Salud', value: 'salud' },
  { name: 'Entrenamiento', value: 'entrenamiento' },
  { name: 'Eventos', value: 'eventos' },
  { name: 'Raízel', value: 'raizel' },
  { name: 'Local', value: 'local' },
];

const cities = [
  { name: 'Todas las ciudades', value: '' },
  { name: 'Bogotá', value: 'Bogotá' },
  { name: 'Medellín', value: 'Medellín' },
  { name: 'Cali', value: 'Cali' },
  { name: 'Barranquilla', value: 'Barranquilla' },
  { name: 'Cartagena', value: 'Cartagena' },
  { name: 'Bucaramanga', value: 'Bucaramanga' },
  { name: 'Pereira', value: 'Pereira' },
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
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFeatured, setShowFeatured] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'my-circles'>('discover');

  // Filtros tiempo real Firebase
  const circleFilters = {
    city: selectedCity || undefined,
    tags: selectedCategory ? [selectedCategory] : undefined,
    limit: 20
  };

  const { circles, loading, error } = useCircles();
  const { userCircles, loading: userLoading } = useUserCircles();

  const handleJoinCircle = async (circle: any) => {
    try {
      console.log('Joined circle successfully:', circle.name);
    } catch (error) {
      console.error('Error al unirse al círculo:', error);
    }
  };

  const handleLeaveCircle = async (circle: any) => {
    try {
      console.log('Left circle successfully:', circle.name);
    } catch (error) {
      console.error('Error al salir del círculo:', error);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedCity('');
    setSelectedType('');
    setShowFeatured(false);
  };

  // Filtrar círculos por búsqueda local
  const filteredCircles = (activeTab === 'discover' ? circles : userCircles).filter(circle => {
    if (!search) return true;
    const searchTerm = search.toLowerCase();
    return (
      circle.name.toLowerCase().includes(searchTerm) ||
      circle.description.toLowerCase().includes(searchTerm) ||
      (circle as any).tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
    );
  });

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
      {/* Header - Responsive */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Círculos</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Únete a comunidades de mascotas y conecta con otros amantes de animales
              </p>
            </div>
            <Link
              href="/circles/create"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Crear Círculo</span>
              <span className="sm:hidden">Crear</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('discover')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Descubrir Círculos
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {circles.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('my-circles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-circles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mis Círculos
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {userCircles.length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar - Responsive */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder={`Buscar ${activeTab === 'discover' ? 'círculos...' : 'en mis círculos...'}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

              {/* City Filter (Discovery only) */}
              {activeTab === 'discover' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cities.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                <div className="space-y-2">
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
                  {activeTab === 'discover' && (
                    <p className="text-xs text-gray-500">
                      🔄 Resultados en tiempo real
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {(loading || userLoading) ? (
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
        ) : filteredCircles.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'my-circles' 
                ? 'No tienes círculos aún'
                : 'No se encontraron círculos'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'my-circles' ? (
                search ? 'No hay círculos que coincidan con tu búsqueda' : '¡Únete a tu primer círculo o crea uno nuevo!'
              ) : (
                search || selectedCategory || selectedCity || selectedType || showFeatured
                  ? 'Intenta ajustar tus filtros de búsqueda'
                  : 'Aún no hay círculos creados. ¡Sé el primero en crear uno!'
              )}
            </p>
            {(activeTab === 'discover' && !search && !selectedCategory && !selectedCity) && (
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
              <div>
                <p className="text-gray-600">
                  {filteredCircles.length} círculo{filteredCircles.length !== 1 ? 's' : ''} 
                  {activeTab === 'my-circles' ? ' tuyo' : ' encontrado'}{filteredCircles.length !== 1 ? 's' : ''}
                </p>
                {activeTab === 'discover' && (
                  <p className="text-sm text-gray-500 mt-1">
                    🔄 Actualizando en tiempo real {selectedCity && `• ${selectedCity}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{filteredCircles.filter(c => (c as any).is_featured).length} destacados</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{filteredCircles.filter(c => (c as any).location).length} con ubicación</span>
                </div>
              </div>
            </div>

            {/* Circles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCircles.map((circle) => (
                <CircleCard
                  key={circle.id}
                  circle={{
                    ...circle,
                    member_count: (circle as any).memberCount || 0,
                    is_private: (circle as any).isPrivate || false,
                    created_by: (circle as any).createdBy || '',
                    created_at: (circle as any).createdAt || new Date(),
                    updated_at: (circle as any).updatedAt || new Date()
                  }}
                  onJoin={activeTab === 'discover' ? handleJoinCircle : undefined}
                  onView={(c) => window.location.href = `/circles/${c.id}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
