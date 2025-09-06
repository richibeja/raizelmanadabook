'use client';

import React, { useState, useEffect } from 'react';
import { useAnalyticsEvents } from '../../hooks/useAnalytics';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Globe
} from 'lucide-react';

export default function AnalyticsEventsPage() {
  const { events, loading, error } = useAnalyticsEvents();

  const [filters, setFilters] = useState({
    event_type: '',
    event_category: '',
    user_id: '',
    date_from: '',
    date_to: ''
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Filter events based on current filters
    // This would normally trigger a new API call
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredEvents = events.filter(event => {
    if (filters.event_type && event.eventType !== filters.event_type) return false;
    if (filters.user_id && event.userId !== filters.user_id) return false;
    if (searchQuery && !event.eventType.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const eventTypes = [...new Set(events.map(e => e.eventType))];
  const totalEvents = events.length;
  const uniqueUsers = new Set(events.map(e => e.userId).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Eventos de Analytics</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Eventos</p>
                <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Usuarios Únicos</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Tipos de Evento</p>
                <p className="text-2xl font-bold text-gray-900">{eventTypes.length}</p>
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
                  placeholder="Buscar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filters.event_type}
                onChange={(e) => handleFilterChange('event_type', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los Tipos</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={filters.user_id}
                onChange={(e) => handleFilterChange('user_id', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los Usuarios</option>
                {/* This would normally be populated with actual user IDs */}
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando eventos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No se encontraron eventos</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Eventos ({filteredEvents.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <div key={event.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {event.eventType}
                        </span>
                        {event.userId && (
                          <span className="ml-2 text-sm text-gray-500">
                            Usuario: {event.userId}
                          </span>
                        )}
                        {event.eventData.metadata?.petId && (
                          <span className="ml-2 text-sm text-gray-500">
                            Mascota: {event.eventData.metadata.petId}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {JSON.stringify(event.eventData.metadata, null, 2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}