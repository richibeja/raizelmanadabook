'use client';

import React, { useState } from 'react';
import { useCircles } from '@/hooks/useCircles';
// // import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Plus, Search, MapPin, Users, Tag, Settings, Crown, Shield, User } from 'lucide-react';

interface CirclesManagerProps {
  onClose: () => void;
}

export default function CirclesManager({ onClose }: CirclesManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    circles, 
    myCircles, 
    loading, 
    createCircle, 
    joinCircle, 
    leaveCircle, 
    searchCircles 
  } = useCircles();
  
  const [activeTab, setActiveTab] = useState<'discover' | 'my-circles' | 'create'>('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    category: 'general' as 'breed' | 'location' | 'interest' | 'general' | 'adoption' | 'training' | 'health' | 'other',
    location: '',
    tags: [] as string[],
    isPublic: true,
    rules: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [newRule, setNewRule] = useState('');

  const categories = [
    { value: 'breed', label: '🐕 Por Raza', icon: '🐕' },
    { value: 'location', label: '📍 Por Ubicación', icon: '📍' },
    { value: 'interest', label: '❤️ Por Interés', icon: '❤️' },
    { value: 'adoption', label: '🏠 Adopciones', icon: '🏠' },
    { value: 'training', label: '🎓 Entrenamiento', icon: '🎓' },
    { value: 'health', label: '🏥 Salud', icon: '🏥' },
    { value: 'general', label: '🌟 General', icon: '🌟' },
    { value: 'other', label: '🔗 Otros', icon: '🔗' },
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim() && !selectedCategory && !selectedLocation) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCircles(searchTerm, selectedCategory, selectedLocation);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching circles:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.name.trim()) return;

    try {
      await createCircle({
        name: createFormData.name,
        description: createFormData.description,
        category: createFormData.category,
        location: createFormData.location,
        tags: createFormData.tags,
        isPublic: createFormData.isPublic,
        rules: createFormData.rules,
      });
      
      // Reset form
      setCreateFormData({
        name: '',
        description: '',
        category: 'general',
        location: '',
        tags: [],
        isPublic: true,
        rules: [],
      });
      setShowCreateForm(false);
      setActiveTab('my-circles');
    } catch (error) {
      console.error('Error creating circle:', error);
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

  const handleAddRule = () => {
    if (newRule.trim() && !createFormData.rules.includes(newRule.trim())) {
      setCreateFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const handleRemoveRule = (ruleToRemove: string) => {
    setCreateFormData(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule !== ruleToRemove)
    }));
  };

  const getRoleIcon = (circle: any) => {
    if (circle.admins?.includes(user?.uid)) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (circle.moderators?.includes(user?.uid)) return <Shield className="h-4 w-4 text-blue-500" />;
    return <User className="h-4 w-4 text-gray-500" />;
  };

  const CircleCard = ({ circle, showJoinButton = true }: { circle: any; showJoinButton?: boolean }) => {
    const isMember = circle.members?.includes(user?.uid) || false;
    const isAdmin = circle.admins?.includes(user?.uid) || false;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
              {categories.find(c => c.value === circle.category)?.icon || '🌟'}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{circle.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getRoleIcon(circle)}
                <span>{categories.find(c => c.value === circle.category)?.label}</span>
              </div>
            </div>
          </div>
          {isMember && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Miembro
            </span>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{circle.description}</p>

        {circle.tags && circle.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {circle.tags.slice(0, 3).map((tag: string, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
            {circle.tags.length > 3 && (
              <span className="text-gray-500 text-xs">+{circle.tags.length - 3} más</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{circle.memberCount}</span>
            </div>
            {circle.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{circle.location}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${circle.isPublic ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>{circle.isPublic ? 'Público' : 'Privado'}</span>
          </div>
        </div>

        {showJoinButton && (
          <div className="flex gap-2">
            {isMember ? (
              <button
                onClick={() => leaveCircle(circle.id)}
                className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Salir
              </button>
            ) : (
              <button
                onClick={() => joinCircle(circle.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Unirse
              </button>
            )}
            <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
              Ver
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Círculos de ManadaBook</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-blue-100 mt-2">
            Conecta con comunidades de mascotas por raza, ubicación o intereses
          </p>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Descubrir
            </button>
            <button
              onClick={() => setActiveTab('my-circles')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'my-circles'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mis Círculos ({myCircles.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Crear Círculo
            </button>
          </div>

          {/* Discover Tab */}
          {activeTab === 'discover' && (
            <div>
              {/* Search */}
              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar círculos..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSearching ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="text-2xl mb-2">🐾</div>
                    <div className="text-gray-600">Cargando círculos...</div>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((circle) => (
                    <CircleCard key={circle.id} circle={circle} />
                  ))
                ) : (
                  circles.map((circle) => (
                    <CircleCard key={circle.id} circle={circle} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* My Circles Tab */}
          {activeTab === 'my-circles' && (
            <div>
              {myCircles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No estás en ningún círculo</h3>
                  <p className="text-gray-500 mb-6">Explora y únete a círculos que te interesen</p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Explorar Círculos
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myCircles.map((circle) => (
                    <CircleCard key={circle.id} circle={circle} showJoinButton={false} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Tab */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateCircle} className="max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del círculo *
                  </label>
                  <input
                    type="text"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Golden Retrievers de Madrid"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe el propósito y actividades del círculo..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={createFormData.category}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ciudad, País"
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
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reglas del círculo
                  </label>
                  <div className="space-y-2 mb-2">
                    {createFormData.rules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <span className="text-sm">{rule}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(rule)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRule())}
                      placeholder="Agregar regla..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddRule}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createFormData.isPublic}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Círculo público</span>
                  </label>
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
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Crear Círculo
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
