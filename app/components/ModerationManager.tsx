'use client';

import React, { useState } from 'react';
import { useModeration } from '@/hooks/useModeration';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Flag, Shield, AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';

interface ModerationManagerProps {
  onClose: () => void;
}

export default function ModerationManager({ onClose }: ModerationManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    reports, 
    myReports, 
    pendingReports, 
    loading, 
    createReport, 
    updateReportStatus,
    getReportReasons,
    getPriorityColor,
    getStatusColor,
    formatTimeAgo,
    getReportsByStatus,
    getReportsByPriority,
    getReportsByReason
  } = useModeration();
  
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'my-reports' | 'create'>('all');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    contentId: '',
    contentType: 'post' as 'post' | 'comment' | 'moment' | 'snippet' | 'product' | 'user' | 'circle',
    reason: 'other' as 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'violence' | 'hate_speech' | 'copyright' | 'other',
    description: '',
  });
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [moderatorNotes, setModeratorNotes] = useState('');

  const contentTypes = [
    { value: 'post', label: 'Post', icon: '📝' },
    { value: 'comment', label: 'Comentario', icon: '💬' },
    { value: 'moment', label: 'Moment', icon: '⏰' },
    { value: 'snippet', label: 'Snippet', icon: '🎬' },
    { value: 'product', label: 'Producto', icon: '🛍️' },
    { value: 'user', label: 'Usuario', icon: '👤' },
    { value: 'circle', label: 'Círculo', icon: '🌟' },
  ];

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.contentId.trim()) return;
    if (!createFormData.description.trim()) return;

    try {
      await createReport({
        contentId: createFormData.contentId,
        contentType: createFormData.contentType,
        reason: createFormData.reason,
        description: createFormData.description,
      });
      
      // Reset form
      setCreateFormData({
        contentId: '',
        contentType: 'post',
        reason: 'other',
        description: '',
      });
      setShowCreateForm(false);
      setActiveTab('my-reports');
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Error al crear el reporte');
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: string) => {
    try {
      await updateReportStatus(reportId, status as any, moderatorNotes);
      setModeratorNotes('');
      setShowReportDetails(false);
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Error al actualizar el reporte');
    }
  };

  const getCurrentReports = () => {
    let filtered = reports;

    switch (activeTab) {
      case 'pending':
        filtered = pendingReports;
        break;
      case 'my-reports':
        filtered = myReports;
        break;
      default:
        filtered = reports;
    }

    if (selectedStatus) {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    if (selectedPriority) {
      filtered = filtered.filter(report => report.priority === selectedPriority);
    }

    if (selectedReason) {
      filtered = filtered.filter(report => report.reason === selectedReason);
    }

    return filtered;
  };

  const ReportCard = ({ report }: { report: any }) => {
    const reasons = getReportReasons();
    const reason = reasons.find(r => r.value === report.reason);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{report.reporterName}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatTimeAgo(report.createdAt)}</span>
                <span className="capitalize">{contentTypes.find(c => c.value === report.contentType)?.label}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
              {report.priority}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Razón:</span>
            <span className="text-sm text-gray-700">{reason?.label}</span>
          </div>
          <p className="text-gray-800 text-sm">{report.description}</p>
        </div>

        {report.reportedUserName && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>Reportado:</span>
            <span className="font-medium">{report.reportedUserName}</span>
          </div>
        )}

        {report.moderatorNotes && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Notas del moderador:</span>
            </div>
            <p className="text-sm text-gray-600">{report.moderatorNotes}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>ID: {report.contentId}</span>
            {report.moderatorName && (
              <span>Moderado por: {report.moderatorName}</span>
            )}
          </div>
          
          <button
            onClick={() => {
              setSelectedReport(report);
              setShowReportDetails(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Moderación</h2>
              {pendingReports.length > 0 && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingReports.length} pendientes
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
          <p className="text-red-100 mt-2">
            Gestiona reportes y mantén la calidad de la comunidad
          </p>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="reviewing">Revisando</option>
                <option value="resolved">Resuelto</option>
                <option value="dismissed">Descartado</option>
              </select>
              
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="">Todas las prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
              
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="">Todas las razones</option>
                {getReportReasons().map(reason => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todos ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pendientes ({pendingReports.length})
            </button>
            <button
              onClick={() => setActiveTab('my-reports')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'my-reports'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mis Reportes ({myReports.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Crear Reporte
            </button>
          </div>

          {/* Content */}
          {activeTab === 'create' ? (
            <form onSubmit={handleCreateReport} className="max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID del contenido *
                  </label>
                  <input
                    type="text"
                    value={createFormData.contentId}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, contentId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="ID del post, comentario, usuario, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de contenido
                    </label>
                    <select
                      value={createFormData.contentType}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, contentType: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {contentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón del reporte
                    </label>
                    <select
                      value={createFormData.reason}
                      onChange={(e) => setCreateFormData(prev => ({ ...prev, reason: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {getReportReasons().map(reason => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del problema *
                  </label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Describe el problema o comportamiento inapropiado..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Importante</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Los reportes falsos pueden resultar en la suspensión de tu cuenta. 
                    Solo reporta contenido que realmente viole las reglas de la comunidad.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Enviar Reporte
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-gray-600">Cargando reportes...</div>
                </div>
              ) : getCurrentReports().length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {activeTab === 'my-reports' ? 'No has creado ningún reporte' : 'No hay reportes disponibles'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {activeTab === 'my-reports' ? 'Los reportes que crees aparecerán aquí' : 'Los reportes aparecerán aquí cuando se creen'}
                  </p>
                  {activeTab === 'my-reports' && (
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Crear Reporte
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {getCurrentReports().map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {showReportDetails && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Detalles del Reporte</h3>
                <button
                  onClick={() => setShowReportDetails(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Información del Reporte</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reportero:</span>
                      <span className="font-medium">{selectedReport.reporterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{contentTypes.find(c => c.value === selectedReport.contentType)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Razón:</span>
                      <span className="font-medium">{getReportReasons().find(r => r.value === selectedReport.reason)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prioridad:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedReport.priority)}`}>
                        {selectedReport.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Descripción</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedReport.description}</p>
                </div>

                {selectedReport.moderatorNotes && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Notas del Moderador</h4>
                    <p className="text-gray-700 bg-blue-50 rounded-lg p-4">{selectedReport.moderatorNotes}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Notas del Moderador</h4>
                  <textarea
                    value={moderatorNotes}
                    onChange={(e) => setModeratorNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Agregar notas sobre la resolución del reporte..."
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleUpdateReportStatus(selectedReport.id, 'resolved')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Resolver
                  </button>
                  <button
                    onClick={() => handleUpdateReportStatus(selectedReport.id, 'dismissed')}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    <XCircle className="h-4 w-4 inline mr-1" />
                    Descartar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
