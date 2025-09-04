'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Play, Pause, Heart, Eye, Clock, X, Plus } from 'lucide-react';
import { useMoments } from '../hooks/useMoments';
import { useAuthContext } from '../contexts/AuthContext';

interface MomentsCarouselProps {
  circleId?: string;
  onUploadClick?: () => void;
}

const MomentsCarousel: React.FC<MomentsCarouselProps> = ({ circleId, onUploadClick }) => {
  const { user } = useAuthContext();
  const { moments, loading, view, getTimeRemaining, getProgress } = useMoments({ 
    circleId,
    limit: 20 
  });
  
  const [selectedMoment, setSelectedMoment] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewProgress, setViewProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play when moment is selected
  const startProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    const duration = selectedMoment?.mediaType === 'video' 
      ? (selectedMoment.duration || 15) * 1000 
      : 5000;

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100));
        if (newProgress >= 100) {
          handleNext();
          return 0;
        }
        return newProgress;
      });
    }, 100);
  };

  useEffect(() => {
    if (selectedMoment && selectedMoment.mediaType === 'video') {
      setIsPlaying(true);
      startProgress();
    }
  }, [selectedMoment]);

  const handleMomentComplete = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Record view as completed
    if (selectedMoment && user) {
      view(selectedMoment.id, true);
    }

    // Auto-advance to next moment
    const currentIndex = moments.findIndex(m => m.id === selectedMoment?.id);
    if (currentIndex < moments.length - 1) {
      const nextMoment = moments[currentIndex + 1];
      setSelectedMoment(nextMoment);
      setViewProgress(0);
    } else {
      // No more moments
      setSelectedMoment(null);
      setViewProgress(0);
    }
  };

  const handleMomentClick = (moment: any) => {
    setSelectedMoment(moment);
    setViewProgress(0);
    setIsPlaying(true);
    
    // Record view
    if (user) {
      view(moment.id, false);
    }
  };

  const togglePlayPause = () => {
    if (selectedMoment?.mediaType === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      } else {
        videoRef.current.play();
        startProgress();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const closeMoment = () => {
    setSelectedMoment(null);
    setViewProgress(0);
    setIsPlaying(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-3 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded mt-1 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Moments Carousel */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {/* Add Moment Button */}
          {user && (
            <div className="flex-shrink-0 text-center">
              <button
                onClick={onUploadClick}
                className="w-16 h-16 border-2 border-dashed border-blue-400 rounded-full flex items-center justify-center hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-6 h-6 text-blue-500" />
              </button>
              <p className="text-xs text-gray-600 mt-1 truncate w-16">Tu moment</p>
            </div>
          )}
          
          {/* Moments List */}
          {moments.map((moment) => (
            <div key={moment.id} className="flex-shrink-0 text-center">
              <button
                onClick={() => handleMomentClick(moment)}
                className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition-transform"
              >
                {/* Profile Avatar Placeholder */}
                <img
                  src="/api/placeholder/60/60"
                  alt="Autor"
                  className="w-full h-full object-cover"
                />
                
                {/* Media Preview */}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  {moment.mediaType === 'video' && (
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-2 h-2 text-black" />
                    </div>
                  )}
                </div>

                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="28"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="28"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="175.93"
                    strokeDashoffset={175.93 * (1 - getProgress(moment.createdAt, moment.expiresAt))}
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
                      <stop offset="100%" style={{ stopColor: '#EC4899' }} />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
              
              <p className="text-xs text-gray-600 mt-1 truncate w-16">
                {getTimeRemaining(moment.expiresAt)}
              </p>
            </div>
          ))}
          
          {moments.length === 0 && !user && (
            <div className="flex-shrink-0 text-center p-4">
              <p className="text-gray-500 text-sm">
                Inicia sesión para ver moments
              </p>
            </div>
          )}
          
          {moments.length === 0 && user && (
            <div className="flex-shrink-0 text-center p-4">
              <p className="text-gray-500 text-sm">
                ¡Sé el primero en compartir un moment!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Moment Viewer Modal */}
      {selectedMoment && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-md mx-4">
            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ width: `${viewProgress * 100}%` }}
                />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeMoment}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Author Info */}
            <div className="absolute top-12 left-4 z-10 flex items-center text-white">
              <img
                src="/api/placeholder/30/30"
                alt="Autor"
                className="w-8 h-8 rounded-full border-2 border-white mr-2"
              />
              <div>
                <p className="text-sm font-medium">Usuario {selectedMoment.authorId.slice(0, 8)}</p>
                <p className="text-xs opacity-75">{getTimeRemaining(selectedMoment.expiresAt)}</p>
              </div>
            </div>

            {/* Media Content */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              {selectedMoment.mediaType === 'image' ? (
                <Image
                  src={selectedMoment.mediaUrl}
                  alt="Moment"
                  width={400}
                  height={384}
                  className="w-full h-auto max-h-96 object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={selectedMoment.mediaUrl}
                  className="w-full h-auto max-h-96 object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}

              {/* Video Controls */}
              {selectedMoment.mediaType === 'video' && (
                <button
                  onClick={togglePlayPause}
                  className="absolute inset-0 flex items-center justify-center text-white hover:bg-black hover:bg-opacity-20 transition-colors"
                >
                  {!isPlaying && (
                    <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 ml-1" />
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* Content Text */}
            {selectedMoment.content && (
              <div className="absolute bottom-16 left-4 right-4 z-10">
                <p className="text-white text-sm bg-black bg-opacity-50 p-2 rounded">
                  {selectedMoment.content}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {selectedMoment.stats.viewsCount}
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {selectedMoment.stats.likesCount}
                </div>
              </div>
              
              <div className="text-xs opacity-75">
                <Clock className="w-3 h-3 inline mr-1" />
                {getTimeRemaining(selectedMoment.expiresAt)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default MomentsCarousel;