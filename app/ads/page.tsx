'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Plus, Search, Eye, Edit, Trash2, Play, Pause, BarChart3, DollarSign, TrendingUp } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAudience: string;
  budget: number;
  spent: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  type: 'banner' | 'video' | 'carousel' | 'story';
  placement: 'feed' | 'stories' | 'shorts' | 'search';
  createdAt: string;
  updatedAt: string;
}

export default function AdsDashboard() {
  const { user } = useAuthContext();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock data
  useEffect(() => {
    const mockAds: Ad[] = [
      {
        id: '1',
        title: 'Promoción de Alimentos BARF',
        description: 'Descubre los beneficios de la alimentación natural para tu mascota',
        imageUrl: '/images/barf-promo.jpg',
        targetAudience: 'Dueños de perros y gatos',
        budget: 1000,
        spent: 450,
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        impressions: 50000,
        clicks: 1200,
        conversions: 45,
        ctr: 2.4,
        cpc: 0.38,
        cpm: 9.0,
        roas: 3.2,
        type: 'banner',
        placement: 'feed',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'ManadaShorts - Videos Divertidos',
        description: 'Mira los videos más divertidos de mascotas en ManadaShorts',
        imageUrl: '/images/shorts-promo.jpg',
        targetAudience: 'Jóvenes 18-35 años',
        budget: 2000,
        spent: 1200,
        status: 'active',
        startDate: '2024-01-10',
        endDate: '2024-02-10',
        impressions: 80000,
        clicks: 3200,
        conversions: 120,
        ctr: 4.0,
        cpc: 0.38,
        cpm: 15.0,
        roas: 4.5,
        type: 'video',
        placement: 'shorts',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-20T14:20:00Z'
      }
    ];
    
    setAds(mockAds);
    setLoading(false);
  }, []);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    const matchesType = typeFilter === 'all' || ad.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalStats = {
    totalAds: ads.length,
    activeAds: ads.filter(ad => ad.status === 'active').length,
    totalSpent: ads.reduce((sum, ad) => sum + ad.spent, 0),
    totalBudget: ads.reduce((sum, ad) => sum + ad.budget, 0),
    totalImpressions: ads.reduce((sum, ad) => sum + ad.impressions, 0),
    totalClicks: ads.reduce((sum, ad) => sum + ad.clicks, 0),
    totalConversions: ads.reduce((sum, ad) => sum + ad.conversions, 0),
    avgCtr: ads.length > 0 ? ads.reduce((sum, ad) => sum + ad.ctr, 0) / ads.length : 0,
    avgCpc: ads.length > 0 ? ads.reduce((sum, ad) => sum + ad.cpc, 0) / ads.length : 0,
    avgRoas: ads.length > 0 ? ads.reduce((sum, ad) => sum + ad.roas, 0) / ads.length : 0
  };

  const handleStatusChange = async (adId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setAds(ads.map(ad => 
          ad.id === adId ? { ...ad, status: newStatus as any } : ad
        ));
      }
    } catch (error) {
      console.error('Error updating ad status:', error);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      try {
        const response = await fetch(`/api/ads/${adId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setAds(ads.filter(ad => ad.id !== adId));
        }
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard de publicidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Publicidad</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestiona tus campañas publicitarias en ManadaBook y ManadaShorts
              </p>
            </div>
            <button
              onClick={() => console.log('Create ad')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Crear Anuncio
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Anuncios</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.totalAds}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Presupuesto Gastado</p>
                <p className="text-2xl font-semibold text-gray-900">${totalStats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Impresiones</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.totalImpressions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conversiones</p>
                <p className="text-2xl font-semibold text-gray-900">{totalStats.totalConversions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar anuncios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="paused">Pausado</option>
              <option value="completed">Completado</option>
              <option value="draft">Borrador</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="banner">Banner</option>
              <option value="video">Video</option>
              <option value="carousel">Carrusel</option>
              <option value="story">Historia</option>
            </select>
          </div>
        </div>

        {/* Ads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anuncio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presupuesto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={ad.imageUrl}
                            alt={ad.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                          <div className="text-sm text-gray-500">{ad.description}</div>
                          <div className="text-xs text-gray-400">
                            {ad.type} • {ad.placement}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ad.status === 'active' ? 'bg-green-100 text-green-800' :
                        ad.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        ad.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ad.status === 'active' ? 'Activo' :
                         ad.status === 'paused' ? 'Pausado' :
                         ad.status === 'completed' ? 'Completado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>${ad.spent.toLocaleString()} / ${ad.budget.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {((ad.spent / ad.budget) * 100).toFixed(1)}% gastado
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>CTR: {ad.ctr}%</div>
                        <div>CPC: ${ad.cpc}</div>
                        <div>ROAS: {ad.roas}x</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(ad.id, ad.status === 'active' ? 'paused' : 'active')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {ad.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => console.log('Edit ad', ad.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAds.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay anuncios</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No se encontraron anuncios con los filtros aplicados.'
                : 'Comienza creando tu primer anuncio.'}
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => console.log('Create ad')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Crear Anuncio
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
