'use client';
import React from 'react';
import { Eye, Heart, Share2, Calendar, MapPin, DollarSign } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  target_audience: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'completed' | 'pending' | 'rejected';
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
}

interface AdCardProps {
  ad: Ad;
  onEdit?: (ad: Ad) => void;
  onPause?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, onEdit, onPause, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'paused':
        return 'Pausado';
      case 'completed':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Imagen del anuncio */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50">
        <img
          src={ad.image_url || '/placeholder-ad.jpg'}
          alt={ad.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
            {getStatusText(ad.status)}
          </span>
        </div>
      </div>

      {/* Contenido del anuncio */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{ad.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ad.description}</p>

        {/* Métricas del anuncio */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{ad.impressions.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Impresiones</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{ad.clicks.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Clics</div>
          </div>
        </div>

        {/* Estadísticas adicionales */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">CTR:</span>
            <span className="font-medium">{(ad.ctr * 100).toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">CPC:</span>
            <span className="font-medium">${ad.cpc.toFixed(2)}</span>
          </div>
        </div>

        {/* Información del anuncio */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Eye size={16} className="mr-2" />
            <span>Audiencia: {ad.target_audience}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign size={16} className="mr-2" />
            <span>Presupuesto: ${ad.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar size={16} className="mr-2" />
            <span>{formatDate(ad.start_date)} - {formatDate(ad.end_date)}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(ad)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Editar
            </button>
          )}
          {onPause && ad.status === 'active' && (
            <button
              onClick={() => onPause(ad.id)}
              className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              Pausar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(ad.id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdCard;
