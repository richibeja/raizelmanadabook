'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Camera, MapPin, Truck, DollarSign, Package, 
  Tag, Upload, X, Plus
} from 'lucide-react';
import { useUserMarketplace } from '../../hooks/useMarketplace';
import { useAuthContext } from '../../contexts/AuthContext';

const categories = [
  { value: 'food', label: 'Alimentación', emoji: '🍖' },
  { value: 'toys', label: 'Juguetes', emoji: '🎾' },
  { value: 'accessories', label: 'Accesorios', emoji: '🦴' },
  { value: 'health', label: 'Salud', emoji: '🏥' },
  { value: 'services', label: 'Servicios', emoji: '🎯' },
  { value: 'other', label: 'Otros', emoji: '📦' },
];

const conditions = [
  { value: 'new', label: 'Nuevo', description: 'Sin usar, en empaque original' },
  { value: 'like-new', label: 'Como nuevo', description: 'Usado muy poco, excelente estado' },
  { value: 'good', label: 'Buen estado', description: 'Usado pero en buenas condiciones' },
  { value: 'fair', label: 'Estado regular', description: 'Usado con signos de desgaste' },
];

const cities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 
  'Bucaramanga', 'Pereira', 'Manizales', 'Ibagué', 'Santa Marta'
];

export default function SellItemPage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { create } = useUserMarketplace();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'accessories',
    price: '',
    currency: 'COP',
    condition: 'good',
    photos: [] as string[],
    city: '',
    country: 'Colombia',
    shippingAvailable: false,
    shippingCost: '',
    shippingMethods: [] as string[],
    tags: [] as string[],
    specifications: {} as Record<string, string>
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + photoFiles.length > 8) {
      setError('Máximo 8 fotos permitidas');
      return;
    }

    // Validate file sizes and types
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setError('Cada foto debe ser menor a 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten imágenes');
        return;
      }
    }

    setPhotoFiles(prev => [...prev, ...files]);
    setError(null);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, e.target?.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Debes iniciar sesión para vender');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.price) {
      setError('Título, descripción y precio son requeridos');
      return;
    }

    if (formData.photos.length === 0) {
      setError('Agrega al menos una foto');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Upload photos to storage first
      const uploadedPhotos = formData.photos; // Placeholder URLs for now

      const itemData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category as any,
        price: parseFloat(formData.price),
        currency: formData.currency as 'COP' | 'USD',
        condition: formData.condition as any,
        photos: uploadedPhotos,
        location: {
          city: formData.city,
          country: formData.country
        },
        shipping: {
          available: formData.shippingAvailable,
          cost: formData.shippingCost ? parseFloat(formData.shippingCost) : undefined,
          methods: formData.shippingMethods
        },
        status: 'active' as const,
        tags: formData.tags,
        specifications: formData.specifications,
        relatedPets: [],
        isPromoted: false
      };

      const itemId = await create(itemData);
      
      if (itemId) {
        router.push(`/marketplace/${itemId}`);
      } else {
        setError('Error al crear artículo');
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear artículo');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso requerido
          </h1>
          <p className="text-gray-600 mb-6">
            Inicia sesión para vender en ManadaBook Marketplace
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
          <div className="flex items-center gap-4">
            <Link
              href="/marketplace"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Marketplace
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Vender Artículo</h1>
            <p className="text-gray-600 mt-2">
              Comparte productos para mascotas con la comunidad ManadaBook
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photos */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Fotos del Producto</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </div>
                  )}
                </div>
              ))}
              
              {formData.photos.length < 8 && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50">
                  <Camera className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Agregar foto</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              Agrega hasta 8 fotos. La primera será la foto principal.
            </p>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información del Producto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Artículo
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                  placeholder="Ej: Comedero automático para perros con temporizador"
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
                  placeholder="Describe tu producto, estado, características especiales..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
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
                  Estado del Producto
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({...prev, condition: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {conditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                    placeholder="50000"
                    min="1000"
                    step="1000"
                    className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({...prev, currency: e.target.value}))}
                      className="border-none bg-transparent text-sm text-gray-500 focus:outline-none"
                    >
                      <option value="COP">COP</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar ciudad</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Envío</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="shipping"
                  checked={formData.shippingAvailable}
                  onChange={(e) => setFormData(prev => ({...prev, shippingAvailable: e.target.checked}))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="shipping" className="ml-2 text-sm text-gray-700">
                  Ofrezco envío
                </label>
              </div>

              {formData.shippingAvailable && (
                <div className="ml-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo de envío
                    </label>
                    <input
                      type="number"
                      value={formData.shippingCost}
                      onChange={(e) => setFormData(prev => ({...prev, shippingCost: e.target.value}))}
                      placeholder="8000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tags</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Agregar tag (Ej: raízel, usado, urgente)"
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

              {formData.tags.length > 0 && (
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
              )}
            </div>
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
              href="/marketplace"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.description.trim() || !formData.price || formData.photos.length === 0}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Publicando...' : 'Publicar Artículo'}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">💡 Consejos para vender</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Toma fotos claras y bien iluminadas</li>
            <li>• Describe honestamente el estado del producto</li>
            <li>• Incluye medidas y especificaciones importantes</li>
            <li>• Responde rápido a las consultas de compradores</li>
            <li>• Considera ofrecer envío para llegar a más compradores</li>
          </ul>
        </div>
      </div>
    </div>
  );
}