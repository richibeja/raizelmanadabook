"use client";

import React, { useState, useEffect } from 'react';
import { useModerationActions } from '../../hooks/useModeration';
import { Shield, Clock, User, FileText, MessageCircle, Video, ShoppingBag, Filter, Search } from 'lucide-react';

export default function ModerationActionsPage() {
  const { actions, loading, error } = useModerationActions();
  
  const [filters, setFilters] = useState({
    target_user_id: '',
    action_type: '',
    moderator_id: '',
    target_type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // fetchActions(filters);
    console.log('Loading moderation actions with filters:', filters);
  }, [filters]);

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'content_removal': return 'bg-red-100 text-red-800 border-red-200';
      case 'temporary_ban': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'permanent_ban': return 'bg-red-100 text-red-800 border-red-200';
      case 'unban': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case 'post': return <FileText className="w-4 h-4" />;
      case 'message': return <MessageCircle className="w-4 h-4" />;
      case 'snippet': return <Video className="w-4 h-4" />;
      case 'ad': return <ShoppingBag className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStats = () => {
    const warnings = actions.filter(a => a.action_type === 'warning').length;
    const contentRemovals = actions.filter(a => a.action_type === 'content_removal').length;
    const suspensions = actions.filter(a => a.action_type === 'suspension').length;
    const bans = actions.filter(a => a.action_type === 'ban').length;
    const total = actions.length;

    return { warnings, contentRemovals, suspensions, bans, total };
  };

  const stats = getStats();

  const filteredActions = actions.filter(action => {
    if (searchTerm) {
      return action.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
             action.action_type.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Historial de Moderación</h1>
          </div>
          <p className="text-gray-600">
            Registro de todas las acciones de moderación realizadas
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Advertencias</p>
                <p className="text-2xl font-bold text-gray-900">{stats.warnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Contenido Removido</p>
                <p className="text-2xl font-bold text-gray-900">{stats.contentRemovals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Suspensiones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.suspensions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <User className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Bans Permanentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Unbans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              
              <select
                value={filters.action_type}
                onChange={(e) => setFilters(prev => ({ ...prev, action_type: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las acciones</option>
                <option value="warning">Advertencia</option>
                <option value="content_removal">Remoción de contenido</option>
                <option value="temporary_ban">Suspensión temporal</option>
                <option value="permanent_ban">Ban permanente</option>
                <option value="unban">Unban</option>
              </select>

              <select
                value={filters.target_type}
                onChange={(e) => setFilters(prev => ({ ...prev, target_type: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="user">Usuario</option>
                <option value="post">Post</option>
                <option value="message">Mensaje</option>
                <option value="snippet">Snippet</option>
                <option value="ad">Anuncio</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en acciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-64"
              />
            </div>
          </div>
        </div>

        {/* Actions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando acciones...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : filteredActions.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay acciones</h3>
              <p className="text-gray-600">
                {searchTerm || Object.values(filters).some(f => f) 
                  ? 'No se encontraron acciones con los filtros aplicados'
                  : 'No hay acciones de moderación registradas'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Acciones ({filteredActions.length})
                </h2>
                <p className="text-sm text-gray-500">
                  Total: {total} acciones
                </p>
              </div>

              <div className="grid gap-6">
                {filteredActions.map((action) => (
                  <div key={action.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getTargetTypeIcon(action.target_type)}
                          <span className="text-sm font-medium text-gray-600">
                            {action.target_type.charAt(0).toUpperCase() + action.target_type.slice(1)}
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getActionTypeColor(action.action_type)}`}>
                          {action.action_type.replace('_', ' ').toUpperCase()}
                        </span>
                        {action.duration_hours && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 rounded-full">
                            {action.duration_hours}h
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(action.created_at)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          Acción: {action.action_type.replace('_', ' ')}
                        </h3>
                        <p className="text-sm text-gray-600">{action.reason}</p>
                      </div>

                      {/* Evidence */}
                      {action.evidence_urls && action.evidence_urls.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Evidencia:</h4>
                          <div className="flex flex-wrap gap-2">
                            {action.evidence_urls.map((url, index) => (
                              <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                              >
                                <span>Ver evidencia {index + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Target info */}
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Usuario objetivo:</span>
                            <p className="text-gray-600">{action.target_user_id}</p>
                          </div>
                          {action.target_id && (
                            <div>
                              <span className="font-medium text-gray-700">Contenido:</span>
                              <p className="text-gray-600">{action.target_id}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
