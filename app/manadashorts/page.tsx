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
import VideoUploadModal from '../components/VideoUploadModal';
import VideoComments from '../components/VideoComments';
import NotificationSystem from '../components/NotificationSystem';
import SearchModal from '../components/SearchModal';
import UserProfile from '../components/UserProfile';
import OnboardingModal from '../components/OnboardingModal';
import { useManadaBookAuth } from '../contexts/ManadaBookAuthContext';
import { useManadaShorts } from '../hooks/useManadaShorts';
import ManadaBookAuth from '../components/ManadaBookAuth';

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
  const { user, userProfile, loading: authLoading } = useManadaBookAuth();
  const { 
    videos, 
    loading: videosLoading, 
    error: videosError, 
    likeVideo, 
    followUser, 
    shareVideo, 
    uploadVideo, 
    getVideoComments, 
    addComment 
  } = useManadaShorts();
  const [showAuth, setShowAuth] = useState(false);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoMuted, setVideoMuted] = useState<{ [key: string]: boolean }>({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // El hook useManadaShorts ya maneja la carga de videos
  useEffect(() => {
    if (user && userProfile) {
      setHasProfile(true);
    }
  }, [user, userProfile]);


  const loadSampleVideos = (): ShortVideo[] => {
    return [
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
    ];
  };

  // Inicializar videos como silenciados
  useEffect(() => {
    const mutedState: { [key: string]: boolean } = {};
    videos.forEach(video => {
      mutedState[video.id] = true;
    });
    setVideoMuted(mutedState);
  }, [videos]);

  // Auto-play del video actual con mejor manejo
  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      // Verificar que el video esté listo antes de reproducir
      if (currentVideo.readyState >= 2) {
        currentVideo.play().catch((error) => {
          console.log('Error de reproducción:', error);
        });
      } else {
        const handleLoadedData = () => {
          currentVideo.play().catch((error) => {
            console.log('Error de reproducción:', error);
          });
        };
        currentVideo.addEventListener('loadeddata', handleLoadedData, { once: true });
        
        // Cleanup function
        return () => {
          currentVideo.removeEventListener('loadeddata', handleLoadedData);
        };
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

  // Navegación con teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentVideoIndex > 0) {
            setCurrentVideoIndex(currentVideoIndex - 1);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
          }
          break;
        case ' ':
          e.preventDefault();
          const currentVideo = videoRefs.current[currentVideoIndex];
          if (currentVideo) {
            if (currentVideo.paused) {
              currentVideo.play();
            } else {
              currentVideo.pause();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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

  // Navegación táctil para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startY = touch.clientY;
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endY = touch.clientY;
      const diff = startY - endY;
      
      if (Math.abs(diff) > 50) { // Mínimo de 50px para considerar swipe
        if (diff > 0) {
          if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
          }
        } else {
          if (currentVideoIndex > 0) {
            setCurrentVideoIndex(currentVideoIndex - 1);
          }
        }
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  const toggleLike = async (videoId: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    try {
      await likeVideo(videoId);
    } catch (error) {
      console.error('Error liking video:', error);
      alert('Error al dar like al video');
    }
  };

  const toggleSound = (videoId: string) => {
    setVideoMuted(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const handleComment = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowComments(true);
  };

  const handleShare = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    try {
      const currentVideo = videos[currentVideoIndex];
      if (currentVideo) {
        await shareVideo(currentVideo.id);
      }
    } catch (error) {
      console.error('Error sharing video:', error);
      alert('Error al compartir video');
    }
  };

  const handleUpload = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowUploadModal(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setHasProfile(true);
  };

  const toggleFollow = async (petUsername: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    try {
      // Buscar el video para obtener el authorId
      const video = videos.find(v => v.petUsername === petUsername);
      if (video) {
        await followUser(video.authorId);
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('Error al seguir usuario');
    }
  };


  const handleVideoUpload = async (videoData: {
    file: File;
    caption: string;
    hashtags: string[];
  }) => {
    if (!user || !userProfile) return;
    
    try {
      await uploadVideo(videoData);
      setShowUploadModal(false);
      alert('¡Video subido exitosamente!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error al subir video');
    }
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
            <div>
              <span>ManadaShorts</span>
              <p className="text-xs text-gray-400 font-normal">↑↓ Navegar • Espacio Pausar</p>
            </div>
          </div>
          <div className="flex items-center bg-white/10 rounded-full px-4 py-2 flex-1 mx-4">
            <Search className="mr-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar mascotas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (!user) {
                  setShowAuth(true);
                } else {
                  setShowSearch(true);
                }
              }}
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
        onTouchStart={handleTouchStart}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, index) => (
          <div key={video.id} className="h-screen w-full relative snap-start">
            {/* Video Player */}
            <video
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              className="w-full h-full object-cover absolute top-0 left-0"
              loop
              muted={videoMuted[video.id]}
              playsInline
              preload="metadata"
            >
              <source src={video.videoUrl} type="video/mp4" />
            </video>

            {/* Indicador de video actual */}
            {index === currentVideoIndex && (
              <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                {index + 1} / {videos.length}
              </div>
            )}

            {/* Video Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
              {/* Pet Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
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
                <button
                  onClick={() => toggleFollow(video.petUsername)}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    following.has(video.petUsername)
                      ? 'bg-gray-600 text-white'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {following.has(video.petUsername) ? 'Siguiendo' : 'Seguir'}
                </button>
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
        
        <div className="flex flex-col items-center">
          <NotificationSystem />
          <span className="text-xs text-gray-400 mt-1">Notificaciones</span>
        </div>
        
        <button 
          onClick={() => {
            if (!user) {
              setShowAuth(true);
            } else {
              setShowProfile(true);
            }
          }}
          className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
        >
          <User className="h-6 w-6 mb-1" />
          <span className="text-xs">Perfil</span>
        </button>
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleVideoUpload}
      />

      {/* Video Comments Modal */}
      <VideoComments
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        videoId={videos[currentVideoIndex]?.id || ''}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Authentication Modal */}
      {showAuth && (
        <ManadaBookAuth
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
