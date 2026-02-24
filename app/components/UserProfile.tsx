'use client';

import React, { useState } from 'react';
import { X, Settings, Edit, Heart, MessageCircle, Share2, Plus } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('videos');
  const [userStats] = useState({
    followers: 1250,
    following: 340,
    videos: 28,
    likes: 15600
  });

  const [userVideos] = useState([
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      likes: 2400,
      comments: 89
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      likes: 1800,
      comments: 45
    },
    {
      id: '3',
      thumbnail: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      likes: 3200,
      comments: 156
    }
  ]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
      <div className="w-full bg-gray-900 rounded-t-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Mi Perfil</h3>
          <div className="flex items-center space-x-2">
            <button className="text-gray-400 hover:text-white p-2">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile Info */}
          <div className="p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-red-500">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Mi perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">@mi_mascota</h2>
                <p className="text-gray-400">Mi Mascota • 2 años</p>
                <p className="text-gray-300 text-sm mt-1">
                  Compartiendo momentos especiales con mi mejor amigo 🐾
                </p>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                <Edit className="w-4 h-4 mr-2 inline" />
                Editar
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{userStats.followers}</div>
                <div className="text-sm text-gray-400">Seguidores</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{userStats.following}</div>
                <div className="text-sm text-gray-400">Siguiendo</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{userStats.videos}</div>
                <div className="text-sm text-gray-400">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{userStats.likes}</div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'liked'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Me gusta
              </button>
            </div>

            {/* Content */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-3 gap-2">
                {userVideos.map((video) => (
                  <div key={video.id} className="relative group">
                    <img
                      src={video.thumbnail}
                      alt="Video thumbnail"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{video.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{video.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                  <Plus className="w-8 h-8" />
                </button>
              </div>
            )}

            {activeTab === 'liked' && (
              <div className="text-center py-8 text-gray-400">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Los videos que te gustan aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}