'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Snippet {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // en segundos
  petId?: string;
  petName?: string;
  petSpecies?: string;
  location?: string;
  tags: string[];
  category: 'funny' | 'cute' | 'training' | 'adventure' | 'health' | 'tips' | 'other';
  viewsCount: number;
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  userLiked?: boolean;
  userShared?: boolean;
  userViewed?: boolean;
}

export interface SnippetComment {
  id: string;
  snippetId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: number; // tiempo en el video donde se hizo el comentario
  likesCount: number;
  createdAt: Date;
  userLiked?: boolean;
}

export function useSnippets() {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [mySnippets, setMySnippets] = useState<Snippet[]>([]);
  const [trendingSnippets, setTrendingSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSnippets([]);
      setMySnippets([]);
      setTrendingSnippets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener todos los snippets activos
    const snippetsQuery = query(
      collection(db, 'snippets'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      snippetsQuery,
      async (snapshot) => {
        try {
          const snippetsData: Snippet[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const snippetData = docSnapshot.data();
            
            // Obtener información del autor
            const authorDoc = await doc(db, 'users', snippetData.authorId).get();
            let authorName = 'Usuario Anónimo';
            let authorAvatar = '';
            
            if (authorDoc.exists()) {
              const authorData = authorDoc.data();
              authorName = authorData.name || 'Usuario Anónimo';
              authorAvatar = authorData.avatarUrl || '';
            }

            // Verificar si el usuario actual vio este snippet
            const viewQuery = query(
              collection(db, 'snippet_views'),
              where('snippetId', '==', docSnapshot.id),
              where('userId', '==', user.uid)
            );
            const viewSnapshot = await getDocs(viewQuery);
            const userViewed = !viewSnapshot.empty;

            // Verificar si el usuario le dio like
            const likeQuery = query(
              collection(db, 'snippet_likes'),
              where('snippetId', '==', docSnapshot.id),
              where('userId', '==', user.uid)
            );
            const likeSnapshot = await getDocs(likeQuery);
            const userLiked = !likeSnapshot.empty;

            // Verificar si el usuario compartió
            const shareQuery = query(
              collection(db, 'snippet_shares'),
              where('snippetId', '==', docSnapshot.id),
              where('userId', '==', user.uid)
            );
            const shareSnapshot = await getDocs(shareQuery);
            const userShared = !shareSnapshot.empty;

            snippetsData.push({
              id: docSnapshot.id,
              authorId: snippetData.authorId,
              authorName,
              authorAvatar,
              title: snippetData.title || '',
              description: snippetData.description || '',
              videoUrl: snippetData.videoUrl || '',
              thumbnailUrl: snippetData.thumbnailUrl || '',
              duration: snippetData.duration || 0,
              petId: snippetData.petId || '',
              petName: snippetData.petName || '',
              petSpecies: snippetData.petSpecies || '',
              location: snippetData.location || '',
              tags: snippetData.tags || [],
              category: snippetData.category || 'other',
              viewsCount: snippetData.viewsCount || 0,
              likesCount: snippetData.likesCount || 0,
              sharesCount: snippetData.sharesCount || 0,
              commentsCount: snippetData.commentsCount || 0,
              createdAt: snippetData.createdAt?.toDate() || new Date(),
              updatedAt: snippetData.updatedAt?.toDate() || new Date(),
              isActive: snippetData.isActive || false,
              userLiked,
              userShared,
              userViewed,
            });
          }

          setSnippets(snippetsData);
          
          // Filtrar snippets del usuario
          const userSnippets = snippetsData.filter(snippet => 
            snippet.authorId === user.uid
          );
          setMySnippets(userSnippets);
          
          // Calcular trending (por views y likes en las últimas 24h)
          const now = new Date();
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          const trending = snippetsData
            .filter(snippet => snippet.createdAt >= yesterday)
            .sort((a, b) => (b.viewsCount + b.likesCount) - (a.viewsCount + a.likesCount))
            .slice(0, 20);
          setTrendingSnippets(trending);
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching snippets:', err);
          setError('Error al cargar los snippets');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in snippets listener:', err);
        setError('Error al cargar los snippets');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createSnippet = async (snippetData: {
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    petId?: string;
    petName?: string;
    petSpecies?: string;
    location?: string;
    tags: string[];
    category: Snippet['category'];
  }) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (!snippetData.title.trim()) throw new Error('El título es requerido');
    if (!snippetData.videoUrl.trim()) throw new Error('El video es requerido');

    try {
      const newSnippet = {
        authorId: user.uid,
        title: snippetData.title.trim(),
        description: snippetData.description.trim(),
        videoUrl: snippetData.videoUrl,
        thumbnailUrl: snippetData.thumbnailUrl,
        duration: snippetData.duration,
        petId: snippetData.petId || '',
        petName: snippetData.petName || '',
        petSpecies: snippetData.petSpecies || '',
        location: snippetData.location || '',
        tags: snippetData.tags,
        category: snippetData.category,
        viewsCount: 0,
        likesCount: 0,
        sharesCount: 0,
        commentsCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isActive: true,
      };

      const docRef = await addDoc(collection(db, 'snippets'), newSnippet);
      return docRef.id;
    } catch (error) {
      console.error('Error creating snippet:', error);
      throw error;
    }
  };

  const viewSnippet = async (snippetId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Verificar si ya vio este snippet
      const existingViewQuery = query(
        collection(db, 'snippet_views'),
        where('snippetId', '==', snippetId),
        where('userId', '==', user.uid)
      );
      const existingViewSnapshot = await getDocs(existingViewQuery);

      if (existingViewSnapshot.empty) {
        // Agregar vista
        await addDoc(collection(db, 'snippet_views'), {
          snippetId,
          userId: user.uid,
          viewedAt: Timestamp.now(),
        });

        // Incrementar contador de vistas
        const snippetRef = doc(db, 'snippets', snippetId);
        const snippet = snippets.find(s => s.id === snippetId);
        await updateDoc(snippetRef, {
          viewsCount: (snippet?.viewsCount || 0) + 1,
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error viewing snippet:', error);
      throw error;
    }
  };

  const likeSnippet = async (snippetId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Verificar si ya le dio like
      const existingLikeQuery = query(
        collection(db, 'snippet_likes'),
        where('snippetId', '==', snippetId),
        where('userId', '==', user.uid)
      );
      const existingLikeSnapshot = await getDocs(existingLikeQuery);

      if (existingLikeSnapshot.empty) {
        // Agregar like
        await addDoc(collection(db, 'snippet_likes'), {
          snippetId,
          userId: user.uid,
          createdAt: Timestamp.now(),
        });

        // Incrementar contador de likes
        const snippetRef = doc(db, 'snippets', snippetId);
        const snippet = snippets.find(s => s.id === snippetId);
        await updateDoc(snippetRef, {
          likesCount: (snippet?.likesCount || 0) + 1,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Quitar like
        const likeDoc = existingLikeSnapshot.docs[0];
        await deleteDoc(doc(db, 'snippet_likes', likeDoc.id));

        // Decrementar contador de likes
        const snippetRef = doc(db, 'snippets', snippetId);
        const snippet = snippets.find(s => s.id === snippetId);
        await updateDoc(snippetRef, {
          likesCount: Math.max(0, (snippet?.likesCount || 1) - 1),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error toggling snippet like:', error);
      throw error;
    }
  };

  const shareSnippet = async (snippetId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Agregar share
      await addDoc(collection(db, 'snippet_shares'), {
        snippetId,
        userId: user.uid,
        sharedAt: Timestamp.now(),
      });

      // Incrementar contador de shares
      const snippetRef = doc(db, 'snippets', snippetId);
      const snippet = snippets.find(s => s.id === snippetId);
      await updateDoc(snippetRef, {
        sharesCount: (snippet?.sharesCount || 0) + 1,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error sharing snippet:', error);
      throw error;
    }
  };

  const deleteSnippet = async (snippetId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const snippet = snippets.find(s => s.id === snippetId);
      if (!snippet) throw new Error('Snippet no encontrado');
      if (snippet.authorId !== user.uid) throw new Error('No tienes permisos para eliminar este snippet');

      await deleteDoc(doc(db, 'snippets', snippetId));
    } catch (error) {
      console.error('Error deleting snippet:', error);
      throw error;
    }
  };

  const getSnippetsByCategory = (category: Snippet['category']) => {
    return snippets.filter(snippet => snippet.category === category);
  };

  const getSnippetsByPet = (petId: string) => {
    return snippets.filter(snippet => snippet.petId === petId);
  };

  const searchSnippets = async (searchTerm: string, category?: string) => {
    try {
      let snippetsQuery = query(
        collection(db, 'snippets'),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(snippetsQuery);
      let results: Snippet[] = [];

      snapshot.forEach((doc) => {
        const snippetData = doc.data();
        const snippet: Snippet = {
          id: doc.id,
          authorId: snippetData.authorId,
          authorName: snippetData.authorName || 'Usuario Anónimo',
          authorAvatar: snippetData.authorAvatar || '',
          title: snippetData.title || '',
          description: snippetData.description || '',
          videoUrl: snippetData.videoUrl || '',
          thumbnailUrl: snippetData.thumbnailUrl || '',
          duration: snippetData.duration || 0,
          petId: snippetData.petId || '',
          petName: snippetData.petName || '',
          petSpecies: snippetData.petSpecies || '',
          location: snippetData.location || '',
          tags: snippetData.tags || [],
          category: snippetData.category || 'other',
          viewsCount: snippetData.viewsCount || 0,
          likesCount: snippetData.likesCount || 0,
          sharesCount: snippetData.sharesCount || 0,
          commentsCount: snippetData.commentsCount || 0,
          createdAt: snippetData.createdAt?.toDate() || new Date(),
          updatedAt: snippetData.updatedAt?.toDate() || new Date(),
          isActive: snippetData.isActive || false,
        };

        // Filtros de búsqueda
        const matchesSearch = searchTerm === '' || 
          snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !category || snippet.category === category;

        if (matchesSearch && matchesCategory) {
          results.push(snippet);
        }
      });

      return results.sort((a, b) => b.viewsCount - a.viewsCount);
    } catch (error) {
      console.error('Error searching snippets:', error);
      throw error;
    }
  };

  return {
    snippets,
    mySnippets,
    trendingSnippets,
    loading,
    error,
    createSnippet,
    viewSnippet,
    likeSnippet,
    shareSnippet,
    deleteSnippet,
    getSnippetsByCategory,
    getSnippetsByPet,
    searchSnippets,
  };
}
