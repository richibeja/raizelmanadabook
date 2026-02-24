'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Plus, ShoppingCart, Heart, Eye, MapPin, Tag, Search, Filter } from 'lucide-react';

interface MarketplaceManagerProps {
  onClose: () => void;
}

export default function MarketplaceManager({ onClose }: MarketplaceManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    products, 
    myProducts, 
    cart, 
    loading, 
    createProduct, 
    addToCart, 
    removeFromCart, 
    getCartTotal, 
    getCartItemCount 
  } = useMarketplace();
  
  const [activeTab, setActiveTab] = useState<'discover' | 'my-products' | 'create' | 'cart'>('discover');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    price: 0,
    currency: 'USD' as 'USD' | 'EUR' | 'MXN',
    category: 'other' as 'food' | 'toys' | 'accessories' | 'health' | 'grooming' | 'clothing' | 'home' | 'other',
    subcategory: '',
    images: [] as string[],
    condition: 'good' as 'new' | 'like_new' | 'good' | 'fair' | 'poor',
    brand: '',
    size: '',
    color: '',
    weight: 0,
    tags: [] as string[],
    location: '',
    shippingAvailable: false,
    shippingCost: 0,
    pickupAvailable: true,
  });
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = [
    { value: 'food', label: '🍖 Comida', icon: '🍖' },
    { value: 'toys', label: '🧸 Juguetes', icon: '🧸' },
    { value: 'accessories', label: '🎀 Accesorios', icon: '🎀' },
    { value: 'health', label: '🏥 Salud', icon: '🏥' },
    { value: 'grooming', label: '✂️ Cuidado', icon: '✂️' },
    { value: 'clothing', label: '👕 Ropa', icon: '👕' },
    { value: 'home', label: '🏠 Hogar', icon: '🏠' },
    { value: 'other', label: '🔗 Otros', icon: '🔗' },
  ];

  const conditions = [
    { value: 'new', label: 'Nuevo' },
    { value: 'like_new', label: 'Como nuevo' },
    { value: 'good', label: 'Bueno' },
    { value: 'fair', label: 'Regular' },
    { value: 'poor', label: 'Malo' },
  ];

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.title.trim()) return;
    if (createFormData.price <= 0) return;

    try {
      await createProduct({
        title: createFormData.title,
        description: createFormData.description,
        price: createFormData.price,
        currency: createFormData.currency,
        category: createFormData.category,
        subcategory: createFormData.subcategory,
        images: createFormData.images,
        condition: createFormData.condition,
        brand: createFormData.brand,
        size: createFormData.size,
        color: createFormData.color,
        weight: createFormData.weight,
        tags: createFormData.tags,
        location: createFormData.location,
        shippingAvailable: createFormData.shippingAvailable,
        shippingCost: createFormData.shippingCost,
        pickupAvailable: createFormData.pickupAvailable,
      });
      
      // Reset form
      setCreateFormData({
        title: '',
        description: '',
        price: 0,
        currency: 'USD',
        category: 'other',
        subcategory: '',
        images: [],
        condition: 'good',
        brand: '',
        size: '',
        color: '',
        weight: 0,
        tags: [],
        location: '',
        shippingAvailable: false,
        shippingCost: 0,
        pickupAvailable: true,
      });
      setShowCreateForm(false);
      setActiveTab('my-products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(price);
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

  const getFilteredProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    return filtered;
  };

  const ProductCard = ({ product, showAddToCart = true }: { product: any; showAddToCart?: boolean }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="aspect-square bg-gray-100 relative">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
              <span className="text-white text-4xl">
                {categories.find(c => c.value === product.category)?.icon || '🛍️'}
              </span>
            </div>
          )}
          
          {/* Condition Badge */}
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded">
            {conditions.find(c => c.value === product.condition)?.label}
          </div>
          
          {/* Price */}
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
            {formatPrice(product.price, product.currency)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {product.sellerName.charAt(0)}
              </div>
              <span className="text-sm text-gray-600">{product.sellerName}</span>
            </div>
            <span className="text-xs text-gray-500">{formatTimeAgo(product.createdAt)}</span>
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          {product.brand && (
            <div className="text-sm text-blue-600 mb-2">
              <span className="font-medium">Marca:</span> {product.brand}
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-gray-500 text-xs">+{product.tags.length - 3} más</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{product.viewsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className={`h-4 w-4 ${product.userLiked ? 'text-red-500 fill-current' : ''}`} />
                <span>{product.likesCount}</span>
              </div>
            </div>
            
            {product.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
            )}
          </div>

          {showAddToCart && (
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    );
  };

  const CartItem = ({ item }: { item: any }) => {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          {item.product.images && item.product.images.length > 0 ? (
            <img
              src={item.product.images[0]}
              alt={item.product.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-2xl">
              {categories.find(c => c.value === item.product.category)?.icon || '🛍️'}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-1">{item.product.title}</h4>
          <p className="text-gray-600 text-sm">
            {formatPrice(item.product.price, item.product.currency)} x {item.quantity}
          </p>
        </div>
        
        <div className="text-right">
          <p className="font-semibold text-sm">
            {formatPrice(item.product.price * item.quantity, item.product.currency)}
          </p>
          <button
            onClick={() => handleRemoveFromCart(item.productId)}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Eliminar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Marketplace</h2>
              {getCartItemCount() > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {getCartItemCount()}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-green-100 mt-2">
            Compra y vende productos para mascotas
          </p>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-4">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Precio mínimo"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Precio máximo"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'discover'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Descubrir
            </button>
            <button
              onClick={() => setActiveTab('my-products')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'my-products'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mis Productos ({myProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vender Producto
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'cart'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Carrito ({getCartItemCount()})
            </button>
          </div>

          {/* Content */}
          {activeTab === 'create' ? (
            <form onSubmit={handleCreateProduct} className="max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título del producto *
                  </label>
                  <input
                    type="text"
                    value={createFormData.title}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ej: Juguete para perros resistente"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe tu producto..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio *
                    </label>
                    <input
                      type="number"
                      value={createFormData.price}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moneda
                    </label>
                    <select
                      value={createFormData.currency}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, currency: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="MXN">MXN ($)</option>
                    </select>
                  </div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      Condición
                    </label>
                    <select
                      value={createFormData.condition}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, condition: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {conditions.map(cond => (
                        <option key={cond.value} value={cond.value}>
                          {cond.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    value={createFormData.location}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, location: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ciudad, País"
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
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-green-600 hover:text-green-800"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Publicar Producto
                  </button>
                </div>
              </div>
            </form>
          ) : activeTab === 'cart' ? (
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-500 mb-6">Agrega algunos productos para comenzar</p>
                  <button
                    onClick={() => setActiveTab('discover')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Explorar Productos
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                  
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatPrice(getCartTotal(), 'USD')}</span>
                    </div>
                    <button className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Proceder al Pago
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">🛍️</div>
                  <div className="text-gray-600">Cargando productos...</div>
                </div>
              ) : getFilteredProducts().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {activeTab === 'my-products' ? 'No has publicado ningún producto' : 'No hay productos disponibles'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === 'my-products' ? 'Comienza a vender productos para mascotas' : 'Intenta ajustar los filtros de búsqueda'}
                  </p>
                  {activeTab === 'my-products' && (
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Publicar Producto
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredProducts().map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      showAddToCart={activeTab === 'discover'}
                    />
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
