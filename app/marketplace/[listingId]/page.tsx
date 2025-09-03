'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Heart, Eye, MapPin, Truck, Shield, Star, 
  ShoppingCart, MessageCircle, Share2, Camera, Clock, User
} from 'lucide-react';
import { useMarketplaceFavorites } from '../../hooks/useMarketplace';
import { useAuthContext } from '../../contexts/AuthContext';

export default function MarketplaceItemPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const itemId = params.listingId as string;
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  
  const { addFavorite, removeFavorite, isFavorite } = useMarketplaceFavorites();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/marketplace/${itemId}`);
        const result = await response.json();
        
        if (result.success) {
          setItem(result.data);
        } else {
          setError('Artículo no encontrado');
        }
      } catch (err) {
        setError('Error al cargar artículo');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handlePurchase = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setPurchasing(true);
    
    try {
      const response = await fetch(`/api/marketplace/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'purchase-initiate',
          userId: user.uid 
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.data.checkoutUrl;
      } else {
        setError('Error al iniciar compra');
      }
    } catch (error) {
      setError('Error al procesar compra');
    } finally {
      setPurchasing(false);
    }
  };

  const handleInquiry = async () => {
    if (!user || !inquiryMessage.trim()) return;
    
    try {
      const response = await fetch(`/api/marketplace/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'inquiry',
          userId: user.uid,
          message: inquiryMessage.trim()
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setShowInquiry(false);
        setInquiryMessage('');
        alert('Consulta enviada al vendedor exitosamente');
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/marketplace"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const photos = Array.isArray(item.photos) ? item.photos : [item.photos].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href="/marketplace"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Photos */}
          <div>
            {/* Main Photo */}
            <div className="relative bg-white rounded-lg overflow-hidden mb-4">
              <img
                src={photos[selectedPhoto] || '/api/placeholder/600/400'}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
              
              {/* Favorite Button */}
              {user && (
                <button
                  onClick={() => isFavorite(itemId) ? removeFavorite(itemId) : addFavorite(itemId)}
                  className="absolute top-4 right-4 p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${isFavorite(itemId) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                  />
                </button>
              )}
            </div>

            {/* Photo Thumbnails */}
            {photos.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {photos.map((photo: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedPhoto === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-lg p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {item.title}
              </h1>
              
              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <p className="text-3xl font-bold text-green-600">
                  {formatPrice(item.price, item.currency)}
                </p>
                {item.shipping?.available && item.shipping?.cost && (
                  <p className="text-sm text-gray-500">
                    + {formatPrice(item.shipping.cost)} envío
                  </p>
                )}
              </div>

              {/* Condition & Category */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {item.condition === 'new' ? 'Nuevo' : 
                   item.condition === 'like-new' ? 'Como nuevo' : 
                   item.condition === 'good' ? 'Buen estado' : 'Estado regular'}
                </span>
                <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                  {item.category}
                </span>
                {item.isPromoted && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                    ⭐ Promocionado
                  </span>
                )}
              </div>
            </div>

            {/* Purchase Actions */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handlePurchase}
                disabled={purchasing || item.status !== 'active'}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center"
              >
                {purchasing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Comprar Ahora
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowInquiry(true)}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar Consulta
              </button>
            </div>

            {/* Seller Info */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Vendedor</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src="/api/placeholder/40/40"
                    alt="Vendedor"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Usuario {item.sellerId?.slice(0, 8) || 'Anónimo'}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      <span>Nuevo vendedor</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/profile/${item.sellerId}`}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Ver perfil
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Location & Shipping */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Ubicación y Envío</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {item.location?.city || 'Colombia'}, {item.location?.country || 'Colombia'}
                </div>
                
                {item.shipping?.available ? (
                  <div className="flex items-center text-green-600">
                    <Truck className="w-4 h-4 mr-2" />
                    Envío disponible
                    {item.shipping.cost && ` - ${formatPrice(item.shipping.cost)}`}
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    Solo entrega en persona
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center text-gray-500 mb-1">
                    <Eye className="w-4 h-4 mr-1" />
                  </div>
                  <p className="text-lg font-semibold">{item.stats?.viewsCount || 0}</p>
                  <p className="text-xs text-gray-500">Vistas</p>
                </div>
                <div>
                  <div className="flex items-center justify-center text-gray-500 mb-1">
                    <Heart className="w-4 h-4 mr-1" />
                  </div>
                  <p className="text-lg font-semibold">{item.stats?.favoritesCount || 0}</p>
                  <p className="text-xs text-gray-500">Favoritos</p>
                </div>
                <div>
                  <div className="flex items-center justify-center text-gray-500 mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                  </div>
                  <p className="text-lg font-semibold">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-ES') : 'Reciente'}
                  </p>
                  <p className="text-xs text-gray-500">Publicado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <div className="mt-12 bg-white rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Artículos Relacionados
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <img
                  src="/api/placeholder/200/150"
                  alt="Artículo relacionado"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium text-gray-900 mb-1">Artículo Ejemplo</h4>
                <p className="text-green-600 font-semibold">$50.000</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Consejos de Seguridad</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Revisa la reputación del vendedor antes de comprar</li>
                <li>• Prefiere métodos de pago seguros como Stripe</li>
                <li>• Inspecciona el producto antes de confirmar la recepción</li>
                <li>• Reporta cualquier actividad sospechosa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Enviar Consulta</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje para el vendedor
              </label>
              <textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Hola, me interesa tu artículo. ¿Podrías darme más información?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInquiry(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleInquiry}
                disabled={!inquiryMessage.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Actions (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button
            onClick={() => setShowInquiry(true)}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Consultar
          </button>
          <button
            onClick={handlePurchase}
            disabled={purchasing || item.status !== 'active'}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {purchasing ? 'Procesando...' : formatPrice(item.price)}
          </button>
        </div>
      </div>
    </div>
  );
}