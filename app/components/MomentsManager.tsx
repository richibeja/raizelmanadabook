'use client';

import React, { useState, useEffect } from 'react';
import { useMoments } from '@/hooks/useMoments';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Plus, Clock, Eye, Heart, Smile, Camera, Video, MapPin, Tag } from 'lucide-react';

interface MomentsManagerProps {
  onClose: () => void;
}

export default function MomentsManager({ onClose }: MomentsManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    moments, 
    myMoments, 
    loading, 
    createMoment, 
    viewMoment, 
    reactToMoment, 
    deleteMoment 
  } = useMoments();
  
  const [activeTab, setActiveTab] = useState<'discover' | 'my-moments' | 'create'>('discover');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    content: '',
    mediaType: 'text' as 'image' | 'video' | 'text',
    petId: '',
    petName: '',
    petSpecies: '',
    location: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [selectedMoment, setSelectedMoment] = useState<any>(null);
  const [showMomentViewer, setShowMomentViewer] = useState(false);

  const reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Me gusta' },
    { type: 'love', emoji: '❤️', label: 'Me encanta' },
    { type: 'laugh', emoji: '😂', label: 'Me divierte' },
    { type: 'wow', emoji: '😮', label: 'Me asombra' },
    { type: 'sad', emoji: '😢', label: 'Me entristece' },
    { type: 'angry', emoji: '😠', label: 'Me enoja' },
  ];

  const handleCreateMoment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.content.trim()) return;

    try {
      await createMoment({
        content: createFormData.content,
        mediaUrls: [], // TODO: Implementar subida de archivos
        mediaType: createFormData.mediaType,
        petId: createFormData.petId,
        petName: createFormData.petName,
        petSpecies: createFormData.petSpecies,
        location: createFormData.location,
        tags: createFormData.tags,
      });
      
      // Reset form
      setCreateFormData({
        content: '',
        mediaType: 'text',
        petId: '',
        petName: '',
        petSpecies: '',
        location: '',
        tags: [],
      });
      setShowCreateForm(false);
      setActiveTab('my-moments');
    } catch (error) {
      console.error('Error creating moment:', error);
      alert('Error al crear el moment');
    }
  };

  const handleViewMoment = async (moment: any) => {
    setSelectedMoment(moment);
    setShowMomentViewer(true);
    
    try {
      await viewMoment(moment.id);
    } catch (error) {
      console.error('Error viewing moment:', error);
    }
  };

  const handleReactToMoment = async (momentId: string, reactionType: any) => {
    try {
      await reactToMoment(momentId, reactionType);
    } catch (error) {
      console.error('Error reacting to moment:', error);
    }
  };

  const handleDeleteMoment = async (momentId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este moment?')) {
      try {
        await deleteMoment(momentId);
      } catch (error) {
        console.error('Error deleting moment:', error);
        alert('Error al eliminar el moment');
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
    return date.toLocaleDateString('es-ES');
  };

  const getTimeUntilExpiry = (expiresAt: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours <= 0) return 'Expirado';
    if (diffInHours < 1) return 'Expira pronto';
    if (diffInHours < 24) return `Expira en ${diffInHours}h`;
    return 'Activo';
  };

  const MomentCard = ({ moment, showDeleteButton = false }: { moment: any; showDeleteButton?: boolean }) => {
    const timeUntilExpiry = getTimeUntilExpiry(moment.expiresAt);
    const isExpired = timeUntilExpiry === 'Expirado';

    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${
        isExpired ? 'opacity-50' : ''
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {moment.authorName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{moment.authorName}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(moment.createdAt)}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  isExpired ? 'bg-red-100 text-red-800' :
                  timeUntilExpiry === 'Expira pronto' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {timeUntilExpiry}
                </span>
              </div>
            </div>
          </div>
          
          {showDeleteButton && (
            <button
              onClick={() => handleDeleteMoment(moment.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {moment.content && (
          <p className="text-gray-800 text-sm mb-3 whitespace-pre-wrap">{moment.content}</p>
        )}

        {moment.petName && (
          <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
            <span>🐾</span>
            <span>{moment.petName} ({moment.petSpecies})</span>
          </div>
        )}

        {moment.tags && moment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {moment.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{moment.viewsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{moment.reactionsCount}</span>
            </div>
            {moment.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{moment.location}</span>
              </div>
            )}
          </div>
          
          {!isExpired && (
            <button
              onClick={() => handleViewMoment(moment)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Ver Moment
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Moments</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            Estados efímeros que desaparecen en 24 horas
          </p>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Descubrir
            </button>
            <button
              onClick={() => setActiveTab('my-moments')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'my-moments'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mis Moments ({myMoments.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Crear Moment
            </button>
          </div>

          {/* Discover Tab */}
          {activeTab === 'discover' && (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">⏰</div>
                  <div className="text-gray-600">Cargando moments...</div>
                </div>
              ) : moments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay moments disponibles</h3>
                  <p className="text-gray-500 mb-6">Crea tu primer moment o espera a que otros usuarios compartan</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Crear Moment
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {moments.map((moment) => (
                    <MomentCard key={moment.id} moment={moment} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Moments Tab */}
          {activeTab === 'my-moments' && (
            <div className="flex-1 overflow-y-auto">
              {myMoments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No has creado ningún moment</h3>
                  <p className="text-gray-500 mb-6">Comparte momentos especiales con tu mascota</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Crear Primer Moment
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myMoments.map((moment) => (
                    <MomentCard key={moment.id} moment={moment} showDeleteButton={true} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Tab */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateMoment} className="max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué está pasando? *
                  </label>
                  <textarea
                    value={createFormData.content}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Comparte un momento especial con tu mascota..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de contenido
                    </label>
                    <select
                      value={createFormData.mediaType}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, mediaType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="text">📝 Solo texto</option>
                      <option value="image">📷 Imagen</option>
                      <option value="video">🎥 Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={createFormData.location}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="¿Dónde estás?"
                    />
                  </div>
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
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-purple-600 hover:text-purple-800"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">Recordatorio</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Los moments desaparecen automáticamente después de 24 horas
                  </p>
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
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Crear Moment
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Moment Viewer Modal */}
      {showMomentViewer && selectedMoment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Moment de {selectedMoment.authorName}</h3>
                <button
                  onClick={() => setShowMomentViewer(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-800 mb-4 whitespace-pre-wrap">{selectedMoment.content}</p>
              
              {selectedMoment.petName && (
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <span>🐾</span>
                  <span>{selectedMoment.petName} ({selectedMoment.petSpecies})</span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{selectedMoment.viewsCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{selectedMoment.reactionsCount}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(selectedMoment.createdAt)}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {reactionTypes.map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => handleReactToMoment(selectedMoment.id, reaction.type)}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    {reaction.emoji} {reaction.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
