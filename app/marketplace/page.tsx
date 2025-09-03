'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Grid, List, Plus, Heart, Eye, MapPin, 
  Clock, Star, ShoppingCart, Truck, User
} from 'lucide-react';
import { useMarketplace, useMarketplaceFavorites } from '../hooks/useMarketplace';
import { useAuthContext } from '../contexts/AuthContext';

const categories = [
  { value: '', label: 'Todas las categorías', emoji: '🛍️' },
  { value: 'food', label: 'Alimentación', emoji: '🍖' },
  { value: 'toys', label: 'Juguetes', emoji: '🎾' },
  { value: 'accessories', label: 'Accesorios', emoji: '🦴' },
  { value: 'health', label: 'Salud', emoji: '🏥' },
  { value: 'services', label: 'Servicios', emoji: '🎯' },
  { value: 'other', label: 'Otros', emoji: '📦' },
];

const cities = [
  { value: '', label: 'Todas las ciudades' },
  { value: 'Bogotá', label: 'Bogotá' },
  { value: 'Medellín', label: 'Medellín' },
  { value: 'Cali', label: 'Cali' },
  { value: 'Barranquilla', label: 'Barranquilla' },
  { value: 'Cartagena', label: 'Cartagena' },
  { value: 'Bucaramanga', label: 'Bucaramanga' },
];

export default function MarketplacePage() {
  const { user } = useAuthContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceMin, setPriceMin] = useState<number | undefined>();
  const [priceMax, setPriceMax] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtros tiempo real Firebase
  const marketplaceFilters = {
    category: selectedCategory || undefined,
    city: selectedCity || undefined,
    priceMin,
    priceMax,
    search: search || undefined,
    limit: 50
  };

  const { items, loading, error } = useMarketplace(marketplaceFilters);
  const { addFavorite, removeFavorite, isFavorite } = useMarketplaceFavorites();

  const formatPrice = (price: number, currency: string = 'COP') => {
    if (currency === 'COP') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(price);
    }
    return `$${price}`;
  };

  const handleFavoriteToggle = async (itemId: string) => {
    if (!user) return;
    
    if (isFavorite(itemId)) {
      await removeFavorite(itemId);
    } else {
      await addFavorite(itemId);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedCity('');
    setPriceMin(undefined);
    setPriceMax(undefined);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
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
              <h1 className="text-3xl font-bold text-gray-900">ManadaBook Marketplace</h1>
              <p className="text-gray-600 mt-1">
                Compra y vende productos para mascotas en la comunidad Raízel
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/marketplace/sell"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Vender Artículo
              </Link>
              {user && (
                <Link
                  href="/marketplace/my-listings"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <User className="w-4 h-4" />
                  Mis Publicaciones
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar productos para mascotas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category */}
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
                      {category.emoji} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
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
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Mínimo
                </label>
                <input
                  type="number"
                  value={priceMin || ''}
                  onChange={(e) => setPriceMin(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Ej: 10000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio Máximo
                </label>
                <input
                  type="number"
                  value={priceMax || ''}
                  onChange={(e) => setPriceMax(e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Ej: 500000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                🔄 <strong>Resultados en tiempo real</strong> - Los precios y disponibilidad se actualizan automáticamente
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {items.length} artículo{items.length !== 1 ? 's' : ''} encontrado{items.length !== 1 ? 's' : ''}
            {selectedCity && ` en ${selectedCity}`}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{items.filter(item => item.isPromoted).length} promocionados</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>{items.filter(item => item.shipping.available).length} con envío</span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Items Grid */}
        {!loading && items.length > 0 && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            {items.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : 'overflow-hidden'
                }`}
              >
                {/* Image */}
                <div className={viewMode === 'grid' ? 'relative h-48' : 'w-32 h-32 flex-shrink-0'}>
                  <img
                    src={item.photos[0] || '/api/placeholder/300/200'}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  
                  {/* Favorite Heart */}
                  {user && (
                    <button
                      onClick={() => handleFavoriteToggle(item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${isFavorite(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                      />
                    </button>
                  )}
                  
                  {/* Promoted Badge */}
                  {item.isPromoted && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                      ⭐ PROMOCIONADO
                    </div>
                  )}
                  
                  {/* Condition */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {item.condition === 'new' ? 'Nuevo' : 
                     item.condition === 'like-new' ? 'Como nuevo' : 
                     item.condition === 'good' ? 'Buen estado' : 'Estado regular'}
                  </div>
                </div>

                {/* Content */}
                <div className={viewMode === 'grid' ? 'p-4' : 'flex-1'}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    {viewMode === 'list' && user && (
                      <button
                        onClick={() => handleFavoriteToggle(item.id)}
                        className="p-1"
                      >
                        <Heart 
                          className={`w-4 h-4 ${isFavorite(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                        />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location.city}, {item.location.country}
                    {item.shipping.available && (
                      <span className="ml-2 text-green-600">
                        <Truck className="w-3 h-3 inline mr-1" />
                        Envío disponible
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {formatPrice(item.price, item.currency)}
                      </p>
                      {item.shipping.available && item.shipping.cost && (
                        <p className="text-xs text-gray-500">
                          + {formatPrice(item.shipping.cost)} envío
                        </p>
                      )}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      categories.find(c => c.value === item.category)?.emoji
                    } bg-gray-100 text-gray-700`}>
                      {categories.find(c => c.value === item.category)?.label || item.category}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {item.stats.viewsCount}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {item.stats.favoritesCount}
                      </span>
                    </div>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/marketplace/${item.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                    >
                      Ver Detalles
                    </Link>
                    <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron artículos
            </h3>
            <p className="text-gray-600 mb-6">
              {search || selectedCategory || selectedCity || priceMin || priceMax
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Aún no hay artículos publicados. ¡Sé el primero en vender algo!'
              }
            </p>
            {!search && !selectedCategory && !selectedCity && (
              <Link
                href="/marketplace/sell"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Publicar Primer Artículo
              </Link>
            )}
          </div>
        )}

        {/* Featured Categories Quick Access */}
        {!search && !selectedCategory && !loading && (
          <div className="mt-12 bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Categorías Populares
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(1).map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <p className="text-sm font-medium text-gray-700">{category.label}</p>
                  <p className="text-xs text-gray-500">
                    {items.filter(item => item.category === category.value).length} artículos
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}