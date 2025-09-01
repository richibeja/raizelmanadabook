'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAds, AdsFilters } from '../hooks/useAds';
import AdCard from '../components/AdCard';
import { Plus, Search, Filter, BarChart3, DollarSign, Eye, Target, Calendar } from 'lucide-react';

export default function AdsPage() {
  const router = useRouter();
  const { 
    ads, 
    loading, 
    error
  } = useAds();

  const [filters, setFilters] = useState<AdsFilters>({ 
    status: 'all'
  });

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedCreativeType, setSelectedCreativeType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const newFilters: AdsFilters = {
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      target_audience: searchQuery || undefined
    };
    setFilters(newFilters);
  }, [selectedStatus, selectedPaymentStatus, selectedCreativeType, searchQuery]);

  const handleApprove = async (adId: string) => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      });
      const result = await response.json();
      if (result.success) {
        alert('Anuncio aprobado exitosamente');
        window.location.reload(); // Refresh to show updated data
      }
    } catch (err) {
      alert('Error al aprobar el anuncio');
    }
  };

  const handleReject = async (adId: string) => {
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
        alert('Anuncio rechazado exitosamente');
        window.location.reload();
      }
    } catch (err) {
      alert('Error al rechazar el anuncio');
    }
  };

  const handlePause = async (adId: string) => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pause' })
      });
      const result = await response.json();
      if (result.success) {
        alert('Anuncio pausado exitosamente');
        window.location.reload();
      }
    } catch (err) {
      alert('Error al pausar el anuncio');
    }
  };

  const handleResume = async (adId: string) => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resume' })
      });
      const result = await response.json();
      if (result.success) {
        alert('Anuncio reanudado exitosamente');
        window.location.reload();
      }
    } catch (err) {
      alert('Error al reanudar el anuncio');
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) return;

    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        alert('Anuncio eliminado exitosamente');
        window.location.reload();
      }
    } catch (err) {
      alert('Error al eliminar el anuncio');
    }
  };

  const filteredAds = ads.filter(ad => {
    if (selectedStatus !== 'all' && ad.status !== selectedStatus) return false;
    if (selectedPaymentStatus !== 'all' && (ad as any).payment_status !== selectedPaymentStatus) return false;
    if (selectedCreativeType !== 'all' && (ad as any).creative_type !== selectedCreativeType) return false;
    if (searchQuery && !ad.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalSpent = ads.reduce((sum, ad) => sum + ((ad as any).total_spent || 0), 0);
  const totalImpressions = ads.reduce((sum, ad) => sum + ((ad as any).total_impressions || 0), 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ((ad as any).total_clicks || 0), 0);
  const averageCTR = ads.length > 0 ? ads.reduce((sum, ad) => sum + (ad.ctr || 0), 0) / ads.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Gestión de Anuncios</h1>
            <button
              onClick={() => router.push('/ads/new')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Anuncio
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Gastado</p>
                <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Impresiones</p>
                <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Clics</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">CTR Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{(averageCTR * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar anuncios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Estados</option>
                <option value="active">Activo</option>
                <option value="paused">Pausado</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
              </select>

              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Pagos</option>
                <option value="paid">Pagado</option>
                <option value="pending">Pendiente</option>
                <option value="failed">Fallido</option>
              </select>

              <select
                value={selectedCreativeType}
                onChange={(e) => setSelectedCreativeType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los Tipos</option>
                <option value="image">Imagen</option>
                <option value="video">Video</option>
                <option value="carousel">Carrusel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando anuncios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No se encontraron anuncios</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onPause={() => handlePause(ad.id)}
                onDelete={() => handleDelete(ad.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}