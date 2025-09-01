'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Check, X, Pause, Play, Eye, MousePointer, DollarSign, BarChart3, Target, Calendar, Clock, User } from 'lucide-react';

export default function AdDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Mock admin status

  const adId = params.id as string;

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ads/${adId}`);
        const result = await response.json();
        if (result.success) {
          setAd(result.data.ad);
        } else {
          setError(result.error || 'Error al cargar el anuncio');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (adId) {
      fetchAd();
    }
  }, [adId]);

  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      });
      const result = await response.json();
      if (result.success) {
        setAd(result.data.ad);
        alert('Anuncio aprobado exitosamente');
      }
    } catch (err) {
      alert('Error al aprobar el anuncio');
    }
  };

  const handleReject = async () => {
    const rejectionReason = prompt('Motivo del rechazo:');
    if (!rejectionReason) return;

    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejection_reason: rejectionReason })
      });
      const result = await response.json();
      if (result.success) {
        setAd(result.data.ad);
        alert('Anuncio rechazado exitosamente');
      }
    } catch (err) {
      alert('Error al rechazar el anuncio');
    }
  };

  const handlePause = async () => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause' })
      });
      const result = await response.json();
      if (result.success) {
        setAd(result.data.ad);
        alert('Anuncio pausado exitosamente');
      }
    } catch (err) {
      alert('Error al pausar el anuncio');
    }
  };

  const handleResume = async () => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resume' })
      });
      const result = await response.json();
      if (result.success) {
        setAd(result.data.ad);
        alert('Anuncio reanudado exitosamente');
      }
    } catch (err) {
      alert('Error al reanudar el anuncio');
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) return;

    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        alert('Anuncio eliminado exitosamente');
        router.push('/ads');
      }
    } catch (err) {
      alert('Error al eliminar el anuncio');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando anuncio...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Anuncio no encontrado'}</p>
          <button
            onClick={() => router.push('/ads')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Anuncios
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Detalles del Anuncio
              </h1>
            </div>
            
            {isAdmin && (
              <div className="flex items-center space-x-2">
                {ad.status === 'pending' && (
                  <>
                    <button
                      onClick={handleApprove}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aprobar
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Rechazar
                    </button>
                  </>
                )}
                
                {ad.status === 'active' && (
                  <button
                    onClick={handlePause}
                    className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </button>
                )}
                
                {ad.status === 'paused' && (
                  <button
                    onClick={handleResume}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Reanudar
                  </button>
                )}
                
                <button
                  onClick={handleDelete}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ad Creative */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenido del Anuncio</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{ad.title}</h3>
                  <p className="text-gray-600 mt-2">{ad.description}</p>
                </div>
                
                {ad.creative_urls && ad.creative_urls.length > 0 && (
                  <div className="space-y-2">
                    {ad.creative_urls.map((url: string, index: number) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Creative ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Rendimiento</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{ad.total_impressions || 0}</div>
                  <div className="text-sm text-blue-600">Impresiones</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MousePointer className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{ad.total_clicks || 0}</div>
                  <div className="text-sm text-green-600">Clics</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">{(ad.ctr * 100).toFixed(2)}%</div>
                  <div className="text-sm text-purple-600">CTR</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-900">${ad.total_spent || 0}</div>
                  <div className="text-sm text-orange-600">Gastado</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ad Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Anuncio</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Audiencia</div>
                    <div className="font-medium text-gray-900">
                      {ad.target_audience?.pet_species?.join(', ') || 'General'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Presupuesto</div>
                    <div className="font-medium text-gray-900">
                      ${ad.budget_amount} {ad.budget_currency}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Período</div>
                    <div className="font-medium text-gray-900">
                      {new Date(ad.start_date).toLocaleDateString()} - {new Date(ad.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Estado</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      ad.status === 'active' ? 'bg-green-100 text-green-800' :
                      ad.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      ad.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ad.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Anunciante</h2>
              
              <div className="flex items-center">
                <img
                  src={ad.owner_avatar}
                  alt={ad.owner_username}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-medium text-gray-900">{ad.owner_username}</div>
                  <div className="text-sm text-gray-500">ID: {ad.owner_id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}