'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Globe, Lock, Users, Tag, MapPin } from 'lucide-react';
import { useCircles } from '../../hooks/useCircles';
import { useAuthContext } from '../../contexts/AuthContext';

const categories = [
  { value: 'perros', label: 'Perros', emoji: '🐕' },
  { value: 'gatos', label: 'Gatos', emoji: '🐱' },
  { value: 'barf', label: 'BARF', emoji: '🥩' },
  { value: 'adopcion', label: 'Adopción', emoji: '🏠' },
  { value: 'salud', label: 'Salud', emoji: '🏥' },
  { value: 'entrenamiento', label: 'Entrenamiento', emoji: '🎾' },
  { value: 'eventos', label: 'Eventos', emoji: '📅' },
  { value: 'raizel', label: 'Raízel', emoji: '🍖' },
  { value: 'local', label: 'Local', emoji: '📍' },
  { value: 'general', label: 'General', emoji: '💬' },
];

const cities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 
  'Bucaramanga', 'Pereira', 'Manizales', 'Ibagué', 'Santa Marta'
];

export default function CreateCirclePage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { createNew } = useCircles();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    city: '',
    country: 'Colombia',
    isPrivate: false,
    requiresApproval: false,
    photoURL: '',
    coverURL: '',
    rules: '',
    tags: [] as string[]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Debes iniciar sesión para crear un círculo');
      return;
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Nombre y descripción son requeridos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const circleData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        photoURL: formData.photoURL,
        coverURL: formData.coverURL,
        isPrivate: formData.isPrivate,
        requiresApproval: formData.requiresApproval,
        location: formData.city ? {
          city: formData.city,
          country: formData.country
        } : undefined,
        tags: [formData.category, ...formData.tags].filter(Boolean),
        rules: formData.rules ? formData.rules.split('\n').filter(Boolean) : [],
        settings: {
          allowPosts: true,
          allowEvents: true,
          allowMarketplace: true
        },
        createdBy: user.uid
      };

      const circleId = await createNew(circleData);
      
      if (circleId) {
        router.push(`/circles/${circleId}`);
      } else {
        setError('Error al crear el círculo');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear el círculo');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso requerido
          </h1>
          <p className="text-gray-600 mb-6">
            Inicia sesión para crear un círculo en ManadaBook
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/circles"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver a Círculos
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Círculo</h1>
            <p className="text-gray-600 mt-2">
              Crea una comunidad para conectar con otros amantes de las mascotas
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Círculo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="Ej: Amantes de Golden Retrievers Bogotá"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Describe tu círculo, qué tipo de contenido compartirán, objetivos..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría Principal
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.emoji} {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar ciudad (opcional)</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración de Privacidad</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="public"
                    name="privacy"
                    checked={!formData.isPrivate}
                    onChange={() => setFormData(prev => ({...prev, isPrivate: false, requiresApproval: false}))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="public" className="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                    <Globe className="w-4 h-4 mr-2 text-green-600" />
                    Círculo Público
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Cualquier persona puede encontrar y unirse al círculo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="private"
                    name="privacy"
                    checked={formData.isPrivate}
                    onChange={() => setFormData(prev => ({...prev, isPrivate: true, requiresApproval: true}))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="private" className="flex items-center text-sm font-medium text-gray-900 cursor-pointer">
                    <Lock className="w-4 h-4 mr-2 text-orange-600" />
                    Círculo Privado
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Solo miembros invitados pueden unirse
                  </p>
                </div>
              </div>

              {formData.isPrivate && (
                <div className="ml-8 pl-4 border-l-2 border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="approval"
                      checked={formData.requiresApproval}
                      onChange={(e) => setFormData(prev => ({...prev, requiresApproval: e.target.checked}))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="approval" className="ml-2 text-sm text-gray-700">
                      Requiere aprobación del administrador
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tags y Descubrimiento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags adicionales
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Agregar tag (Ej: golden, cachorros, local)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Los tags ayudan a otros usuarios a encontrar tu círculo
                </p>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags seleccionados
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rules (Optional) */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Reglas del Círculo (Opcional)</h2>
            
            <textarea
              value={formData.rules}
              onChange={(e) => setFormData(prev => ({...prev, rules: e.target.value}))}
              placeholder="Ej:&#10;1. Mantener respeto entre miembros&#10;2. Solo contenido relacionado con mascotas&#10;3. No promoción comercial sin autorización"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              Escribe cada regla en una línea separada
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/circles"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.name.trim() || !formData.description.trim()}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Creando...' : 'Crear Círculo'}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              {formData.coverURL && (
                <img 
                  src={formData.coverURL} 
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2">
                {formData.isPrivate ? (
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                    🔒 Privado
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    🌐 Público
                  </span>
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={formData.photoURL || '/api/placeholder/40/40'}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {formData.name || 'Nombre del círculo'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {categories.find(c => c.value === formData.category)?.label || 'General'}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {formData.description || 'Descripción del círculo aparecerá aquí...'}
              </p>

              {formData.city && (
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  {formData.city}, {formData.country}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>1 miembro</span>
                <span>{formData.isPrivate ? '🔒 Privado' : '🌐 Público'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}