'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSnippets } from '../../hooks/useSnippets';
import SnippetCard from '../../components/SnippetCard';
import { ArrowLeft, Heart, MessageCircle, Share2, Eye, Clock, MapPin, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function SnippetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { snippets, loading, error } = useSnippets();
  
  const [snippet, setSnippet] = useState<any>(null);
  const [relatedSnippets, setRelatedSnippets] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const snippetId = params.id as string;

  useEffect(() => {
    const fetchSnippet = async () => {
      if (snippetId) {
        // const snippetData = await getSnippet(snippetId);
        const snippetData = snippets.find(s => s.id === snippetId);
        if (snippetData) {
          setSnippet(snippetData);
          // In a real implementation, you would fetch related snippets here
          setRelatedSnippets([]);
        }
      }
    };

    fetchSnippet();
  }, [snippetId, snippets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando snippet...</p>
        </div>
      </div>
    );
  }

  if (error || !snippet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Snippet no encontrado</h1>
          <p className="text-gray-600 mb-6">
            El snippet que buscas no existe o ha sido eliminado.
          </p>
          <Link
            href="/snippets"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Snippets
          </Link>
        </div>
      </div>
    );
  }

  // Format functions
  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real implementation, you would call the API here
  };

  const handleShare = () => {
    // In a real implementation, you would show a share dialog
    if (navigator.share) {
      navigator.share({
        title: snippet.title,
        text: snippet.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">Snippet</h1>
            </div>
            <div className="w-8"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative aspect-[9/16] bg-black">
                <video
                  src={snippet.video_url}
                  poster={snippet.thumbnail_url || undefined}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                />
              </div>
            </div>

            {/* Snippet Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Title and Stats */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {snippet.title}
                </h1>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatViewCount(snippet.view_count)} vistas</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(snippet.duration_seconds)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(snippet.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {snippet.description}
                </p>
              </div>

              {/* Hashtags */}
              {snippet.hashtags && snippet.hashtags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {snippet.hashtags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {snippet.location && (
                <div className="mb-4 flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {snippet.location}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{formatViewCount(snippet.like_count)}</span>
                </button>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{formatViewCount(snippet.comment_count)}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Compartir</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comentarios ({snippet.comment_count})
                </h3>
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Los comentarios estarán disponibles pronto</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Autor
              </h3>
              <div className="flex items-center space-x-3">
                <img
                  src={snippet.author_avatar || '/default-avatar.png'}
                  alt={snippet.author_username || 'Usuario'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900">
                      {snippet.author_username || 'Usuario'}
                    </span>
                    {snippet.author_verified && (
                      <span className="text-blue-500 text-sm">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {snippet.author_verified ? 'Verificado' : 'Usuario'}
                  </p>
                </div>
              </div>
            </div>

            {/* Video Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estadísticas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vistas</span>
                  <span className="font-semibold">{formatViewCount(snippet.view_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Me gusta</span>
                  <span className="font-semibold">{formatViewCount(snippet.like_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comentarios</span>
                  <span className="font-semibold">{formatViewCount(snippet.comment_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compartidos</span>
                  <span className="font-semibold">{formatViewCount(snippet.share_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engagement</span>
                  <span className="font-semibold">{snippet.engagement_score.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Related Snippets */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Snippets Relacionados
              </h3>
              {relatedSnippets.length > 0 ? (
                <div className="space-y-4">
                  {relatedSnippets.map((relatedSnippet) => (
                    <SnippetCard
                      key={relatedSnippet.id}
                      snippet={relatedSnippet}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay snippets relacionados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
