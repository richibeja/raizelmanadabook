'use client';
import React from 'react';
import { AlertTriangle, User, MessageSquare, Image, Video, Calendar, Clock } from 'lucide-react';

interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  reported_pet_id?: string;
  reported_post_id?: string;
  report_type: 'spam' | 'inappropriate' | 'harassment' | 'fake_profile' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  moderator_notes?: string;
  created_at: string;
  updated_at: string;
}

interface ReportCardProps {
  report: Report;
  onInvestigate?: (report: Report) => void;
  onResolve?: (report: Report) => void;
  onDismiss?: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  onInvestigate, 
  onResolve, 
  onDismiss 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'spam':
        return <MessageSquare size={16} className="text-orange-600" />;
      case 'inappropriate':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'harassment':
        return <User size={16} className="text-red-600" />;
      case 'fake_profile':
        return <User size={16} className="text-yellow-600" />;
      default:
        return <AlertTriangle size={16} className="text-gray-600" />;
    }
  };

  const getReportTypeText = (type: string) => {
    switch (type) {
      case 'spam':
        return 'Spam';
      case 'inappropriate':
        return 'Contenido inapropiado';
      case 'harassment':
        return 'Acoso';
      case 'fake_profile':
        return 'Perfil falso';
      default:
        return 'Otro';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'investigating':
        return 'En investigación';
      case 'resolved':
        return 'Resuelto';
      case 'dismissed':
        return 'Descartado';
      default:
        return 'Desconocido';
    }
  };

  const getReportedContentType = () => {
    if (report.reported_user_id) return 'Usuario';
    if (report.reported_pet_id) return 'Mascota';
    if (report.reported_post_id) return 'Publicación';
    return 'Desconocido';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getReportTypeIcon(report.report_type)}
              <h3 className="text-lg font-semibold text-gray-800">
                {getReportTypeText(report.report_type)}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {getStatusText(report.status)}
              </span>
              <span className="text-xs text-gray-500">
                {getReportedContentType()}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {formatDate(report.created_at)}
            </div>
          </div>
        </div>

        {/* Descripción del reporte */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Descripción del reporte:</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            {report.description}
          </p>
        </div>

        {/* Notas del moderador */}
        {report.moderator_notes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Notas del moderador:</h4>
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              {report.moderator_notes}
            </p>
          </div>
        )}

        {/* Información adicional */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">ID del reporte:</span>
            <span className="ml-2 font-mono text-xs">{report.id}</span>
          </div>
          <div>
            <span className="text-gray-500">Última actualización:</span>
            <span className="ml-2">{formatDate(report.updated_at)}</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="p-6 bg-gray-50">
        <div className="flex space-x-3">
          {report.status === 'pending' && onInvestigate && (
            <button
              onClick={() => onInvestigate(report)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Investigar
            </button>
          )}
          
          {report.status === 'investigating' && onResolve && (
            <button
              onClick={() => onResolve(report)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Resolver
            </button>
          )}
          
          {(report.status === 'pending' || report.status === 'investigating') && onDismiss && (
            <button
              onClick={() => onDismiss(report)}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Descartar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

