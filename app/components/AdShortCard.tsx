'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Heart, Share2, MessageCircle, Eye, Target, SkipForward } from 'lucide-react';

interface AdShort {
  id: string;
  title: string;
  description: string;
  video_url: string;
  image_url: string;
  target_audience: string;
  budget: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  creative_type: 'video' | 'image';
  owner_name: string;
  owner_avatar: string;
  destination_url: string;
  duration: number; // en segundos
  is_skippable: boolean;
  skip_after: number; // segundos después de los cuales se puede saltar
}

interface AdShortCardProps {
  ad: AdShort;
  onLike?: (adId: string) => void;
  onShare?: (adId: string) => void;
  onComment?: (adId: string) => void;
  onView?: (adId: string) => void;
  onSkip?: (adId: string) => void;
}

const AdShortCard: React.FC<AdShortCardProps> = ({ 
  ad, 
  onLike, 
  onShare, 
  onComment, 
  onView, 
  onSkip 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSkipButton, setShowSkipButton] = useState(false);

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

  const handleSkip = () => {
    onSkip?.(ad.id);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // Simular progreso del video
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        if (newTime >= ad.duration) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        if (ad.is_skippable && newTime >= ad.skip_after) {
          setShowSkipButton(true);
        }
        return newTime;
      });
    }, 1000);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const progress = (currentTime / ad.duration) * 100;

  return (
    <div className="h-screen w-full relative bg-black overflow-hidden">
      {/* Video/Image Content */}
      <div className="relative w-full h-full">
        {ad.creative_type === 'video' ? (
          <video
            className="w-full h-full object-cover"
            poster={ad.image_url}
            onPlay={handlePlay}
            onPause={handlePause}
            loop
            muted
          >
            <source src={ad.video_url} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={ad.image_url}
            alt={ad.title}
            fill
            className="object-cover"
          />
        )}

        {/* Overlay con información del anuncio */}
        <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
          {/* Header del anuncio */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src={ad.owner_avatar}
                  alt={ad.owner_name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-white">{ad.owner_name}</h3>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Anuncio
                  </span>
                </div>
                <p className="text-sm text-gray-300">Patrocinado</p>
              </div>
            </div>
            
            {showSkipButton && (
              <button
                onClick={handleSkip}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors flex items-center space-x-2"
              >
                <SkipForward className="h-4 w-4" />
                <span>Saltar</span>
              </button>
            )}
          </div>

          {/* Contenido del anuncio */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-2">{ad.title}</h2>
            <p className="text-gray-200 text-sm line-clamp-2">{ad.description}</p>
          </div>

          {/* Call to Action */}
          <button
            onClick={handleView}
            className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center space-x-2 mb-4"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Ver más</span>
          </button>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-red-500 text-sm">#anuncio</span>
            <span className="text-red-500 text-sm">#{ad.target_audience.toLowerCase()}</span>
            <span className="text-red-500 text-sm">#patrocinado</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-600">
          <div 
            className="h-full bg-red-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Botones de acción laterales */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex flex-col items-center ${
              isLiked ? 'text-red-500' : 'text-white'
            }`}
          >
            <Heart 
              className={`h-8 w-8 mb-1 ${isLiked ? 'fill-current' : ''}`}
            />
            <span className="text-xs">Me gusta</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={handleComment}
            className="flex flex-col items-center text-white"
          >
            <MessageCircle className="h-8 w-8 mb-1" />
            <span className="text-xs">Comentar</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center text-white"
          >
            <Share2 className="h-8 w-8 mb-1" />
            <span className="text-xs">Compartir</span>
          </button>
        </div>

        {/* Información de métricas (solo visible en hover) */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="text-white text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{ad.impressions.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>{ad.ctr}% CTR</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">${ad.cpc.toFixed(2)} CPC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdShortCard;
