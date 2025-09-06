'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Hash, User, Video } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'video' | 'user' | 'hashtag';
  title: string;
  subtitle: string;
  thumbnail?: string;
  avatar?: string;
  count?: number;
}

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [trending, setTrending] = useState<string[]>([
    '#perros',
    '#gatos',
    '#mascotas',
    '#divertido',
    '#cachorros'
  ]);
  const [recent, setRecent] = useState<string[]>([
    '#goldenretriever',
    '#gatitos',
    '#jugar'
  ]);

  useEffect(() => {
    if (query.length > 0) {
      // Simular búsqueda
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'video',
          title: 'Mi perro jugando en el parque',
          subtitle: 'PetLover23 • 2.3K vistas',
          thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
        },
        {
          id: '2',
          type: 'user',
          title: 'PetLover23',
          subtitle: '1.2K seguidores • 45 videos',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        {
          id: '3',
          type: 'hashtag',
          title: '#perros',
          subtitle: '12.5K videos',
          count: 12500
        }
      ];
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  const handleTrendingClick = (trend: string) => {
    setQuery(trend);
  };

  const handleRecentClick = (recent: string) => {
    setQuery(recent);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'user':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'hashtag':
        return <Hash className="w-4 h-4 text-green-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar videos, usuarios, hashtags..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {query.length === 0 ? (
            /* Trending and Recent when no query */
            <div className="p-4 space-y-6">
              {/* Trending */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <h3 className="text-white font-semibold">Tendencias</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleTrendingClick(trend)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent */}
              <div>
                <h3 className="text-white font-semibold mb-3">Recientes</h3>
                <div className="space-y-2">
                  {recent.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(item)}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Search Results */
            <div className="p-4">
              {results.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p>No se encontraron resultados</p>
                  <p className="text-sm">Intenta con otros términos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {result.thumbnail ? (
                        <img
                          src={result.thumbnail}
                          alt={result.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : result.avatar ? (
                        <img
                          src={result.avatar}
                          alt={result.title}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          {getResultIcon(result.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          {getResultIcon(result.type)}
                          <span className="text-white font-medium text-sm">
                            {result.title}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          {result.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
