'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Heart, Share2, MessageCircle, Eye, Target, Calendar, DollarSign } from 'lucide-react';

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
  creative_type: 'image' | 'video' | 'carousel' | 'story';
  owner_name: string;
  owner_avatar: string;
  destination_url: string;
  is_sponsored: boolean;
}

interface AdFeedCardProps {
  ad: Ad;
  onLike?: (adId: string) => void;
  onShare?: (adId: string) => void;
  onComment?: (adId: string) => void;
  onView?: (adId: string) => void;
}

const AdFeedCard: React.FC<AdFeedCardProps> = ({ 
  ad, 
  onLike, 
  onShare, 
  onComment, 
  onView 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(ad.id);
  };

  const handleShare = () => {
    onShare?.(ad.id);
  };

  const handleComment = () => {
    onComment?.(ad.id);
  };

  const handleView = () => {
    onView?.(ad.id);
    window.open(ad.destination_url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCreativeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'carousel':
        return '🖼️';
      case 'story':
        return '📱';
      default:
        return '🖼️';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={ad.owner_avatar}
                alt={ad.owner_name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{ad.owner_name}</h3>
                {ad.is_sponsored && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Patrocinado
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(ad.start_date)} - {formatDate(ad.end_date)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {getCreativeIcon(ad.creative_type)} {ad.creative_type}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Target className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{ad.title}</h2>
        <p className="text-gray-700 mb-4 line-clamp-3">{ad.description}</p>
        
        {/* Creative */}
        <div className="relative mb-4 rounded-lg overflow-hidden">
          <Image
            src={ad.image_url}
            alt={ad.title}
            width={600}
            height={400}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={handleView}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleView}
              className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Ver más</span>
            </button>
          </div>
        </div>

        {/* Targeting Info (Expandable) */}
        {isExpanded && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Información de Targeting
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Audiencia:</span>
                <p className="font-medium">{ad.target_audience}</p>
              </div>
              <div>
                <span className="text-gray-600">Presupuesto:</span>
                <p className="font-medium">${ad.budget.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Impresiones:</span>
                <p className="font-medium">{ad.impressions.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-600">CTR:</span>
                <p className="font-medium">{ad.ctr}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">Me gusta</span>
            </button>
            
            <button
              onClick={handleComment}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Comentar</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium">Compartir</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{ad.impressions.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>${ad.cpc.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdFeedCard;
