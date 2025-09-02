"use client";

import React, { useState, useEffect } from 'react';
import { useReports, useModerationActions } from '../hooks/useModeration';
import ReportCard from '../components/ReportCard';
import { Shield, AlertTriangle, Clock, CheckCircle, XCircle, Filter, Search } from 'lucide-react';

export default function ModerationPage() {
  const { reports, loading, error } = useReports();
  const { actions } = useModerationActions();
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    report_type: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Mock current user ID (en producción vendría del contexto de autenticación)
  const currentUserId = '550e8400-e29b-41d4-a716-446655440005';

  useEffect(() => {
    // fetchReports(filters);
    // fetchActions();
    console.log('Loading moderation data...');
  }, [filters]);

  const handleAssign = async (reportId: string, moderatorId: string) => {
    try {
      // await executeReportAction(reportId, 'assign', { moderator_id: moderatorId });
      // fetchReports(filters); // Refresh the list
      console.log('Assign report:', reportId, moderatorId);
    } catch (error) {
      console.error('Error assigning report:', error);
    }
  };

  const handleResolve = async (reportId: string, action: string, notes?: string) => {
    try {
      await executeReportAction(reportId, 'resolve', { 
        action_taken: action, 
        resolution_notes: notes 
      });
      fetchReports(filters); // Refresh the list
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const handleDismiss = async (reportId: string, notes?: string) => {
    try {
      await executeReportAction(reportId, 'dismiss', { resolution_notes: notes });
      fetchReports(filters); // Refresh the list
    } catch (error) {
      console.error('Error dismissing report:', error);
    }
  };

  const handleReopen = async (reportId: string) => {
    try {
      await executeReportAction(reportId, 'reopen');
      fetchReports(filters); // Refresh the list
    } catch (error) {
      console.error('Error reopening report:', error);
    }
  };

  const getStats = () => {
    const pending = reports.filter(r => r.status === 'pending').length;
    const reviewing = reports.filter(r => r.status === 'reviewing').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const dismissed = reports.filter(r => r.status === 'dismissed').length;
    const urgent = reports.filter(r => r.priority === 'urgent').length;

    return { pending, reviewing, resolved, dismissed, urgent };
  };

  const stats = getStats();

  const filteredReports = reports.filter(report => {
    if (searchTerm) {
      return report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
             report.report_type.toLowerCase().includes(searchTerm.toLowerCase());
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
            <h1 className="text-3xl font-bold text-gray-900">Panel de Moderación</h1>
          </div>
          <p className="text-gray-600">
            Gestiona reportes y mantén la comunidad segura
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">En Revisión</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reviewing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Resueltos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Descartados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.dismissed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Urgentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
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
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="reviewing">En Revisión</option>
                <option value="resolved">Resueltos</option>
                <option value="dismissed">Descartados</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="normal">Normal</option>
                <option value="low">Baja</option>
              </select>

              <select
                value={filters.report_type}
                onChange={(e) => setFilters(prev => ({ ...prev, report_type: e.target.value }))}
                className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                <option value="spam">Spam</option>
                <option value="inappropriate">Inapropiado</option>
                <option value="harassment">Acoso</option>
                <option value="violence">Violencia</option>
                <option value="fake_news">Fake News</option>
                <option value="copyright">Copyright</option>
                <option value="privacy">Privacidad</option>
                <option value="scam">Estafa</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-64"
              />
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando reportes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes</h3>
              <p className="text-gray-600">
                {searchTerm || Object.values(filters).some(f => f) 
                  ? 'No se encontraron reportes con los filtros aplicados'
                  : 'No hay reportes pendientes de revisión'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reportes ({filteredReports.length})
                </h2>
                <p className="text-sm text-gray-500">
                  Total: {total} reportes
                </p>
              </div>

              <div className="grid gap-6">
                {filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onAssign={handleAssign}
                    onResolve={handleResolve}
                    onDismiss={handleDismiss}
                    onReopen={handleReopen}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
