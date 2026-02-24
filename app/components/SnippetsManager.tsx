'use client';

import React, { useState } from 'react';
import { useSnippets } from '@/hooks/useSnippets';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Plus, Play, Heart, Share2, MessageCircle, Eye, Clock, MapPin, Tag, Search } from 'lucide-react';

interface SnippetsManagerProps {
  onClose: () => void;
}

export default function SnippetsManager({ onClose }: SnippetsManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    snippets, 
    mySnippets, 
    trendingSnippets, 
    loading, 
    createSnippet, 
    viewSnippet, 
    likeSnippet, 
    shareSnippet, 
    deleteSnippet 
  } = useSnippets();
  
  const [activeTab, setActiveTab] = useState<'discover' | 'trending' | 'my-snippets' | 'create'>('discover');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: 0,
    petId: '',
    petName: '',
    petSpecies: '',
    location: '',
    tags: [] as string[],
    category: 'funny' as 'funny' | 'cute' | 'training' | 'adventure' | 'health' | 'tips' | 'other',
  });
  const [newTag, setNewTag] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState<any>(null);
  const [showSnippetViewer, setShowSnippetViewer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: 'funny', label: '😂 Divertido', icon: '😂' },
    { value: 'cute', label: '🥰 Tierno', icon: '🥰' },
    { value: 'training', label: '🎓 Entrenamiento', icon: '🎓' },
    { value: 'adventure', label: '🏔️ Aventura', icon: '🏔️' },
    { value: 'health', label: '🏥 Salud', icon: '🏥' },
    { value: 'tips', label: '💡 Consejos', icon: '💡' },
    { value: 'other', label: '🔗 Otros', icon: '🔗' },
  ];

  const handleCreateSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.title.trim()) return;
    if (!createFormData.videoUrl.trim()) return;

    try {
      await createSnippet({
        title: createFormData.title,
        description: createFormData.description,
        videoUrl: createFormData.videoUrl,
        thumbnailUrl: createFormData.thumbnailUrl,
        duration: createFormData.duration,
        petId: createFormData.petId,
        petName: createFormData.petName,
        petSpecies: createFormData.petSpecies,
        location: createFormData.location,
        tags: createFormData.tags,
        category: createFormData.category,
      });
      
      // Reset form
      setCreateFormData({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: 0,
        petId: '',
        petName: '',
        petSpecies: '',
        location: '',
        tags: [],
        category: 'funny',
      });
      setShowCreateForm(false);
      setActiveTab('my-snippets');
    } catch (error) {
      console.error('Error creating snippet:', error);
      alert('Error al crear el snippet');
    }
  };

  const handleViewSnippet = async (snippet: any) => {
    setSelectedSnippet(snippet);
    setShowSnippetViewer(true);
    
    try {
      await viewSnippet(snippet.id);
    } catch (error) {
      console.error('Error viewing snippet:', error);
    }
  };

  const handleLikeSnippet = async (snippetId: string) => {
    try {
      await likeSnippet(snippetId);
    } catch (error) {
      console.error('Error liking snippet:', error);
    }
  };

  const handleShareSnippet = async (snippetId: string) => {
    try {
      await shareSnippet(snippetId);
      // TODO: Implementar compartir nativo
      if (navigator.share) {
        await navigator.share({
          title: 'Mira este snippet en ManadaBook',
          text: '¡Echa un vistazo a este increíble snippet de mascotas!',
          url: window.location.href,
        });
      }
    } catch (error) {
      console.error('Error sharing snippet:', error);
    }
  };

  const handleDeleteSnippet = async (snippetId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este snippet?')) {
      try {
        await deleteSnippet(snippetId);
      } catch (error) {
        console.error('Error deleting snippet:', error);
        alert('Error al eliminar el snippet');
      }
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !createFormData.tags.includes(newTag.trim())) {
      setCreateFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCreateFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString('es-ES');
  };

  const SnippetCard = ({ snippet, showDeleteButton = false }: { snippet: any; showDeleteButton?: boolean }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-100">
          {snippet.thumbnailUrl ? (
            <img
              src={snippet.thumbnailUrl}
              alt={snippet.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
              <Play className="h-12 w-12 text-white" />
            </div>
          )}
          
          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formatDuration(snippet.duration)}
          </div>
          
          {/* Category */}
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded">
            {categories.find(c => c.value === snippet.category)?.icon} {categories.find(c => c.value === snippet.category)?.label}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {snippet.authorName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{snippet.authorName}</h3>
                <span className="text-xs text-gray-500">{formatTimeAgo(snippet.createdAt)}</span>
              </div>
            </div>
            
            {showDeleteButton && (
              <button
                onClick={() => handleDeleteSnippet(snippet.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <h4 className="font-semibold text-lg mb-2 line-clamp-2">{snippet.title}</h4>
          
          {snippet.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{snippet.description}</p>
          )}

          {snippet.petName && (
            <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
              <span>🐾</span>
              <span>{snippet.petName} ({snippet.petSpecies})</span>
            </div>
          )}

          {snippet.tags && snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {snippet.tags.slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
              {snippet.tags.length > 3 && (
                <span className="text-gray-500 text-xs">+{snippet.tags.length - 3} más</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{snippet.viewsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className={`h-4 w-4 ${snippet.userLiked ? 'text-red-500 fill-current' : ''}`} />
                <span>{snippet.likesCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{snippet.commentsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span>{snippet.sharesCount}</span>
              </div>
            </div>
            
            {snippet.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{snippet.location}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleViewSnippet(snippet)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Play className="h-4 w-4 inline mr-1" />
              Ver
            </button>
            <button
              onClick={() => handleLikeSnippet(snippet.id)}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                snippet.userLiked 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${snippet.userLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => handleShareSnippet(snippet.id)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getCurrentSnippets = () => {
    switch (activeTab) {
      case 'discover':
        return snippets;
      case 'trending':
        return trendingSnippets;
      case 'my-snippets':
        return mySnippets;
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Snippets</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-pink-100 mt-2">
            Videos cortos de mascotas, estilo TikTok
          </p>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar snippets..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Descubrir
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'trending'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trending ({trendingSnippets.length})
            </button>
            <button
              onClick={() => setActiveTab('my-snippets')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'my-snippets'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mis Snippets ({mySnippets.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-b-2 border-pink-600 text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Crear Snippet
            </button>
          </div>

          {/* Content */}
          {activeTab === 'create' ? (
            <form onSubmit={handleCreateSnippet} className="max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del snippet *
                  </label>
                  <input
                    type="text"
                    value={createFormData.title}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ej: Mi perro aprendiendo a dar la pata"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Describe tu snippet..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL del video *
                    </label>
                    <input
                      type="url"
                      value={createFormData.videoUrl}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de la miniatura
                    </label>
                    <input
                      type="url"
                      value={createFormData.thumbnailUrl}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración (segundos)
                    </label>
                    <input
                      type="number"
                      value={createFormData.duration}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={createFormData.category}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={createFormData.location}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="¿Dónde se grabó?"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiquetas
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {createFormData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-pink-600 hover:text-pink-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Agregar etiqueta..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setActiveTab('discover')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Crear Snippet
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">🎬</div>
                  <div className="text-gray-600">Cargando snippets...</div>
                </div>
              ) : getCurrentSnippets().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📹</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {activeTab === 'my-snippets' ? 'No has creado ningún snippet' :
                     activeTab === 'trending' ? 'No hay snippets trending' :
                     'No hay snippets disponibles'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === 'my-snippets' ? 'Crea tu primer snippet de mascotas' :
                     activeTab === 'trending' ? 'Los snippets trending aparecerán aquí' :
                     'Crea contenido o espera a que otros usuarios compartan'}
                  </p>
                  {activeTab !== 'trending' && (
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Crear Snippet
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentSnippets().map((snippet) => (
                    <SnippetCard 
                      key={snippet.id} 
                      snippet={snippet} 
                      showDeleteButton={activeTab === 'my-snippets'}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Snippet Viewer Modal */}
      {showSnippetViewer && selectedSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{selectedSnippet.title}</h3>
                <button
                  onClick={() => setShowSnippetViewer(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                {selectedSnippet.videoUrl ? (
                  <video
                    controls
                    className="w-full h-full rounded-lg"
                    poster={selectedSnippet.thumbnailUrl}
                  >
                    <source src={selectedSnippet.videoUrl} type="video/mp4" />
                    Tu navegador no soporta videos.
                  </video>
                ) : (
                  <div className="text-white text-center">
                    <Play className="h-16 w-16 mx-auto mb-2" />
                    <p>Video no disponible</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {selectedSnippet.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedSnippet.authorName}</h4>
                    <span className="text-sm text-gray-500">{formatTimeAgo(selectedSnippet.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{selectedSnippet.viewsCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className={`h-4 w-4 ${selectedSnippet.userLiked ? 'text-red-500 fill-current' : ''}`} />
                    <span>{selectedSnippet.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>{selectedSnippet.sharesCount}</span>
                  </div>
                </div>
              </div>
              
              {selectedSnippet.description && (
                <p className="text-gray-800 mb-4">{selectedSnippet.description}</p>
              )}
              
              {selectedSnippet.petName && (
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <span>🐾</span>
                  <span>{selectedSnippet.petName} ({selectedSnippet.petSpecies})</span>
                </div>
              )}
              
              {selectedSnippet.tags && selectedSnippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSnippet.tags.map((tag: string, index: number) => (
                    <span key={index} className="bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleLikeSnippet(selectedSnippet.id)}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
                    selectedSnippet.userLiked 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-4 w-4 inline mr-1 ${selectedSnippet.userLiked ? 'fill-current' : ''}`} />
                  {selectedSnippet.userLiked ? 'Te gusta' : 'Me gusta'}
                </button>
                <button
                  onClick={() => handleShareSnippet(selectedSnippet.id)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Share2 className="h-4 w-4 inline mr-1" />
                  Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
