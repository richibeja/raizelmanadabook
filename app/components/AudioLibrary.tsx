'use client';

import React, { useState, useRef } from 'react';
import { X, Play, Pause, Music, Search, Heart, Download } from 'lucide-react';

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  isTrending: boolean;
  isLiked: boolean;
  previewUrl: string;
  downloadUrl: string;
}

interface AudioLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrack: (track: AudioTrack) => void;
}

export default function AudioLibrary({ isOpen, onClose, onSelectTrack }: AudioLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement>(null);

  const genres = [
    { id: 'all', name: 'Todos' },
    { id: 'trending', name: 'Tendencias' },
    { id: 'happy', name: 'Feliz' },
    { id: 'calm', name: 'Tranquilo' },
    { id: 'energetic', name: 'Energético' },
    { id: 'funny', name: 'Divertido' },
    { id: 'classical', name: 'Clásico' }
  ];

  const tracks: AudioTrack[] = [
    {
      id: '1',
      title: 'Happy Puppy',
      artist: 'Pet Sounds',
      duration: '0:30',
      genre: 'happy',
      isTrending: true,
      isLiked: false,
      previewUrl: '/audio/happy-puppy.mp3',
      downloadUrl: '/audio/happy-puppy-full.mp3'
    },
    {
      id: '2',
      title: 'Cat Purr',
      artist: 'Feline Vibes',
      duration: '0:25',
      genre: 'calm',
      isTrending: false,
      isLiked: true,
      previewUrl: '/audio/cat-purr.mp3',
      downloadUrl: '/audio/cat-purr-full.mp3'
    },
    {
      id: '3',
      title: 'Dog Bark Beat',
      artist: 'Canine Beats',
      duration: '0:35',
      genre: 'energetic',
      isTrending: true,
      isLiked: false,
      previewUrl: '/audio/dog-bark-beat.mp3',
      downloadUrl: '/audio/dog-bark-beat-full.mp3'
    },
    {
      id: '4',
      title: 'Playful Kittens',
      artist: 'Kitten Melodies',
      duration: '0:28',
      genre: 'funny',
      isTrending: false,
      isLiked: false,
      previewUrl: '/audio/playful-kittens.mp3',
      downloadUrl: '/audio/playful-kittens-full.mp3'
    },
    {
      id: '5',
      title: 'Pet Lullaby',
      artist: 'Sleepy Pets',
      duration: '0:40',
      genre: 'calm',
      isTrending: false,
      isLiked: true,
      previewUrl: '/audio/pet-lullaby.mp3',
      downloadUrl: '/audio/pet-lullaby-full.mp3'
    },
    {
      id: '6',
      title: 'Adventure Theme',
      artist: 'Pet Adventures',
      duration: '0:32',
      genre: 'energetic',
      isTrending: true,
      isLiked: false,
      previewUrl: '/audio/adventure-theme.mp3',
      downloadUrl: '/audio/adventure-theme-full.mp3'
    }
  ];

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || 
                        (selectedGenre === 'trending' ? track.isTrending : track.genre === selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const handlePlayPause = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setPlayingTrack(trackId);
      // En una implementación real, aquí cargarías y reproducirías el audio
      console.log('Playing track:', trackId);
    }
  };

  const handleLike = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const handleSelectTrack = (track: AudioTrack) => {
    onSelectTrack(track);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Biblioteca de Audio</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar música..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex space-x-2 overflow-x-auto">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedGenre === genre.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks List */}
        <div className="p-4 space-y-3">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <button
                onClick={() => handlePlayPause(track.id)}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                {playingTrack === track.id ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-white font-medium text-sm truncate">
                    {track.title}
                  </h3>
                  {track.isTrending && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      Trending
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs">{track.artist} • {track.duration}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleLike(track.id)}
                  className={`p-1 rounded-full transition-colors ${
                    likedTracks.has(track.id)
                      ? 'text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedTracks.has(track.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => handleSelectTrack(track)}
                  className="text-red-500 hover:text-red-400 p-1"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredTracks.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <Music className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No se encontraron tracks</p>
              <p className="text-sm">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
}
