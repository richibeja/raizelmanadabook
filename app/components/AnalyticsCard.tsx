'use client';
import React from 'react';
import { TrendingUp, Users, MessageSquare, Heart, Eye, Calendar } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  format?: 'number' | 'percentage' | 'currency';
  description?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  format = 'number',
  description
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val}%`;
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'number':
      default:
        if (val >= 1000000) {
          return `${(val / 1000000).toFixed(1)}M`;
        } else if (val >= 1000) {
          return `${(val / 1000).toFixed(1)}K`;
        }
        return val.toLocaleString();
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'decrease':
        return <TrendingUp size={16} className="text-red-600 rotate-180" />;
      default:
        return null;
    }
  };

  const getDefaultIcon = () => {
    if (icon) return icon;
    
    // Iconos por defecto basados en el título
    const titleLower = title.toLowerCase();
    if (titleLower.includes('usuario')) return <Users size={24} className="text-blue-600" />;
    if (titleLower.includes('mensaje') || titleLower.includes('post')) return <MessageSquare size={24} className="text-green-600" />;
    if (titleLower.includes('like') || titleLower.includes('interacción')) return <Heart size={24} className="text-red-600" />;
    if (titleLower.includes('vista') || titleLower.includes('visualización')) return <Eye size={24} className="text-purple-600" />;
    if (titleLower.includes('crecimiento') || titleLower.includes('crecimiento')) return <TrendingUp size={24} className="text-orange-600" />;
    
    return <Calendar size={24} className="text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {getDefaultIcon()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="text-sm font-medium">
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>

      {/* Valor principal */}
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-800">
          {formatValue(value)}
        </div>
      </div>

      {/* Información adicional */}
      {change !== undefined && (
        <div className="text-xs text-gray-500">
          {changeType === 'increase' && 'Aumento respecto al período anterior'}
          {changeType === 'decrease' && 'Disminución respecto al período anterior'}
          {changeType === 'neutral' && 'Sin cambios respecto al período anterior'}
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;

