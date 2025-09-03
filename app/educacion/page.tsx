'use client';
import { useState, useEffect } from 'react';
// import { collection, getDocs, query, orderBy } from 'firebase/firestore';
// import { db } from '../../firebaseConfig';
import Link from 'next/link';
import '../globals.css';

interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
}

export default function EducationPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Contenido educativo Raízel - BARF y alimentación natural
        const articulosEducativosRaizel = [
          {
            id: 'que-es-barf',
            title: '¿Qué es la alimentación BARF y por qué es mejor para tu mascota?',
            summary: 'Descubre los beneficios de la alimentación cruda biológicamente apropiada y cómo puede transformar la salud de tu perro.',
            imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop'
          },
          {
            id: 'transicion-gradual',
            title: 'Cómo hacer la transición gradual a alimentación natural',
            summary: 'Guía paso a paso para cambiar de pellets comerciales a BARF sin causar problemas digestivos.',
            imageUrl: 'https://images.unsplash.com/photo-1601758228041-3caa3d3d3c1c?w=400&h=300&fit=crop'
          },
          {
            id: 'beneficios-cientificos',  
            title: 'Beneficios científicos de los alimentos sin conservantes',
            summary: 'Investigaciones veterinarias que respaldan la alimentación natural vs alimentos procesados comerciales.',
            imageUrl: 'https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?w=400&h=300&fit=crop'
          },
          {
            id: 'calculadora-porciones',
            title: 'Cómo calcular las porciones perfectas para tu mascota', 
            summary: 'Aprende a usar nuestra calculadora y entiende la ciencia detrás del 2-3% del peso corporal en BARF.',
            imageUrl: 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=400&h=300&fit=crop'
          },
          {
            id: 'mitos-realidades',
            title: 'Mitos y realidades sobre la alimentación cruda para perros',
            summary: 'Desmontamos los mitos comunes sobre BARF y explicamos con ciencia por qué es seguro y beneficioso.',
            imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop'
          },
          {
            id: 'calidad-colombiana',
            title: 'Por qué elegir alimentos naturales hechos en Colombia',
            summary: 'La ventaja de los ingredientes frescos locales y cómo Raízel apoya la economía nacional.',
            imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
          }
        ];
        setArticles(articulosEducativosRaizel);
      } catch (error) {
        console.error("Error loading educational content: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="education-page-container">
      <h2>Artículos Educativos de Raízel</h2>
      <div className="articles-grid">
        {loading ? (
          <p className="articles-empty-message">Cargando artículos...</p>
        ) : articles.length === 0 ? (
          <p className="articles-empty-message">No hay artículos disponibles en este momento.</p>
        ) : (
          articles.map(article => (
            <Link key={article.id} href={`/educacion/${article.id}`} className="article-link">
              <div className="article-card">
                {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="article-image"/>}
                <div className="article-info">
                  <h3 className="article-title">{article.title}</h3>
                  <p>{article.summary}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}




