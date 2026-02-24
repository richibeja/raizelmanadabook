'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

const ConsejosPageContent = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchTips = async () => {
      try {
        // Mock data since Firebase is not available
        const mockTips = [
          {
            id: '1',
            title: 'Alimentación Saludable para Perros',
            content: 'Los perros necesitan una dieta balanceada rica en proteínas y nutrientes esenciales...',
            category: 'alimentacion',
            imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop',
            createdAt: '2024-01-15'
          },
          {
            id: '2',
            title: 'Cuidado Dental en Gatos',
            content: 'La higiene dental es fundamental para la salud de tu gato...',
            category: 'salud',
            imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop',
            createdAt: '2024-01-10'
          },
          {
            id: '3',
            title: 'Ejercicio para Mascotas',
            content: 'El ejercicio regular es importante para mantener a tu mascota saludable...',
            category: 'ejercicio',
            imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
            createdAt: '2024-01-05'
          }
        ];
        setTips(mockTips);
      } catch (error) {
        console.error("Error fetching tips: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'alimentacion', label: 'Alimentación' },
    { value: 'salud', label: 'Salud' },
    { value: 'ejercicio', label: 'Ejercicio' },
    { value: 'comportamiento', label: 'Comportamiento' }
  ];

  return (
    <div className="consejos-page-container">
      <Header />
      <div className="consejos-content">
        <h1>Consejos para Mascotas</h1>
        
        <div className="consejos-filters">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`filter-button ${selectedCategory === category.value ? 'active' : ''}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className="consejos-grid">
          {loading ? (
            <p className="consejos-empty-message">Cargando consejos...</p>
          ) : filteredTips.length === 0 ? (
            <p className="consejos-empty-message">No hay consejos disponibles en esta categoría.</p>
          ) : (
            filteredTips.map(tip => (
              <div key={tip.id} className="tip-card">
                <div className="tip-image" style={{ backgroundImage: `url(${tip.imageUrl || 'https://via.placeholder.com/300x200.png?text=Consejo'})` }} />
                <div className="tip-info">
                  <h3>{tip.title}</h3>
                  <p className="tip-content">{tip.content}</p>
                  <div className="tip-meta">
                    <span className="tip-category">{tip.category}</span>
                    <span className="tip-date">{new Date(tip.createdAt).toLocaleDateString()}</span>
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

export default function ConsejosPage() {
    return <ConsejosPageContent />;
}