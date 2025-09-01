'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, DocumentData, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/AuthContext';
import Post from './Post';
import './Feed.css';

const POSTS_PER_PAGE = 4; // 4 posts normales + 1 patrocinado = 5

interface PostType {
    id: string;
    type: 'post' | 'sponsored';
    [key: string]: any;
}

/**
 * Componente principal del Feed.
 * Se encarga de obtener y mostrar las publicaciones del feed del usuario,
 * e intercala contenido patrocinado de forma estratégica.
 */
export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  /**
   * Obtiene un lote de publicaciones del feed del usuario y un post patrocinado,
   * y los mezcla en el estado local.
   */
  const fetchPosts = useCallback(async (isInitial = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Obtener publicaciones normales del feed del usuario
      const feedCollectionRef = collection(db, 'users', user.uid, 'feed');
      let postsQuery;
      if (isInitial) {
        postsQuery = query(feedCollectionRef, orderBy('createdAt', 'desc'), limit(POSTS_PER_PAGE));
      } else if (lastVisible) {
        postsQuery = query(feedCollectionRef, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(POSTS_PER_PAGE));
      } else {
        setHasMore(false);
        setLoading(false);
        return;
      }
      const postSnapshots = await getDocs(postsQuery);
      const normalPosts = postSnapshots.docs.map(doc => ({ id: doc.id, type: 'post', ...doc.data() })) as PostType[];
      
      // Actualizar el cursor para la siguiente página
      const lastDoc = postSnapshots.docs[postSnapshots.docs.length - 1];
      setLastVisible(lastDoc ?? null);
      setHasMore(postSnapshots.docs.length === POSTS_PER_PAGE);

      // 2. Obtener una publicación patrocinada activa
      const sponsoredQuery = query(
        collection(db, 'sponsoredContent'),
        where('active', '==', true),
        where('startDate', '<=', Timestamp.now()),
        // Podríamos añadir un `orderBy` aleatorio o por prioridad aquí
        limit(1)
      );
      const sponsoredSnapshot = await getDocs(sponsoredQuery);
      const sponsoredPost = sponsoredSnapshot.docs.map(doc => ({ id: doc.id, type: 'sponsored', ...doc.data() }))[0];

      // 3. Mezclar el contenido
      let newContent = [...normalPosts];
      if (sponsoredPost && newContent.length > 0) {
        // Insertar el post patrocinado en la última posición del lote
        newContent.push(sponsoredPost);
      }

      setPosts(prev => isInitial ? newContent : [...prev, ...newContent]);

    } catch (err) {
      console.error("Error al obtener el feed:", err);
      setError("No se pudieron cargar las publicaciones.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [user, lastVisible]);

  // Carga inicial
  useEffect(() => {
    if (user) {
      setPosts([]);
      setLastVisible(null);
      setHasMore(true);
      fetchPosts(true);
    }
  }, [user]);

  // Observer para el scroll infinito
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchPosts]
  );

  if (loading && posts.length === 0) return <p className="feed-message">Cargando el universo de tu mascota...</p>;
  if (error) return <p className="feed-message error">{error}</p>;
  if (!user) return <p className="feed-message">Inicia sesión para unirte a la manada.</p>;
  if (!loading && posts.length === 0) return <p className="feed-message">¡Bienvenido! Sigue a otras mascotas para ver sus aventuras aquí.</p>;

  return (
    <div className="feed-container">
      {posts.map((post, index) => (
        <div ref={posts.length === index + 1 ? lastPostElementRef : null} key={`${post.id}-${index}`}>
          <Post postData={post} />
        </div>
      ))}
      {loading && <p className="feed-message">Buscando más aventuras...</p>}
      {!hasMore && <p className="feed-message">Has llegado al final del universo conocido.</p>}
    </div>
  );
}