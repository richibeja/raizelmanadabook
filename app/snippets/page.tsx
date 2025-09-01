'use client';

import React, { useState, useEffect } from 'react';
import { useSnippets, SnippetsFilters } from '../hooks/useSnippets';
import SnippetCard from '../components/SnippetCard';
import { Search, Filter, TrendingUp, Star, Video, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SnippetsPage() {
  const {
    snippets,
    loading,
    error,
    total,
    hasMore,
    fetchSnippets,
    likeSnippet,
    unlikeSnippet,
    shareSnippet,
    loadMoreSnippets
  } = useSnippets();

  const [filters, setFilters] = useState<SnippetsFilters>({
    limit: 12,
    sort: 'created_at',
    order: 'desc'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFeatured, setShowFeatured] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [likedSnippets, setLikedSnippets] = useState<Set<string>>(new Set());

  // Categories for filtering
  const categories = [
    { id: '', name: 'Todas', icon: Video },
    { id: 'mascotas-divertidas', name: 'Mascotas Divertidas', icon: TrendingUp },
    { id: 'adiestramiento', name: 'Adiestramiento', icon: Star },
    { id: 'salud-cuidado', name: 'Salud y Cuidado', icon: Star },
    { id: 'aventuras', name: 'Aventuras', icon: Star },
    { id: 'comida-recetas', name: 'Comida y Recetas', icon: Star },
    { id: 'adopcion', name: 'Adopción', icon: Star },
    { id: 'razas-especificas', name: 'Razas Específicas', icon: Star },
    { id: 'consejos-veterinarios', name: 'Consejos Veterinarios', icon: Star }
  ];

  // Apply filters
  useEffect(() => {
    const newFilters: SnippetsFilters = {
      limit: 12,
      sort: 'created_at',
      order: 'desc'
    };

    if (searchTerm) {
      newFilters.author = searchTerm;
    }

    if (selectedCategory) {
      newFilters.category = selectedCategory;
    }

    if (showFeatured) {
      newFilters.featured = true;
    }

    if (showTrending) {
      newFilters.trending = true;
    }

    setFilters(newFilters);
    fetchSnippets(newFilters);
  }, [searchTerm, selectedCategory, showFeatured, showTrending, fetchSnippets]);

  // Handle like/unlike
  const handleLike = async (snippetId: string) => {
    const isLiked = likedSnippets.has(snippetId);
    
    if (isLiked) {
      await unlikeSnippet(snippetId);
      setLikedSnippets(prev => {
        const newSet = new Set(prev);
        newSet.delete(snippetId);
        return newSet;
      });
    } else {
      await likeSnippet(snippetId);
      setLikedSnippets(prev => new Set(prev).add(snippetId));
    }
  };

  // Handle share
  const handleShare = async (snippetId: string) => {
    await shareSnippet(snippetId);
    // In a real implementation, you might want to show a share dialog
    alert('¡Snippet compartido!');
  };

  // Handle view
  const handleView = (snippetId: string) => {
    // In a real implementation, you might want to track views
    console.log('Snippet viewed:', snippetId);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMoreSnippets(filters);
    }
  };

  // Format total count
  const formatTotal = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Snippets</h1>
              <p className="text-sm text-gray-600">
                Descubre videos cortos de mascotas increíbles
              </p>
            </div>
            <Link
              href="/snippets/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Snippet
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar por autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex-shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured/Trending Toggles */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFeatured(!showFeatured)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  showFeatured
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <Star className="w-4 h-4 inline mr-1" />
                Destacados
              </button>
              <button
                onClick={() => setShowTrending(!showTrending)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  showTrending
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Tendencia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {loading ? (
                <span>Cargando...</span>
              ) : (
                <span>
                  {formatTotal(total)} snippets encontrados
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {snippets.length > 0 && (
                <span>
                  Mostrando {snippets.length} de {formatTotal(total)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Snippets Grid */}
        {snippets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onLike={handleLike}
                onShare={handleShare}
                onView={handleView}
                isLiked={likedSnippets.has(snippet.id)}
                showAuthor={true}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron snippets
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory || showFeatured || showTrending
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Sé el primero en crear un snippet de mascotas'}
            </p>
            {!searchTerm && !selectedCategory && !showFeatured && !showTrending && (
              <Link
                href="/snippets/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Snippet
              </Link>
            )}
          </div>
        ) : null}

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Cargar más snippets'
              )}
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && snippets.length === 0 && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
