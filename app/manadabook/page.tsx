'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import { usePosts } from '@/hooks/usePosts';
import ManadaBookAuth from '@/components/ManadaBookAuth';
import PostComposer from '@/components/PostComposer';
import PetProfileManager from '@/components/PetProfileManager';
import CirclesManager from '@/components/CirclesManager';
import CommentsSection from '@/components/CommentsSection';
import FollowManager from '@/components/FollowManager';
import MomentsManager from '@/components/MomentsManager';
import SnippetsManager from '@/components/SnippetsManager';
import NotificationsManager from '@/components/NotificationsManager';
import MarketplaceManager from '@/components/MarketplaceManager';
import ModerationManager from '@/components/ModerationManager';
import AnalyticsManager from '@/components/AnalyticsManager';
import MessagingManager from '@/components/MessagingManager';
import { useAds } from '@/hooks/useAds';
import AdFeedCard from '@/components/AdFeedCard';

// ManadaBook ahora usa posts reales desde Firebase

export default function ManadaBookPage() {
  const { user, userProfile, loading, logout } = useManadaBookAuth();
  const { posts, loading: postsLoading, likePost, sharePost, deletePost } = usePosts();
  const { ads, loading: adsLoading, error: adsError } = useAds({ status: 'active' });
  const [mostrarComposer, setMostrarComposer] = useState(false);
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const [mostrarPetManager, setMostrarPetManager] = useState(false);
  const [mostrarCircles, setMostrarCircles] = useState(false);
  const [mostrarComments, setMostrarComments] = useState<string | null>(null);
  const [mostrarFollow, setMostrarFollow] = useState(false);
  const [mostrarMoments, setMostrarMoments] = useState(false);
  const [mostrarSnippets, setMostrarSnippets] = useState(false);
  const [mostrarNotifications, setMostrarNotifications] = useState(false);
  const [mostrarMarketplace, setMostrarMarketplace] = useState(false);
  const [mostrarModeration, setMostrarModeration] = useState(false);
  const [mostrarAnalytics, setMostrarAnalytics] = useState(false);
  const [mostrarMessaging, setMostrarMessaging] = useState(false);

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComentar = (postId: string) => {
    setMostrarComments(postId);
  };

  const handleCompartir = async (postId: string) => {
    try {
      await sharePost(postId);
      
      if (navigator.share) {
        navigator.share({
          title: 'Post de ManadaBook',
          text: 'Mira este post interesante en ManadaBook',
          url: `${window.location.origin}/manadabook/post/${postId}`
        });
      } else {
        navigator.clipboard.writeText(`${window.location.origin}/manadabook/post/${postId}`);
        alert('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
      try {
        await deletePost(postId);
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error al eliminar el post');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🐾</div>
          <div style={{ fontSize: '1.25rem', color: '#666' }}>Cargando ManadaBook...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #0F6FF6 0%, #0C5CD9 100%)', 
        color: 'white', 
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            ManadaBook 🐾
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            La red social exclusiva para mascotas. Comparte momentos especiales, 
            conecta con otros dueños y descubre consejos para el cuidado de tu compañero.
          </p>
          
          {user ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setMostrarComposer(true)}
              style={{
                backgroundColor: 'white',
                color: '#0F6FF6',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Crear Post
            </button>
              <button 
                onClick={() => setMostrarPetManager(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Mis Mascotas
              </button>
              <button 
                onClick={() => setMostrarCircles(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Círculos
              </button>
              <button 
                onClick={() => setMostrarFollow(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Seguimiento
              </button>
              <button 
                onClick={() => setMostrarMoments(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Moments
              </button>
              <button 
                onClick={() => setMostrarSnippets(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Snippets
              </button>
              <button 
                onClick={() => setMostrarNotifications(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Notificaciones
              </button>
              <button 
                onClick={() => setMostrarMarketplace(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Marketplace
              </button>
              <button 
                onClick={() => setMostrarModeration(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Moderación
              </button>
              <button 
                onClick={() => setMostrarAnalytics(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Analytics
              </button>
              <button 
                onClick={() => setMostrarMessaging(true)}
                style={{
                  border: '2px solid white',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Mensajes
              </button>
              <button 
                onClick={logout}
                style={{
                  border: '2px solid #ef4444',
                  color: '#ef4444',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'transparent'
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setMostrarAuth(true)}
                style={{
                  backgroundColor: 'white',
                  color: '#0F6FF6',
                  padding: '0.75rem 2rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => setMostrarAuth(true)}
                style={{
              border: '2px solid white',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              backgroundColor: 'transparent'
                }}
              >
                Registrarse
            </button>
          </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: 'white', padding: '3rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0F6FF6', marginBottom: '0.5rem' }}>2,500+</div>
              <div style={{ color: '#6B7280' }}>Mascotas Registradas</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FF7A59', marginBottom: '0.5rem' }}>15,000+</div>
              <div style={{ color: '#6B7280' }}>Posts Compartidos</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00C2A8', marginBottom: '0.5rem' }}>8,000+</div>
              <div style={{ color: '#6B7280' }}>Miembros Activos</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0F6FF6', marginBottom: '0.5rem' }}>50+</div>
              <div style={{ color: '#6B7280' }}>Ciudades</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed Section */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '1rem' }}>Feed de la Manada</h2>
          <p style={{ color: '#6B7280' }}>Descubre los momentos más especiales de nuestra comunidad</p>
        </div>

        {/* Post Composer */}
        {mostrarComposer && (
          <PostComposer onClose={() => setMostrarComposer(false)} />
        )}

        {/* Posts Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {postsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🐾</div>
              <div style={{ color: '#6B7280' }}>Cargando posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>
                {user ? 'No hay posts aún' : 'Inicia sesión para ver posts'}
              </h3>
              <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>
                {user 
                  ? 'Sé el primero en compartir un momento especial con tu mascota'
                  : 'Regístrate para acceder a la comunidad de ManadaBook'
                }
              </p>
              {user ? (
                <button 
                  onClick={() => setMostrarComposer(true)}
                  style={{
                    backgroundColor: '#0F6FF6',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Crear Primer Post
                </button>
              ) : (
                <button 
                  onClick={() => setMostrarAuth(true)}
                  style={{
                    backgroundColor: '#0F6FF6',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          ) : (
            // Combinar posts y anuncios
            posts.map((post, index) => {
              // Mostrar anuncio cada 3 posts
              if (index > 0 && index % 3 === 0 && ads && ads.length > 0) {
                const ad = ads[Math.floor(Math.random() * ads.length)];
                return (
                  <React.Fragment key={`fragment-${index}`}>
                    <AdFeedCard
                      key={`ad-${ad.id}`}
                      ad={{
                        id: ad.id,
                        title: ad.title,
                        description: ad.description,
                        image_url: ad.image_url,
                        target_audience: ad.target_audience,
                        budget: ad.budget,
                        start_date: ad.start_date,
                        end_date: ad.end_date,
                        status: ad.status,
                        impressions: ad.impressions,
                        clicks: ad.clicks,
                        ctr: ad.ctr,
                        cpc: ad.cpc,
                        creative_type: (ad.creative_type as 'image' | 'video' | 'carousel' | 'story') || 'image',
                        owner_name: ad.owner_username || 'Anunciante',
                        owner_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&q=80',
                        destination_url: '#',
                        is_sponsored: true
                      }}
                      onLike={(adId) => console.log('Like ad:', adId)}
                      onShare={(adId) => console.log('Share ad:', adId)}
                      onComment={(adId) => console.log('Comment ad:', adId)}
                      onView={(adId) => console.log('View ad:', adId)}
                    />
                    <div key={post.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '0.75rem', 
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Post Header */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'linear-gradient(135deg, #FF7A59, #E65E3F)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                      {post.authorName.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#1F2937' }}>{post.authorName}</h3>
                      <span style={{ color: '#9CA3AF' }}>•</span>
                        <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                          {new Date(post.createdAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                    </div>
                      {post.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#6B7280' }}>
                          📍 <span>{post.location}</span>
                        </div>
                      )}
                    </div>
                    {post.authorId === user?.uid && (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        style={{ color: '#9CA3AF', cursor: 'pointer', border: 'none', background: 'none' }}
                      >
                        🗑️
                      </button>
                    )}
                </div>
              </div>

              {/* Post Content */}
              <div style={{ padding: '1.5rem' }}>
                  <p style={{ color: '#1F2937', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{post.content}</p>
                
                {/* Tags */}
                  {post.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {post.tags.map((tag, index) => (
                    <span key={index} style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#E6F0FF',
                      color: '#0F6FF6',
                      fontSize: '0.875rem',
                      borderRadius: '9999px'
                    }}>
                          #{tag}
                    </span>
                  ))}
                </div>
                  )}

                {/* Pet Info */}
                  {post.petName && (
                <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      backgroundColor: '#E6FFFC',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                          <span style={{ color: '#00C2A8', fontWeight: 'bold' }}>
                            {post.petSpecies === 'dog' ? '🐕' : 
                             post.petSpecies === 'cat' ? '🐱' : 
                             post.petSpecies === 'bird' ? '🐦' : '🐾'}
                          </span>
                    </div>
                    <div>
                          <h4 style={{ fontWeight: 'bold', color: '#1F2937' }}>{post.petName}</h4>
                          <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            {post.petSpecies} • {post.visibility === 'public' ? 'Público' : 
                             post.visibility === 'friends' ? 'Solo Amigos' : 'Privado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Post Actions */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button 
                      onClick={() => handleLike(post.id)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          color: post.userLiked ? '#ef4444' : '#6B7280', 
                          cursor: 'pointer', 
                          border: 'none', 
                          background: 'none' 
                        }}
                      >
                        {post.userLiked ? '❤️' : '🤍'} <span>{post.likesCount}</span>
                    </button>
                    <button 
                      onClick={() => handleComentar(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                        💬 <span>{post.commentsCount}</span>
                    </button>
                    <button 
                      onClick={() => handleCompartir(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                        📤 <span>{post.sharesCount}</span>
                    </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
                      👁️ {post.viewsCount}
                    </div>
                  </div>
                </div>
              </div>
                    </React.Fragment>
                  );
              }
              
              // Renderizar solo el post
              return (
                <div key={post.id} style={{
                  backgroundColor: 'white', 
                  borderRadius: '0.75rem', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  {/* Post Header */}
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: 'linear-gradient(135deg, #FF7A59, #E65E3F)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {post.authorName.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontWeight: 'bold', color: '#1F2937' }}>{post.authorName}</h3>
                          <span style={{ color: '#9CA3AF' }}>•</span>
                          <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
                            {new Date(post.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {post.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#6B7280' }}>
                            📍 <span>{post.location}</span>
                          </div>
                        )}
                      </div>
                      {post.authorId === user?.uid && (
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          style={{ color: '#9CA3AF', cursor: 'pointer', border: 'none', background: 'none' }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div style={{ padding: '1.5rem' }}>
                    <p style={{ color: '#1F2937', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{post.content}</p>
                    
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {post.tags.map((tag, index) => (
                          <span key={index} style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#E6F0FF',
                            color: '#0F6FF6',
                            fontSize: '0.875rem',
                            borderRadius: '1rem',
                            fontWeight: '500'
                          }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Pet Info */}
                    {post.petName && (
                      <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            backgroundColor: '#E6FFFC',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span style={{ color: '#00C2A8', fontWeight: 'bold' }}>
                              {post.petSpecies === 'dog' ? '🐕' : 
                               post.petSpecies === 'cat' ? '🐱' : 
                               post.petSpecies === 'bird' ? '🐦' : '🐾'}
                            </span>
                          </div>
                          <div>
                            <h4 style={{ fontWeight: 'bold', color: '#1F2937' }}>{post.petName}</h4>
                            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                              {post.petSpecies} • {post.visibility === 'public' ? 'Público' : 
                               post.visibility === 'friends' ? 'Solo Amigos' : 'Privado'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <button 
                          onClick={() => handleLike(post.id)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            color: post.userLiked ? '#ef4444' : '#6B7280', 
                            cursor: 'pointer', 
                            border: 'none', 
                            background: 'none' 
                          }}
                        >
                          {post.userLiked ? '❤️' : '🤍'} <span>{post.likesCount}</span>
                        </button>
                        <button 
                          onClick={() => handleComentar(post.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', cursor: 'pointer', border: 'none', background: 'none' }}
                        >
                          💬 <span>{post.commentsCount}</span>
                        </button>
                        <button 
                          onClick={() => handleCompartir(post.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', cursor: 'pointer', border: 'none', background: 'none' }}
                        >
                          📤 <span>{post.sharesCount}</span>
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9CA3AF', fontSize: '0.875rem' }}>
                        👁️ {post.viewsCount}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: 'white', padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '1rem' }}>
              ¿Por qué usar ManadaBook?
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
              Conecta con una comunidad apasionada por las mascotas y descubre todo lo que necesitas para cuidar de tu compañero.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#E6F0FF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <span style={{ fontSize: '2rem' }}>❤️</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>Comunidad Apasionada</h3>
              <p style={{ color: '#6B7280' }}>
                Conecta con dueños que comparten tu amor por las mascotas y descubre consejos valiosos.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#FFF0ED',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <span style={{ fontSize: '2rem' }}>📷</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>Comparte Momentos</h3>
              <p style={{ color: '#6B7280' }}>
                Documenta los momentos especiales de tu mascota y compártelos con la comunidad.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: '#E6FFFC',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <span style={{ fontSize: '2rem' }}>💬</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1F2937', marginBottom: '0.5rem' }}>Consejos Expertos</h3>
              <p style={{ color: '#6B7280' }}>
                Accede a consejos de veterinarios y expertos en comportamiento animal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modales */}
      {mostrarAuth && (
        <ManadaBookAuth onClose={() => setMostrarAuth(false)} />
      )}
      
      {mostrarPetManager && (
        <PetProfileManager onClose={() => setMostrarPetManager(false)} />
      )}
      
      {mostrarCircles && (
        <CirclesManager onClose={() => setMostrarCircles(false)} />
      )}
      
      {mostrarComments && (
        <CommentsSection 
          postId={mostrarComments} 
          onClose={() => setMostrarComments(null)} 
        />
      )}
      
      {mostrarFollow && (
        <FollowManager onClose={() => setMostrarFollow(false)} />
      )}
      
      {mostrarMoments && (
        <MomentsManager onClose={() => setMostrarMoments(false)} />
      )}
      
      {mostrarSnippets && (
        <SnippetsManager onClose={() => setMostrarSnippets(false)} />
      )}
      
      {mostrarNotifications && (
        <NotificationsManager onClose={() => setMostrarNotifications(false)} />
      )}
      
      {mostrarMarketplace && (
        <MarketplaceManager onClose={() => setMostrarMarketplace(false)} />
      )}
      
      {mostrarModeration && (
        <ModerationManager onClose={() => setMostrarModeration(false)} />
      )}
      
      {mostrarAnalytics && (
        <AnalyticsManager onClose={() => setMostrarAnalytics(false)} />
      )}
      
      {mostrarMessaging && (
        <MessagingManager onClose={() => setMostrarMessaging(false)} />
      )}
    </div>
  );
}




