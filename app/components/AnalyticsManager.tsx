'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
// // import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Calendar, Target } from 'lucide-react';

interface AnalyticsManagerProps {
  onClose: () => void;
}

export default function AnalyticsManager({ onClose }: AnalyticsManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    userAnalytics, 
    contentAnalytics, 
    platformAnalytics, 
    recentEvents, 
    loading, 
    getEventTypeLabel,
    getEventIcon,
    formatTimeAgo,
    formatNumber,
    getEngagementRate
  } = useAnalytics();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'platform' | 'events'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const getPeriodLabel = (period: string) => {
    const labels: { [key: string]: string } = {
      '7d': 'Últimos 7 días',
      '30d': 'Últimos 30 días',
      '90d': 'Últimos 90 días',
      '1y': 'Último año',
    };
    return labels[period] || period;
  };

  const StatCard = ({ title, value, icon, color, subtitle }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string; 
    subtitle?: string;
  }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const EventCard = ({ event }: { event: any }) => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{getEventIcon(event.eventType)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{getEventTypeLabel(event.eventType)}</h3>
              <span className="text-xs text-gray-500">{formatTimeAgo(event.timestamp)}</span>
            </div>
            
            {event.eventData && Object.keys(event.eventData).length > 0 && (
              <div className="text-sm text-gray-600">
                {event.eventData.searchTerm && (
                  <p>Búsqueda: &quot;{event.eventData.searchTerm}&quot;</p>
                )}
                {event.eventData.category && (
                  <p>Categoría: {event.eventData.category}</p>
                )}
                {event.eventData.value && (
                  <p>Valor: {formatNumber(event.eventData.value)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ContentCard = ({ content }: { content: any }) => {
    const engagementRate = getEngagementRate(content.likes, content.comments, content.shares, content.views);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-sm line-clamp-2">{content.title}</h3>
          <span className="text-xs text-gray-500">{formatTimeAgo(content.createdAt)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <Eye className="h-4 w-4" />
              <span className="font-semibold">{formatNumber(content.views)}</span>
            </div>
            <p className="text-xs text-gray-500">Vistas</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-600">
              <Heart className="h-4 w-4" />
              <span className="font-semibold">{formatNumber(content.likes)}</span>
            </div>
            <p className="text-xs text-gray-500">Likes</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600">
              <MessageCircle className="h-4 w-4" />
              <span className="font-semibold">{formatNumber(content.comments)}</span>
            </div>
            <p className="text-xs text-gray-500">Comentarios</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-purple-600">
              <Share2 className="h-4 w-4" />
              <span className="font-semibold">{formatNumber(content.shares)}</span>
            </div>
            <p className="text-xs text-gray-500">Compartidos</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Engagement</span>
            <span className="font-semibold text-green-600">{engagementRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${Math.min(parseFloat(engagementRate.toString()), 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Analytics</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-indigo-100 mt-2">
            Estadísticas y métricas de tu actividad
          </p>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Period Selector */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Período:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
                <option value="1y">Último año</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contenido
            </button>
            <button
              onClick={() => setActiveTab('platform')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'platform'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Plataforma
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Actividad
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-gray-600">Cargando analytics...</div>
              </div>
            ) : activeTab === 'overview' && userAnalytics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Posts"
                    value={formatNumber(userAnalytics.totalPosts)}
                    icon={<BarChart3 className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                    subtitle="Total de publicaciones"
                  />
                  <StatCard
                    title="Seguidores"
                    value={formatNumber(userAnalytics.totalFollowers)}
                    icon={<Users className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                    subtitle="Usuarios que te siguen"
                  />
                  <StatCard
                    title="Engagement"
                    value={`${userAnalytics.engagementRate.toFixed(1)}%`}
                    icon={<TrendingUp className="h-6 w-6 text-white" />}
                    color="bg-purple-500"
                    subtitle="Tasa de interacción"
                  />
                  <StatCard
                    title="Alcance"
                    value={formatNumber(userAnalytics.reach)}
                    icon={<Target className="h-6 w-6 text-white" />}
                    color="bg-orange-500"
                    subtitle="Personas alcanzadas"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Likes"
                    value={formatNumber(userAnalytics.totalLikes)}
                    icon={<Heart className="h-6 w-6 text-white" />}
                    color="bg-red-500"
                    subtitle="Total de likes recibidos"
                  />
                  <StatCard
                    title="Comentarios"
                    value={formatNumber(userAnalytics.totalComments)}
                    icon={<MessageCircle className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                    subtitle="Total de comentarios"
                  />
                  <StatCard
                    title="Compartidos"
                    value={formatNumber(userAnalytics.totalShares)}
                    icon={<Share2 className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                    subtitle="Total de compartidos"
                  />
                  <StatCard
                    title="Vistas de perfil"
                    value={formatNumber(userAnalytics.profileViews)}
                    icon={<Eye className="h-6 w-6 text-white" />}
                    color="bg-indigo-500"
                    subtitle="Visitas a tu perfil"
                  />
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Actividad</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Contenido Creado</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Posts:</span>
                          <span className="font-medium">{userAnalytics.totalPosts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Moments:</span>
                          <span className="font-medium">{userAnalytics.totalMoments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Snippets:</span>
                          <span className="font-medium">{userAnalytics.totalSnippets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Productos:</span>
                          <span className="font-medium">{userAnalytics.totalProducts}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Comunidad</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Siguiendo:</span>
                          <span className="font-medium">{userAnalytics.totalFollowing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Círculos:</span>
                          <span className="font-medium">{userAnalytics.totalCircles}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Última actividad:</span>
                          <span className="font-medium">{formatTimeAgo(userAnalytics.lastActive)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'content' ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Análisis de Contenido</h3>
                {contentAnalytics.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay contenido para analizar</h3>
                    <p className="text-gray-500">Crea contenido para ver estadísticas detalladas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contentAnalytics.map((content) => (
                      <ContentCard key={content.contentId} content={content} />
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'platform' && platformAnalytics ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Estadísticas de la Plataforma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Usuarios Totales"
                    value={formatNumber(platformAnalytics.totalUsers)}
                    icon={<Users className="h-6 w-6 text-white" />}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="Posts Totales"
                    value={formatNumber(platformAnalytics.totalPosts)}
                    icon={<BarChart3 className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                  />
                  <StatCard
                    title="Productos"
                    value={formatNumber(platformAnalytics.totalProducts)}
                    icon={<Target className="h-6 w-6 text-white" />}
                    color="bg-purple-500"
                  />
                  <StatCard
                    title="Ingresos"
                    value={`$${formatNumber(platformAnalytics.revenue)}`}
                    icon={<TrendingUp className="h-6 w-6 text-white" />}
                    color="bg-orange-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    title="Moments"
                    value={formatNumber(platformAnalytics.totalMoments)}
                    icon={<Calendar className="h-6 w-6 text-white" />}
                    color="bg-pink-500"
                  />
                  <StatCard
                    title="Snippets"
                    value={formatNumber(platformAnalytics.totalSnippets)}
                    icon={<Eye className="h-6 w-6 text-white" />}
                    color="bg-indigo-500"
                  />
                  <StatCard
                    title="Círculos"
                    value={formatNumber(platformAnalytics.totalCircles)}
                    icon={<Target className="h-6 w-6 text-white" />}
                    color="bg-yellow-500"
                  />
                  <StatCard
                    title="Engagement"
                    value={`${platformAnalytics.engagementRate.toFixed(1)}%`}
                    icon={<TrendingUp className="h-6 w-6 text-white" />}
                    color="bg-red-500"
                  />
                </div>
              </div>
            ) : activeTab === 'events' ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Actividad Reciente</h3>
                {recentEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay actividad reciente</h3>
                    <p className="text-gray-500">Tu actividad aparecerá aquí</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay datos disponibles</h3>
                <p className="text-gray-500">Los analytics aparecerán aquí cuando estén disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
