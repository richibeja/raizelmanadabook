'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  category: string;
  isPublic: boolean;
}

const GroupsPageContent = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Mock data since Firebase is not available
        const mockGroups = [
          {
            id: '1',
            name: 'Amantes de los Perros',
            description: 'Grupo para compartir experiencias con perros',
            memberCount: 150,
            imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
            category: 'perros',
            isPublic: true
          },
          {
            id: '2',
            name: 'Gatos de Bogotá',
            description: 'Comunidad de dueños de gatos en Bogotá',
            memberCount: 89,
            imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop',
            category: 'gatos',
            isPublic: true
          }
        ];
        setGroups(mockGroups);
      } catch (error) {
        console.error("Error fetching groups: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="groups-page-container">
      <Header />
      <div className="groups-content">
        <h1>Grupos de Mascotas</h1>
        
        <div className="groups-grid">
          {loading ? (
            <p className="groups-empty-message">Cargando grupos...</p>
          ) : groups.length === 0 ? (
            <p className="groups-empty-message">No hay grupos disponibles en este momento.</p>
          ) : (
            groups.map(group => (
              <div key={group.id} className="group-card">
                <div className="group-image" style={{ backgroundImage: `url(${group.imageUrl || 'https://via.placeholder.com/300x200.png?text=Grupo'})` }} />
                <div className="group-info">
                  <h3>{group.name}</h3>
                  <p className="group-description">{group.description}</p>
                  <div className="group-meta">
                    <p><strong>Miembros:</strong> {group.memberCount}</p>
                    <p><strong>Categoría:</strong> {group.category}</p>
                    <span className={`group-visibility ${group.isPublic ? 'public' : 'private'}`}>
                      {group.isPublic ? 'Público' : 'Privado'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function GroupsPage() {
    return <GroupsPageContent />;
}