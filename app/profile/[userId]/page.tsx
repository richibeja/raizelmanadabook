'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../globals.css';

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  location?: string;
  joinDate: string;
  petsCount: number;
  postsCount: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Mock data since Firebase is not available
        const mockUser = {
          id: params.userId as string,
          name: 'Usuario Ejemplo',
          email: 'usuario@ejemplo.com',
          bio: 'Amante de las mascotas y la naturaleza',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
          location: 'Bogotá, Colombia',
          joinDate: '2024-01-01',
          petsCount: 2,
          postsCount: 15
        };
        setUser(mockUser);
      } catch (error) {
        console.error("Error fetching user: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.userId) {
      fetchUser();
    }
  }, [params.userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usuario no encontrado</h2>
          <p className="text-gray-600">El usuario que buscas no existe.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <Header />
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={user.avatar || 'https://via.placeholder.com/150x150.png?text=Usuario'} alt={user.name} />
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            {user.location && <p className="profile-location">{user.location}</p>}
            <p className="profile-join-date">Miembro desde {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{user.petsCount}</span>
            <span className="stat-label">Mascotas</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{user.postsCount}</span>
            <span className="stat-label">Publicaciones</span>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h2>Mascotas</h2>
            <div className="pets-grid">
              {/* Mock pets */}
              <div className="pet-card">
                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop" alt="Mascota" />
                <h3>Luna</h3>
                <p>Labrador, 2 años</p>
              </div>
              <div className="pet-card">
                <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop" alt="Mascota" />
                <h3>Max</h3>
                <p>Golden Retriever, 1 año</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Publicaciones Recientes</h2>
            <div className="posts-grid">
              {/* Mock posts */}
              <div className="post-card">
                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop" alt="Post" />
                <h3>Paseo en el parque</h3>
                <p>Luna disfrutando del sol de la mañana</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}