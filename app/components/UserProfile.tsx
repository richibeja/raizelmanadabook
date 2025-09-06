'use client';

import React, { useState } from 'react';
import { X, Settings, Edit3, Heart, MessageCircle, Share2, Plus, User, Camera } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked' | 'saved'>('videos');

  const pet = {
    name: 'Max',
    species: 'Perro',
    breed: 'Golden Retriever',
    age: '2 años',
    username: '@max_golden',
    bio: 'Soy Max, un Golden Retriever súper juguetón! 🐕✨ Me encanta correr en el parque y hacer nuevos amigos.',
    followers: 1234,
    following: 567,
    likes: 8901,
    avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    cover: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    verified: true,
    owner: {
      name: 'María González',
      username: '@maria_petmom',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  };

  const videos = [
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      views: '12.3K',
      duration: '0:15'
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      views: '8.7K',
      duration: '0:22'
    },
    {
      id: '3',
      thumbnail: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      views: '15.2K',
      duration: '0:18'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Perfil de Mascota</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cover Photo */}
        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
          <img
            src={pet.cover}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="flex items-start justify-between -mt-8 mb-4">
            <img
              src={pet.avatar}
              alt={pet.name}
              className="w-20 h-20 rounded-full border-4 border-gray-900 object-cover"
            />
            <div className="flex space-x-2 mt-12">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Edit3 className="w-4 h-4 mr-2 inline" />
                Editar
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-xl font-bold text-white">{pet.name}</h3>
              {pet.verified && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-1">{pet.username}</p>
            <p className="text-gray-400 text-xs mb-2">{pet.species} • {pet.breed} • {pet.age}</p>
            <p className="text-gray-300 text-sm mb-3">{pet.bio}</p>
            
            {/* Owner Info */}
            <div className="flex items-center space-x-2 bg-gray-800/50 rounded-lg p-3">
              <img
                src={pet.owner.avatar}
                alt={pet.owner.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-white text-sm font-medium">Tutor: {pet.owner.name}</p>
                <p className="text-gray-400 text-xs">{pet.owner.username}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 mb-4">
            <div className="text-center">
              <div className="text-white font-bold text-lg">
                {formatNumber(pet.followers)}
              </div>
              <div className="text-gray-400 text-sm">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">
                {formatNumber(pet.following)}
              </div>
              <div className="text-gray-400 text-sm">Siguiendo</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">
                {formatNumber(pet.likes)}
              </div>
              <div className="text-gray-400 text-sm">Me gusta</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'videos'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'liked'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Me gusta
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Guardados
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-2">
            {videos.map((video) => (
              <div key={video.id} className="relative group">
                <img
                  src={video.thumbnail}
                  alt="Video thumbnail"
                  className="w-full aspect-[9/16] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">123</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">45</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">12</span>
                      </div>
                    </div>
                    <div className="text-xs">{video.views} vistas</div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
            ))}
            
            {/* Add Video Button */}
            <div className="aspect-[9/16] bg-gray-800 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-gray-700 transition-colors">
              <div className="text-center text-gray-400 group-hover:text-white">
                <Plus className="w-8 h-8 mx-auto mb-2" />
                <span className="text-xs">Agregar video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
