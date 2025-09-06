'use client';

import React, { useState, useEffect } from 'react';
import { useAnalyticsDashboard, useAnalyticsEvents } from '../hooks/useAnalytics';
import AnalyticsCard from '../components/AnalyticsCard';
import {
  Users,
  FileText,
  Heart,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsPage() {
  const { 
    dashboardData, 
    loading, 
    error
  } = useAnalyticsDashboard();

  const { events } = useAnalyticsEvents();

  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [showEvents, setShowEvents] = useState(false);

  useEffect(() => {
    // Track page view would normally be called here
  }, []);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // Track user action would normally be called here
  };

  const handleMetricFilter = (metric: string) => {
    setSelectedMetric(metric);
    // Track user action would normally be called here
  };

  const handleExport = () => {
    // Track user action would normally be called here
    console.log('Exporting analytics data...');
  };

  const handleRefresh = () => {
    // Track user action would normally be called here
    window.location.reload();
  };

  const dashboardMetrics = [
    {
      id: 'total_users',
      title: 'Total Usuarios',
      value: dashboardData?.totalUsers || 0,
      change: 12,
      changeType: 'increase' as const,
      icon: Users,
      color: 'blue'
    },
    {
      id: 'total_posts',
      title: 'Total Publicaciones',
      value: dashboardData?.totalPosts || 0,
      change: 8,
      changeType: 'increase' as const,
      icon: FileText,
      color: 'green'
    },
    {
      id: 'total_interactions',
      title: 'Total Interacciones',
      value: dashboardData?.totalLikes || 0,
      change: 15,
      changeType: 'increase' as const,
      icon: Heart,
      color: 'purple'
    },
    {
      id: 'daily_active_users',
      title: 'Usuarios Activos Diarios',
      value: dashboardData?.totalComments || 0,
      change: 5,
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
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
            <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="1y">Último año</option>
              </select>
              
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardMetrics.map((metric) => (
            <AnalyticsCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={<metric.icon className="w-6 h-6" />}
            />
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Crecimiento Semanal</h2>
            <div className="text-3xl font-bold text-green-600">
              +{dashboardData?.weeklyGrowth || 0}%
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Comparado con la semana anterior
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Eventos Recientes</h2>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.eventType}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {event.userId && (
                    <span className="text-xs text-gray-400">Usuario: {event.userId}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events Toggle */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Eventos de Analytics</h2>
            <button
              onClick={() => setShowEvents(!showEvents)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {showEvents ? 'Ocultar' : 'Ver todos'}
            </button>
          </div>
          
          {showEvents && (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.eventType}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {event.userId && (
                        <p className="text-sm text-gray-600">Usuario: {event.userId}</p>
                      )}
                      {event.eventData.metadata?.petId && (
                        <p className="text-sm text-gray-600">Mascota: {event.eventData.metadata.petId}</p>
                      )}
                    </div>
                  </div>
                  {Object.keys(event.eventData.metadata || {}).length > 0 && (
                    <div className="mt-2">
                      <pre className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        {JSON.stringify(event.eventData.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}