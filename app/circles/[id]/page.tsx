'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Settings, Crown, Shield, User, 
  MessageSquare, Heart, Share2, MapPin, Calendar, Lock, Globe
} from 'lucide-react';
import { useCircleMembers } from '../../hooks/useCircles';
import { useAuthContext } from '../../contexts/AuthContext';

export default function CircleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const circleId = params.id as string;
  
  const [circle, setCircle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed');
  
  const { members, loading: membersLoading } = useCircleMembers(circleId);

  // Mock posts for circle feed
  const [posts] = useState([
    {
      id: '1',
      author: { name: 'María García', avatar: '/api/placeholder/40/40' },
      content: 'Mi golden Max probó el nuevo Choribarf de Raízel y le encantó! 🐕💖',
      mediaUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=400&fit=crop',
      timestamp: '2h',
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: '2', 
      author: { name: 'Carlos Rodríguez', avatar: '/api/placeholder/40/40' },
      content: '¿Alguien sabe dónde puedo encontrar aliados Raízel en Medellín? Mi Luna necesita más variedad en su dieta BARF.',
      timestamp: '4h',
      likes: 12,
      comments: 15,
      isLiked: true
    }
  ]);

  useEffect(() => {
    const fetchCircle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/circles/${circleId}`);
        const result = await response.json();
        
        if (result.success) {
          setCircle(result.data);
        } else {
          setError('Círculo no encontrado');
        }
      } catch (err) {
        setError('Error al cargar círculo');
      } finally {
        setLoading(false);
      }
    };

    fetchCircle();
  }, [circleId]);

  const handleJoinCircle = async () => {
    try {
      const response = await fetch(`/api/circles/${circleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', userId: user?.uid })
      });
      
      if (response.ok) {
        // Refresh circle data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error joining circle:', error);
    }
  };

  const handleLeaveCircle = async () => {
    try {
      const response = await fetch(`/api/circles/${circleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave', userId: user?.uid })
      });
      
      if (response.ok) {
        router.push('/circles');
      }
    } catch (error) {
      console.error('Error leaving circle:', error);
    }
  };

  const getUserRole = (userId: string) => {
    const member = members.find(m => m.userId === userId);
    return member?.role || null;
  };

  const isUserMember = user ? members.some(m => m.userId === user.uid) : false;
  const userRole = user ? getUserRole(user.uid) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !circle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Círculo no encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/circles"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver a Círculos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/circles"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Círculos
            </Link>
          </div>

          {/* Circle Cover */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden mb-6">
            {circle.cover_url && (
              <img 
                src={circle.cover_url} 
                alt={circle.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center gap-4">
                  <img
                    src={circle.avatar_url || '/api/placeholder/60/60'}
                    alt={circle.name}
                    className="w-16 h-16 rounded-full border-4 border-white object-cover"
                  />
                  <div>
                    <h1 className="text-3xl font-bold">{circle.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center text-sm">
                        {circle.is_private ? <Lock className="w-4 h-4 mr-1" /> : <Globe className="w-4 h-4 mr-1" />}
                        {circle.is_private ? 'Privado' : 'Público'}
                      </span>
                      <span className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {circle.member_count} miembros
                      </span>
                      {circle.location && (
                        <span className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {circle.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Circle Actions */}
          {!isUserMember ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">¿Te interesa este círculo?</h3>
                  <p className="text-sm text-blue-700">Únete para ver el feed y conectar con la comunidad</p>
                </div>
                <button
                  onClick={handleJoinCircle}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Unirse al Círculo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  ✓ Miembro
                </span>
                {userRole && (
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    userRole === 'admin' ? 'bg-purple-100 text-purple-800' :
                    userRole === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {userRole === 'admin' ? '👑 Admin' : userRole === 'moderator' ? '🛡️ Mod' : '👤 Miembro'}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {(userRole === 'admin' || userRole === 'moderator') && (
                  <button className="flex items-center text-gray-600 hover:text-gray-900">
                    <Settings className="w-4 h-4 mr-1" />
                    Gestionar
                  </button>
                )}
                <button
                  onClick={handleLeaveCircle}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Salir del círculo
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('feed')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'feed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Feed
                {isUserMember && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {posts.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'members'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Miembros
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {circle.member_count}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Acerca de
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div>
            {!isUserMember ? (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Contenido Solo para Miembros
                </h3>
                <p className="text-gray-600 mb-6">
                  Únete al círculo para ver el feed y participar en las conversaciones
                </p>
                <button
                  onClick={handleJoinCircle}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Unirse al Círculo
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Create Post */}
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.photoURL || '/api/placeholder/40/40'}
                      alt="Tu avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <input
                      type="text"
                      placeholder={`¿Qué quieres compartir con ${circle.name}?`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                      Publicar
                    </button>
                  </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg border p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                          <p className="text-sm text-gray-500">{post.timestamp}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-800 mb-4">{post.content}</p>
                      
                      {post.mediaUrl && (
                        <img
                          src={post.mediaUrl}
                          alt="Post content"
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                      )}
                      
                      <div className="flex items-center gap-6 text-gray-500">
                        <button className={`flex items-center gap-1 hover:text-red-500 ${post.isLiked ? 'text-red-500' : ''}`}>
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-500">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments}
                        </button>
                        <button className="flex items-center gap-1 hover:text-green-500">
                          <Share2 className="w-4 h-4" />
                          Compartir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {posts.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay publicaciones aún
                    </h3>
                    <p className="text-gray-600">
                      ¡Sé el primero en compartir algo con la comunidad!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Miembros ({circle.member_count})
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Personas que forman parte de este círculo
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {!membersLoading && members.map((member) => (
                  <div key={member.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="/api/placeholder/40/40"
                        alt="Member"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Usuario {member.userId.slice(0, 8)}</h4>
                        <p className="text-sm text-gray-500">
                          Miembro desde {new Date(member.joinedAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        member.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        member.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role === 'admin' ? (
                          <>
                            <Crown className="w-3 h-3 inline mr-1" />
                            Admin
                          </>
                        ) : member.role === 'moderator' ? (
                          <>
                            <Shield className="w-3 h-3 inline mr-1" />
                            Moderador
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 inline mr-1" />
                            Miembro
                          </>
                        )}
                      </span>
                      
                      {(userRole === 'admin' || userRole === 'moderator') && member.role !== 'admin' && (
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Expulsar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {membersLoading && (
                  <div className="p-4">
                    <div className="animate-pulse space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{circle.description}</p>
            </div>

            {circle.rules && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reglas del Círculo</h3>
                <div className="space-y-2">
                  {circle.rules.split('\n').map((rule: string, index: number) => (
                    <p key={index} className="text-gray-600">
                      {rule}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {circle.tags && circle.tags.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {circle.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Creado:</span>
                  <p className="font-medium">{new Date(circle.created_at).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <span className="text-gray-500">Categoría:</span>
                  <p className="font-medium">{circle.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <p className="font-medium">{circle.is_private ? 'Privado' : 'Público'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Ubicación:</span>
                  <p className="font-medium">{circle.location || 'No especificada'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}