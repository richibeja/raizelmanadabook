'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface ShortVideo {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  petName: string;
  petUsername: string;
  petType: string;
  petAge: string;
  petAvatar?: string;
  videoUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  isLiked: boolean;
  isFollowing: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoLike {
  id: string;
  videoId: string;
  userId: string;
  createdAt: Date;
}

export interface VideoComment {
  id: string;
  videoId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  replies: number;
  createdAt: Date;
  isLiked: boolean;
}

export interface VideoFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export function useManadaShorts() {
  const { user, userProfile } = useManadaBookAuth();
  const [videos, setVideos] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar videos en tiempo real
  useEffect(() => {
    if (!user) {
      setVideos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const videosQuery = query(
      collection(db, 'manadashorts_videos'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(videosQuery, async (snapshot) => {
      try {
        const videosData: ShortVideo[] = [];

        for (const docSnapshot of snapshot.docs) {
          const videoData = docSnapshot.data();
          
          // Verificar si el usuario le dio like
          const likeQuery = query(
            collection(db, 'manadashorts_likes'),
            where('videoId', '==', docSnapshot.id),
            where('userId', '==', user.uid)
          );
          const likeSnapshot = await getDocs(likeQuery);
          const isLiked = !likeSnapshot.empty;

          // Verificar si el usuario está siguiendo al autor
          const followQuery = query(
            collection(db, 'manadashorts_follows'),
            where('followerId', '==', user.uid),
            where('followingId', '==', videoData.authorId)
          );
          const followSnapshot = await getDocs(followQuery);
          const isFollowing = !followSnapshot.empty;

          videosData.push({
            id: docSnapshot.id,
            authorId: videoData.authorId,
            authorName: videoData.authorName,
            authorAvatar: videoData.authorAvatar,
            petName: videoData.petName,
            petUsername: videoData.petUsername,
            petType: videoData.petType,
            petAge: videoData.petAge,
            petAvatar: videoData.petAvatar,
            videoUrl: videoData.videoUrl,
            caption: videoData.caption,
            hashtags: videoData.hashtags || [],
            likes: videoData.likes || 0,
            comments: videoData.comments || 0,
            shares: videoData.shares || 0,
            views: videoData.views || 0,
            isLiked,
            isFollowing,
            createdAt: videoData.createdAt?.toDate() || new Date(),
            updatedAt: videoData.updatedAt?.toDate() || new Date(),
          });
        }

        setVideos(videosData);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading videos:', err);
        setError(err.message || 'Error al cargar videos');
        setLoading(false);
      }
    }, (err) => {
      console.error('Error in videos subscription:', err);
      setError('Error en la suscripción de videos');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Dar like a un video
  const likeVideo = async (videoId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Verificar si ya le dio like
      const likeQuery = query(
        collection(db, 'manadashorts_likes'),
        where('videoId', '==', videoId),
        where('userId', '==', user.uid)
      );
      const likeSnapshot = await getDocs(likeQuery);

      if (likeSnapshot.empty) {
        // Agregar like
        await addDoc(collection(db, 'manadashorts_likes'), {
          videoId,
          userId: user.uid,
          createdAt: Timestamp.now()
        });

        // Actualizar contador de likes en el video
        const videoRef = doc(db, 'manadashorts_videos', videoId);
        const videoDoc = await getDocs(query(collection(db, 'manadashorts_videos'), where('__name__', '==', videoId)));
        if (!videoDoc.empty) {
          const currentLikes = videoDoc.docs[0].data().likes || 0;
          await updateDoc(videoRef, {
            likes: currentLikes + 1,
            updatedAt: Timestamp.now()
          });
        }
      } else {
        // Quitar like
        await deleteDoc(likeSnapshot.docs[0].ref);

        // Actualizar contador de likes en el video
        const videoRef = doc(db, 'manadashorts_videos', videoId);
        const videoDoc = await getDocs(query(collection(db, 'manadashorts_videos'), where('__name__', '==', videoId)));
        if (!videoDoc.empty) {
          const currentLikes = videoDoc.docs[0].data().likes || 0;
          await updateDoc(videoRef, {
            likes: Math.max(0, currentLikes - 1),
            updatedAt: Timestamp.now()
          });
        }
      }
    } catch (err: any) {
      console.error('Error liking video:', err);
      throw new Error('Error al dar like al video');
    }
  };

  // Seguir a un usuario
  const followUser = async (userId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Verificar si ya lo está siguiendo
      const followQuery = query(
        collection(db, 'manadashorts_follows'),
        where('followerId', '==', user.uid),
        where('followingId', '==', userId)
      );
      const followSnapshot = await getDocs(followQuery);

      if (followSnapshot.empty) {
        // Seguir usuario
        await addDoc(collection(db, 'manadashorts_follows'), {
          followerId: user.uid,
          followingId: userId,
          createdAt: Timestamp.now()
        });
      } else {
        // Dejar de seguir
        await deleteDoc(followSnapshot.docs[0].ref);
      }
    } catch (err: any) {
      console.error('Error following user:', err);
      throw new Error('Error al seguir usuario');
    }
  };

  // Compartir video
  const shareVideo = async (videoId: string) => {
    try {
      // Actualizar contador de shares
      const videoRef = doc(db, 'manadashorts_videos', videoId);
      const videoDoc = await getDocs(query(collection(db, 'manadashorts_videos'), where('__name__', '==', videoId)));
      if (!videoDoc.empty) {
        const currentShares = videoDoc.docs[0].data().shares || 0;
        await updateDoc(videoRef, {
          shares: currentShares + 1,
          updatedAt: Timestamp.now()
        });
      }

      // Intentar usar Web Share API
      if (navigator.share) {
        const video = videos.find(v => v.id === videoId);
        if (video) {
          await navigator.share({
            title: `Video de ${video.petName} en ManadaShorts`,
            text: video.caption,
            url: window.location.href
          });
        }
      } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(window.location.href);
        alert('¡Enlace copiado al portapapeles!');
      }
    } catch (err: any) {
      console.error('Error sharing video:', err);
      throw new Error('Error al compartir video');
    }
  };

  // Subir nuevo video
  const uploadVideo = async (videoData: {
    file: File;
    caption: string;
    hashtags: string[];
  }) => {
    if (!user || !userProfile) throw new Error('Usuario no autenticado');

    try {
      // Crear URL temporal para el video
      const videoUrl = URL.createObjectURL(videoData.file);
      
      // Crear documento del video en Firebase
      const videoDoc = await addDoc(collection(db, 'manadashorts_videos'), {
        authorId: user.uid,
        authorName: userProfile.name,
        authorAvatar: userProfile.avatar,
        petName: userProfile.name || 'Mi Mascota',
        petUsername: `@${userProfile.name?.toLowerCase().replace(' ', '_') || 'mi_mascota'}`,
        petType: 'Mascota',
        petAge: 'Edad',
        petAvatar: userProfile.avatar,
        videoUrl,
        caption: videoData.caption,
        hashtags: videoData.hashtags,
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return videoDoc.id;
    } catch (err: any) {
      console.error('Error uploading video:', err);
      throw new Error('Error al subir video');
    }
  };

  // Obtener comentarios de un video
  const getVideoComments = async (videoId: string): Promise<VideoComment[]> => {
    try {
      const commentsQuery = query(
        collection(db, 'manadashorts_comments'),
        where('videoId', '==', videoId),
        orderBy('createdAt', 'desc')
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      
      const comments: VideoComment[] = [];
      for (const docSnapshot of commentsSnapshot.docs) {
        const commentData = docSnapshot.data();
        
        // Verificar si el usuario le dio like al comentario
        const commentLikeQuery = query(
          collection(db, 'manadashorts_comment_likes'),
          where('commentId', '==', docSnapshot.id),
          where('userId', '==', user?.uid || '')
        );
        const commentLikeSnapshot = await getDocs(commentLikeQuery);
        const isLiked = !commentLikeSnapshot.empty;

        comments.push({
          id: docSnapshot.id,
          videoId: commentData.videoId,
          authorId: commentData.authorId,
          authorName: commentData.authorName,
          authorAvatar: commentData.authorAvatar,
          content: commentData.content,
          likes: commentData.likes || 0,
          replies: commentData.replies || 0,
          createdAt: commentData.createdAt?.toDate() || new Date(),
          isLiked
        });
      }

      return comments;
    } catch (err: any) {
      console.error('Error getting comments:', err);
      return [];
    }
  };

  // Agregar comentario
  const addComment = async (videoId: string, content: string) => {
    if (!user || !userProfile) throw new Error('Usuario no autenticado');

    try {
      await addDoc(collection(db, 'manadashorts_comments'), {
        videoId,
        authorId: user.uid,
        authorName: userProfile.name,
        authorAvatar: userProfile.avatar,
        content,
        likes: 0,
        replies: 0,
        createdAt: Timestamp.now()
      });

      // Actualizar contador de comentarios en el video
      const videoRef = doc(db, 'manadashorts_videos', videoId);
      const videoDoc = await getDocs(query(collection(db, 'manadashorts_videos'), where('__name__', '==', videoId)));
      if (!videoDoc.empty) {
        const currentComments = videoDoc.docs[0].data().comments || 0;
        await updateDoc(videoRef, {
          comments: currentComments + 1,
          updatedAt: Timestamp.now()
        });
      }
    } catch (err: any) {
      console.error('Error adding comment:', err);
      throw new Error('Error al agregar comentario');
    }
  };

  return {
    videos,
    loading,
    error,
    likeVideo,
    followUser,
    shareVideo,
    uploadVideo,
    getVideoComments,
    addComment
  };
}
