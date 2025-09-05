'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  where,
  limit,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  petId?: string;
  petName?: string;
  petSpecies?: string;
  content: string;
  mediaUrls: string[];
  postType: 'post' | 'moment' | 'snippet' | 'marketplace';
  visibility: 'public' | 'friends' | 'private';
  location?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isPromoted: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  mediaUrls: string[];
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
  userLiked?: boolean;
}

export interface Reaction {
  id: string;
  userId: string;
  postId: string;
  reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  createdAt: Date;
}

export function usePosts() {
  const { user, userProfile } = useManadaBookAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener posts públicos y de amigos
    const postsQuery = query(
      collection(db, 'posts'),
      where('visibility', 'in', ['public', 'friends']),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      postsQuery,
      async (snapshot) => {
        try {
          const postsData: Post[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const postData = docSnapshot.data();
            
            // Obtener información del autor
            const authorDoc = await getDocs(query(
              collection(db, 'users'),
              where('__name__', '==', postData.authorId)
            ));
            
            let authorName = 'Usuario Anónimo';
            let authorAvatar = '';
            
            if (!authorDoc.empty) {
              const authorData = authorDoc.docs[0].data();
              authorName = authorData.name || 'Usuario Anónimo';
              authorAvatar = authorData.avatarUrl || '';
            }

            // Obtener información de la mascota si existe
            let petName = '';
            let petSpecies = '';
            if (postData.petId && userProfile?.pets) {
              const pet = userProfile.pets.find(p => p.id === postData.petId);
              if (pet) {
                petName = pet.name;
                petSpecies = pet.species;
              }
            }

            // Verificar si el usuario actual le dio like
            const likesQuery = query(
              collection(db, 'reactions'),
              where('postId', '==', docSnapshot.id),
              where('userId', '==', user.uid),
              where('reactionType', '==', 'like')
            );
            const likesSnapshot = await getDocs(likesQuery);
            const userLiked = !likesSnapshot.empty;

            postsData.push({
              id: docSnapshot.id,
              authorId: postData.authorId,
              authorName,
              authorAvatar,
              petId: postData.petId,
              petName,
              petSpecies,
              content: postData.content || '',
              mediaUrls: postData.mediaUrls || [],
              postType: postData.postType || 'post',
              visibility: postData.visibility || 'public',
              location: postData.location,
              tags: postData.tags || [],
              likesCount: postData.likesCount || 0,
              commentsCount: postData.commentsCount || 0,
              sharesCount: postData.sharesCount || 0,
              viewsCount: postData.viewsCount || 0,
              isPromoted: postData.isPromoted || false,
              expiresAt: postData.expiresAt?.toDate(),
              createdAt: postData.createdAt?.toDate() || new Date(),
              updatedAt: postData.updatedAt?.toDate() || new Date(),
              userLiked,
            });
          }

          setPosts(postsData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching posts:', err);
          setError('Error al cargar los posts');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in posts listener:', err);
        setError('Error al cargar los posts');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, userProfile]);

  const createPost = async (postData: {
    content: string;
    mediaUrls?: string[];
    petId?: string;
    visibility?: 'public' | 'friends' | 'private';
    location?: string;
    tags?: string[];
  }) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const newPost = {
        authorId: user.uid,
        petId: postData.petId || null,
        content: postData.content,
        mediaUrls: postData.mediaUrls || [],
        postType: 'post',
        visibility: postData.visibility || 'public',
        location: postData.location || null,
        tags: postData.tags || [],
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        viewsCount: 0,
        isPromoted: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'posts'), newPost);
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Verificar si ya le dio like
      const existingLikeQuery = query(
        collection(db, 'reactions'),
        where('postId', '==', postId),
        where('userId', '==', user.uid),
        where('reactionType', '==', 'like')
      );
      const existingLikeSnapshot = await getDocs(existingLikeQuery);

      if (existingLikeSnapshot.empty) {
        // Agregar like
        await addDoc(collection(db, 'reactions'), {
          userId: user.uid,
          postId,
          reactionType: 'like',
          createdAt: Timestamp.now(),
        });

        // Incrementar contador de likes
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          likesCount: posts.find(p => p.id === postId)?.likesCount + 1 || 1,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Quitar like
        const likeDoc = existingLikeSnapshot.docs[0];
        await deleteDoc(doc(db, 'reactions', likeDoc.id));

        // Decrementar contador de likes
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          likesCount: Math.max(0, (posts.find(p => p.id === postId)?.likesCount || 1) - 1),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  const sharePost = async (postId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Incrementar contador de shares
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        sharesCount: posts.find(p => p.id === postId)?.sharesCount + 1 || 1,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const post = posts.find(p => p.id === postId);
      if (!post || post.authorId !== user.uid) {
        throw new Error('No tienes permisos para eliminar este post');
      }

      await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    likePost,
    sharePost,
    deletePost,
  };
}
