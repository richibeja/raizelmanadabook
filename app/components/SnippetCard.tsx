'use client';
import React from 'react';
import Image from 'next/image';
import { Play, Heart, MessageCircle, Share2, Eye, Clock } from 'lucide-react';

interface Snippet {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  user_id: string;
  pet_id?: string;
  duration: number;
  views: number;
  likes: number;
  created_at: string;
}

interface SnippetCardProps {
  snippet: Snippet;
  onPlay?: (snippet: Snippet) => void;
  onLike?: (id: string) => void;
  onShare?: (id: string) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, onPlay, onLike, onShare }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Ahora';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Thumbnail con overlay de play */}
      <div className="relative group cursor-pointer" onClick={() => onPlay?.(snippet)}>
        <Image
          src={snippet.thumbnail_url || '/placeholder-video.jpg'}
          alt={snippet.title}
          width={400}
          height={192}
          className="w-full h-48 object-cover"
        />
        
        {/* Overlay de play */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <Play size={24} className="text-gray-800 ml-1" />
          </div>
        </div>
        
        {/* Duración */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {formatDuration(snippet.duration)}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {snippet.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {snippet.description}
        </p>

        {/* Estadísticas */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye size={16} className="mr-1" />
              <span>{formatViews(snippet.views)}</span>
            </div>
            <div className="flex items-center">
              <Heart size={16} className="mr-1" />
              <span>{snippet.likes}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{formatDate(snippet.created_at)}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-2">
          <button
            onClick={() => onLike?.(snippet.id)}
            className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            <Heart size={16} className="mr-2" />
            Me gusta
          </button>
          
          <button
            onClick={() => onShare?.(snippet.id)}
            className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            <Share2 size={16} className="mr-2" />
            Compartir
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;
