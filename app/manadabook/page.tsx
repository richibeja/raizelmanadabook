'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';
import ManadaBookAuth from '@/components/ManadaBookAuth';

// Datos de ejemplo para posts
const postsEjemplo = [
  {
    id: 1,
    usuario: {
      nombre: 'María García',
      ubicacion: 'Madrid, España'
    },
    mascota: {
      nombre: 'Luna',
      tipo: 'Golden Retriever',
      edad: '2 años'
    },
    contenido: '¡Luna tuvo su primera clase de obediencia hoy! Estoy muy orgullosa de lo bien que se portó. 🐕✨',
    likes: 24,
    comentarios: 8,
    tiempo: 'hace 2 horas',
    tags: ['#Adiestramiento', '#GoldenRetriever', '#Orgullosa']
  },
  {
    id: 2,
    usuario: {
      nombre: 'Carlos Rodríguez',
      ubicacion: 'Barcelona, España'
    },
    mascota: {
      nombre: 'Milo',
      tipo: 'Gato Persa',
      edad: '3 años'
    },
    contenido: 'Milo descubrió su nuevo rascador y no puede parar de usarlo. ¡Al fin encontré algo que le gusta! 😸',
    likes: 18,
    comentarios: 5,
    tiempo: 'hace 4 horas',
    tags: ['#GatoPersa', '#Rascador', '#Feliz']
  },
  {
    id: 3,
    usuario: {
      nombre: 'Ana López',
      ubicacion: 'Valencia, España'
    },
    mascota: {
      nombre: 'Rocky',
      tipo: 'Border Collie',
      edad: '1 año'
    },
    contenido: 'Paseo matutino en el parque. Rocky siempre encuentra nuevos amigos. ¡Es tan sociable! 🐾',
    likes: 31,
    comentarios: 12,
    tiempo: 'hace 6 horas',
    tags: ['#BorderCollie', '#Paseo', '#Amigos']
  }
];

export default function ManadaBookPage() {
  const { user, userProfile, loading, logout } = useManadaBookAuth();
  const [posts, setPosts] = useState(postsEjemplo);
  const [nuevoPost, setNuevoPost] = useState('');
  const [mostrarComposer, setMostrarComposer] = useState(false);
  const [mostrarAuth, setMostrarAuth] = useState(false);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleComentar = (postId: number) => {
    console.log('Comentar en post:', postId);
  };

  const handleCompartir = (postId: number) => {
    if (navigator.share) {
      navigator.share({
        title: 'Post de ManadaBook',
        text: 'Mira este post interesante en ManadaBook',
        url: `/manadabook/post/${postId}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/manadabook/post/${postId}`);
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
              <button style={{
                border: '2px solid white',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: 'transparent'
              }}>
                Explorar Comunidad
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
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '0.75rem', 
            padding: '1.5rem', 
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(135deg, #0F6FF6, #0C5CD9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                👤
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={nuevoPost}
                  onChange={(e) => setNuevoPost(e.target.value)}
                  placeholder="¿Qué está haciendo tu mascota hoy? Comparte un momento especial..."
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    resize: 'none',
                    minHeight: '100px'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.5rem', color: '#6B7280', cursor: 'pointer' }}>📷</button>
                    <button style={{ padding: '0.5rem', color: '#6B7280', cursor: 'pointer' }}>😊</button>
                    <button style={{ padding: '0.5rem', color: '#6B7280', cursor: 'pointer' }}>📍</button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setMostrarComposer(false)}
                      style={{ padding: '0.5rem 1rem', color: '#6B7280', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={() => {
                        if (nuevoPost.trim()) {
                          setNuevoPost('');
                          setMostrarComposer(false);
                        }
                      }}
                      style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: '#0F6FF6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {posts.map((post) => (
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
                    {post.usuario.nombre.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontWeight: 'bold', color: '#1F2937' }}>{post.usuario.nombre}</h3>
                      <span style={{ color: '#9CA3AF' }}>•</span>
                      <span style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>{post.tiempo}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#6B7280' }}>
                      📍 <span>{typeof post.usuario.ubicacion === 'string' ? post.usuario.ubicacion : JSON.stringify(post.usuario.ubicacion)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div style={{ padding: '1.5rem' }}>
                <p style={{ color: '#1F2937', marginBottom: '1rem' }}>{post.contenido}</p>
                
                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {post.tags.map((tag, index) => (
                    <span key={index} style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#E6F0FF',
                      color: '#0F6FF6',
                      fontSize: '0.875rem',
                      borderRadius: '9999px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Post Image */}
                <div style={{
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  backgroundColor: '#F3F4F6',
                  height: '16rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ textAlign: 'center', color: '#6B7280' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🐾</div>
                    <p>Imagen de {post.mascota.nombre}</p>
                  </div>
                </div>

                {/* Pet Info */}
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
                      <span style={{ color: '#00C2A8', fontWeight: 'bold' }}>🐕</span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 'bold', color: '#1F2937' }}>{post.mascota.nombre}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{post.mascota.tipo} • {post.mascota.edad}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button 
                      onClick={() => handleLike(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                      ❤️ <span>{typeof post.likes === 'number' ? post.likes : JSON.stringify(post.likes)}</span>
                    </button>
                    <button 
                      onClick={() => handleComentar(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                      💬 <span>{typeof post.comentarios === 'number' ? post.comentarios : JSON.stringify(post.comentarios)}</span>
                    </button>
                    <button 
                      onClick={() => handleCompartir(post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                      📤 <span>Compartir</span>
                    </button>
                  </div>
                  <button style={{ color: '#9CA3AF', cursor: 'pointer', border: 'none', background: 'none' }}>
                    •••
                  </button>
                </div>
              </div>
            </div>
          ))}
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

      {/* Modal de Autenticación */}
      {mostrarAuth && (
        <ManadaBookAuth onClose={() => setMostrarAuth(false)} />
      )}
    </div>
  );
}




