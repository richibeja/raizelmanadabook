'use client';

import React, { useState } from 'react';
import { useFollow } from '@/hooks/useFollow';
// // import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { X, Users, UserPlus, Search, MapPin, Calendar, Crown } from 'lucide-react';

interface FollowManagerProps {
  onClose: () => void;
}

export default function FollowManager({ onClose }: FollowManagerProps) {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const { 
    followers, 
    following, 
    suggestions, 
    loading, 
    followUser, 
    unfollowUser, 
    isFollowing,
    getFollowStatus 
  } = useFollow();
  
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'suggestions'>('followers');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
    } catch (error) {
      console.error('Error following user:', error);
      alert('Error al seguir al usuario');
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      alert('Error al dejar de seguir al usuario');
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredUsers([]);
      return;
    }

    const allUsers = [...followers, ...following, ...suggestions];
    const filtered = allUsers.filter(user => 
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.bio?.toLowerCase().includes(term.toLowerCase()) ||
      user.location?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString('es-ES');
  };

  const UserCard = ({ user, showFollowButton = true, showStatus = false }: { 
    user: any; 
    showFollowButton?: boolean; 
    showStatus?: boolean;
  }) => {
    const followStatus = getFollowStatus(user.id);
    const isCurrentUser = user.id === userProfile?.id;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{user.name}</h3>
                {user.isVerified && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              {user.bio && (
                <p className="text-gray-600 text-sm line-clamp-2">{user.bio}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatTimeAgo(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {showFollowButton && !isCurrentUser && (
            <div className="flex flex-col gap-2">
              {followStatus === 'following' ? (
                <button
                  onClick={() => handleUnfollow(user.id)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Siguiendo
                </button>
              ) : followStatus === 'follower' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFollow(user.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Seguir
                  </button>
                  <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                    Te sigue
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => handleFollow(user.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Seguir
                </button>
              )}
            </div>
          )}
        </div>
        
        {showStatus && (
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="font-semibold text-lg">{user.postsCount}</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{user.followersCount}</div>
              <div className="text-xs text-gray-500">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{user.followingCount}</div>
              <div className="text-xs text-gray-500">Siguiendo</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getCurrentUsers = () => {
    if (searchTerm.trim()) {
      return filteredUsers;
    }
    
    switch (activeTab) {
      case 'followers':
        return followers;
      case 'following':
        return following;
      case 'suggestions':
        return suggestions;
      default:
        return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Seguimiento</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-blue-100 mt-2">
            Gestiona tus seguidores y descubre nuevas personas
          </p>
        </div>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar usuarios..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('followers')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'followers'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Seguidores ({followers.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'following'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Siguiendo ({following.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'suggestions'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Sugerencias ({suggestions.length})
              </div>
            </button>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-gray-600">Cargando usuarios...</div>
              </div>
            ) : getCurrentUsers().length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === 'followers' ? '👥' : 
                   activeTab === 'following' ? '👤' : '🔍'}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {activeTab === 'followers' ? 'No tienes seguidores aún' :
                   activeTab === 'following' ? 'No sigues a nadie aún' :
                   'No hay sugerencias disponibles'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'followers' ? 'Comienza a compartir contenido para atraer seguidores' :
                   activeTab === 'following' ? 'Sigue a personas que te interesen' :
                   'Intenta buscar usuarios específicos'}
                </p>
                {activeTab === 'suggestions' && (
                  <button
                    onClick={() => setActiveTab('following')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Siguiendo
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {getCurrentUsers().map((user) => (
                  <UserCard 
                    key={user.id} 
                    user={user} 
                    showFollowButton={activeTab !== 'followers'}
                    showStatus={activeTab === 'followers' || activeTab === 'following'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
