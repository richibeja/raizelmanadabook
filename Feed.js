'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming db is your Firestore instance
import { useAuth } from '@/context/AuthContext';
import Post from './Post.tsx';
import './Feed.css'; // Importar el archivo CSS

const POSTS_PER_PAGE = 10;

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  // 1. Función para obtener los posts del feed personal del usuario
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Fetch sponsored posts to inject them
      const sponsoredQuery = query(collection(db, 'sponsoredPosts'), where('active', '==', true), limit(5));
      const sponsoredSnapshot = await getDocs(sponsoredQuery);
      const sponsoredPosts = sponsoredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'sponsored' }));

      if (!user) {
        setPosts(sponsoredPosts);
        setHasMore(false);
        setLoading(false);
        return;
      }

      // Fetch user's personal feed
      // This query reads the 'feed' subcollection of the user, which is populated
      // by a Cloud Function in the backend. This avoids the 'in' query limitation.
      const feedCollectionRef = collection(db, 'users', user.uid, 'feed');

      const postsQuery = query(
        feedCollectionRef,
        orderBy('createdAt', 'desc'),
        ...(lastVisible ? [startAfter(lastVisible)] : []),
        limit(POSTS_PER_PAGE)
      );

      const documentSnapshots = await getDocs(postsQuery);
      
      // Here, each document in the feed could be a reference to the original post.
      // For simplicity, we assume that the post data is duplicated in the feed.
      const newPosts = documentSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'post' }));
      const lastDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];

      let combinedPosts = [...newPosts];
      if (sponsoredPosts.length > 0 && combinedPosts.length > 2) {
        const randomSponsoredPost = sponsoredPosts[Math.floor(Math.random() * sponsoredPosts.length)];
        combinedPosts.splice(2, 0, randomSponsoredPost);
      }
      setPosts(prevPosts => lastVisible ? [...prevPosts, ...combinedPosts] : combinedPosts);
      setLastVisible(lastDoc);

      if (documentSnapshots.docs.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }

    } catch (error) {
      console.error("Error fetching feed posts: ", error);
    } finally {
      setLoading(false);
    }
  }, [user, loading, hasMore, lastVisible]);

  // 2. Carga inicial de posts cuando el usuario está disponible
  useEffect(() => {
    // Reset state for new load
    setPosts([]);
    setLastVisible(null);
    setHasMore(true);
    fetchPosts();
  }, [user, fetchPosts]); // Runs when the user changes

  // 3. Lógica del Intersection Observer para el infinite scroll
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, fetchPosts]);

  if (loading && posts.length === 0) {
      return <p className="feed-message">Cargando el feed de la manada...</p>
  }

  if (!loading && posts.length === 0 && user) {
      return <p className="feed-message">¡Bienvenido a ManadaBook! Busca amigos o publica algo para empezar.</p>
  }

  return (
    <div className="feed-container">
      {posts.map((post, index) => {
        if (posts.length === index + 1 && hasMore) {
          return <div ref={lastPostElementRef} key={`${post.id}-${index}`}><Post postData={post} /></div>;
        }
        return <div key={`${post.id}-${index}`}><Post postData={post} /></div>;
      })}

      {loading && <p className="feed-message">Cargando más publicaciones...</p>}
      {!hasMore && posts.length > 0 && <p className="feed-message">Has llegado al final de tu feed.</p>}
    </div>
  );
}
