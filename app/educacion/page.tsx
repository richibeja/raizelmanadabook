'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
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
        const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const articlesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          summary: doc.data().summary,
          imageUrl: doc.data().imageUrl,
        }));
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching articles: ", error);
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




