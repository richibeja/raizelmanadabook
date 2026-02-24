'use client';
import React from 'react';
import { Users, Lock, Globe, Calendar, ArrowRight } from 'lucide-react';

interface Circle {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  max_members?: number;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface CircleCardProps {
  circle: Circle;
  onJoin?: (circle: Circle) => void;
  onView?: (circle: Circle) => void;
}

const CircleCard: React.FC<CircleCardProps> = ({ circle, onJoin, onView }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'perros': 'bg-blue-100 text-blue-800',
      'gatos': 'bg-purple-100 text-purple-800',
      'aves': 'bg-yellow-100 text-yellow-800',
      'peces': 'bg-cyan-100 text-cyan-800',
      'reptiles': 'bg-green-100 text-green-800',
      'roedores': 'bg-orange-100 text-orange-800',
      'exoticos': 'bg-pink-100 text-pink-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category.toLowerCase()] || colors.default;
  };

  const getMemberStatus = () => {
    if (circle.max_members) {
      const percentage = (circle.member_count / circle.max_members) * 100;
      if (percentage >= 90) return 'text-red-600';
      if (percentage >= 75) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header con información del círculo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {circle.name}
            </h3>
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(circle.category)}`}>
                {circle.category}
              </span>
              <div className="flex items-center text-gray-500">
                {circle.is_private ? (
                  <Lock size={16} className="mr-1" />
                ) : (
                  <Globe size={16} className="mr-1" />
                )}
                <span className="text-xs">
                  {circle.is_private ? 'Privado' : 'Público'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Icono de usuarios */}
          <div className="flex-shrink-0 ml-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        
        {/* Descripción */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {circle.description}
        </p>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getMemberStatus()}`}>
              {circle.member_count}
            </div>
            <div className="text-xs text-gray-500">
              {circle.max_members ? `de ${circle.max_members}` : 'miembros'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800">
              {formatDate(circle.created_at)}
            </div>
            <div className="text-xs text-gray-500">Creado</div>
          </div>
        </div>
      </div>

      {/* Footer con acciones */}
      <div className="p-6 bg-gray-50">
        <div className="flex space-x-3">
          {onView && (
            <button
              onClick={() => onView(circle)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <ArrowRight size={16} className="mr-2" />
              Ver círculo
            </button>
          )}
          
          {onJoin && !circle.is_private && (
            <button
              onClick={() => onJoin(circle)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Users size={16} className="mr-2" />
              Unirse
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircleCard;
