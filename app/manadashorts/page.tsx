'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  Plus, 
  Home, 
  Bell, 
  User, 
  Video, 
  Film,
  X,
  Circle
} from 'lucide-react';

interface ShortVideo {
  id: string;
  petName: string;
  petUsername: string;
  petType: string;
  petAge: string;
  petAvatar: string;
  videoUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

export default function ManadaShortsPage() {
  const [videos, setVideos] = useState<ShortVideo[]>([
    {
      id: '1',
      petName: 'Max',
      petUsername: '@max_golden',
      petType: 'Golden Retriever',
      petAge: '3 años',
      petAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=612&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-dog-waiting-for-his-ball-14547-large.mp4',
      caption: 'Esperando pacientemente para jugar con su pelota 🎾',
      hashtags: ['#perro', '#goldenretriever', '#jugar', '#pelota'],
      likes: 2400,
      comments: 543,
      shares: 89,
      isLiked: false
    },
    {
      id: '2',
      petName: 'Luna',
      petUsername: '@luna_siames',
      petType: 'Gato Siamés',
      petAge: '2 años',
      petAvatar: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cat-looking-to-the-camera-14557-large.mp4',
      caption: 'Mirando fijamente a la cámara con mis ojos azules 👀',
      hashtags: ['#gato', '#siames', '#ojosazules', '#mirando'],
      likes: 3100,
      comments: 821,
      shares: 156,
      isLiked: false
    },
    {
      id: '3',
      petName: 'Bobby',
      petUsername: '@bobby_corgi',
      petType: 'Corgi',
      petAge: '4 años',
      petAvatar: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-small-dog-running-on-the-beach-14555-large.mp4',
      caption: 'Corriendo feliz en la playa 🏖️ ¿A qué mascota no le gusta la arena?',
      hashtags: ['#perro', '#corgi', '#playa', '#corriendo', '#feliz'],
      likes: 4700,
      comments: 1200,
      shares: 234,
      isLiked: false
    }
  ]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoMuted, setVideoMuted] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inicializar videos como silenciados
  useEffect(() => {
    const mutedState: { [key: string]: boolean } = {};
    videos.forEach(video => {
      mutedState[video.id] = true;
    });
    setVideoMuted(mutedState);
  }, [videos]);

  // Auto-play del video actual
  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      // Verificar que el video esté listo antes de reproducir
      if (currentVideo.readyState >= 2) {
        currentVideo.play().catch(() => {
          // Silenciar el error de reproducción
        });
      } else {
        currentVideo.addEventListener('loadeddata', () => {
          currentVideo.play().catch(() => {
            // Silenciar el error de reproducción
          });
        }, { once: true });
      }
    }
  }, [currentVideoIndex]);

  // Pausar otros videos cuando se cambia
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentVideoIndex) {
        video.pause();
      }
    });
  }, [currentVideoIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = window.innerHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < videos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  const toggleLike = (videoId: string) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1
            }
          : video
      )
    );
  };

  const toggleSound = (videoId: string) => {
    setVideoMuted(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const handleComment = () => {
    alert('Funcionalidad de comentarios en desarrollo. ¡Próximamente!');
  };

  const handleShare = () => {
    alert('Compartiendo video en ManadaBook...');
  };

  const handleUpload = () => {
    alert('Funcionalidad de subida en desarrollo. ¡Próximamente!');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 p-4">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center text-xl font-bold">
            <Circle className="mr-2 h-6 w-6 text-red-500 fill-current" />
            <span>ManadaShorts</span>
          </div>
          <div className="flex items-center bg-white/10 rounded-full px-4 py-2 flex-1 mx-4">
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar mascotas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white placeholder-gray-400 w-full outline-none"
            />
          </div>
        </div>
      </header>

      {/* Video Feed */}
      <div 
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, index) => (
          <div key={video.id} className="h-screen w-full relative snap-start">
            {/* Video Player */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="w-full h-full object-cover absolute top-0 left-0"
              loop
              muted={videoMuted[video.id]}
              playsInline
            >
              <source src={video.videoUrl} type="video/mp4" />
            </video>

            {/* Video Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
              {/* Pet Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white">
                  <img 
                    src={video.petAvatar} 
                    alt={video.petName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{video.petUsername}</h3>
                  <p className="text-sm text-gray-300">{video.petType} • {video.petAge}</p>
                </div>
              </div>

              {/* Caption */}
              <p className="text-base mb-2">{video.caption}</p>
              
              {/* Hashtags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {video.hashtags.map((hashtag, idx) => (
                  <span key={idx} className="text-red-500 text-sm">
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
              {/* Like Button */}
              <button
                onClick={() => toggleLike(video.id)}
                className={`flex flex-col items-center ${
                  video.isLiked ? 'text-red-500' : 'text-white'
                }`}
              >
                <Heart 
                  className={`h-8 w-8 mb-1 ${
                    video.isLiked ? 'fill-current' : ''
                  }`}
                />
                <span className="text-xs">{formatNumber(video.likes)}</span>
              </button>

              {/* Comment Button */}
              <button
                onClick={handleComment}
                className="flex flex-col items-center text-white"
              >
                <MessageCircle className="h-8 w-8 mb-1" />
                <span className="text-xs">{formatNumber(video.comments)}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex flex-col items-center text-white"
              >
                <Share2 className="h-8 w-8 mb-1" />
                <span className="text-xs">{formatNumber(video.shares)}</span>
              </button>

              {/* Sound Button */}
              <button
                onClick={() => toggleSound(video.id)}
                className="flex flex-col items-center text-white"
              >
                {videoMuted[video.id] ? (
                  <VolumeX className="h-8 w-8 mb-1" />
                ) : (
                  <Volume2 className="h-8 w-8 mb-1" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-black/80 backdrop-blur-md flex justify-around py-3">
        <button className="flex flex-col items-center text-red-500">
          <Home className="h-6 w-6 mb-1" />
          <span className="text-xs">Inicio</span>
        </button>
        
        <button className="flex flex-col items-center text-gray-400">
          <Search className="h-6 w-6 mb-1" />
          <span className="text-xs">Descubrir</span>
        </button>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center -mt-6 shadow-lg"
        >
          <Plus className="h-6 w-6 text-white" />
        </button>
        
        <button className="flex flex-col items-center text-gray-400">
          <Bell className="h-6 w-6 mb-1" />
          <span className="text-xs">Notificaciones</span>
        </button>
        
        <button className="flex flex-col items-center text-gray-400">
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs">Perfil</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-md rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Crear nuevo Short</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={handleUpload}
                  className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
                >
                  <Video className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <p className="text-sm">Subir video</p>
                </button>
                <button
                  onClick={handleUpload}
                  className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-700 transition-colors"
                >
                  <Film className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <p className="text-sm">Grabar video</p>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Descripción del video
                  </label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                    rows={3}
                    placeholder="Describe tu video..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                    placeholder="#mascota #divertido #..."
                  />
                </div>
                
                <button
                  onClick={handleUpload}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Publicar Short
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
