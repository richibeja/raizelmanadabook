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
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  mediaUrls: string[];
  likesCount: number;
  repliesCount: number;
  parentCommentId?: string;
  createdAt: Date;
  updatedAt: Date;
  userLiked?: boolean;
  isEdited?: boolean;
}

export function useComments(postId: string) {
  const { user, userProfile } = useManadaBookAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener comentarios del post
    const commentsQuery = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      where('parentCommentId', '==', null), // Solo comentarios principales
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      async (snapshot) => {
        try {
          const commentsData: Comment[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const commentData = docSnapshot.data();
            
            // Obtener información del autor
            const authorDoc = await doc(db, 'users', commentData.authorId).get();
            let authorName = 'Usuario Anónimo';
            let authorAvatar = '';
            
            if (authorDoc.exists()) {
              const authorData = authorDoc.data();
              authorName = authorData.name || 'Usuario Anónimo';
              authorAvatar = authorData.avatarUrl || '';
            }

            // Verificar si el usuario actual le dio like
            const likesQuery = query(
              collection(db, 'comment_likes'),
              where('commentId', '==', docSnapshot.id),
              where('userId', '==', user?.uid || ''),
              where('reactionType', '==', 'like')
            );
            const likesSnapshot = await getDocs(likesQuery);
            const userLiked = !likesSnapshot.empty;

            // Obtener respuestas
            const repliesQuery = query(
              collection(db, 'comments'),
              where('parentCommentId', '==', docSnapshot.id),
              orderBy('createdAt', 'asc')
            );
            const repliesSnapshot = await getDocs(repliesQuery);
            const replies: Comment[] = [];

            for (const replyDoc of repliesSnapshot.docs) {
              const replyData = replyDoc.data();
              const replyAuthorDoc = await doc(db, 'users', replyData.authorId).get();
              let replyAuthorName = 'Usuario Anónimo';
              let replyAuthorAvatar = '';

              if (replyAuthorDoc.exists()) {
                const replyAuthorData = replyAuthorDoc.data();
                replyAuthorName = replyAuthorData.name || 'Usuario Anónimo';
                replyAuthorAvatar = replyAuthorData.avatarUrl || '';
              }

              // Verificar like en respuesta
              const replyLikesQuery = query(
                collection(db, 'comment_likes'),
                where('commentId', '==', replyDoc.id),
                where('userId', '==', user?.uid || ''),
                where('reactionType', '==', 'like')
              );
              const replyLikesSnapshot = await getDocs(replyLikesQuery);
              const replyUserLiked = !replyLikesSnapshot.empty;

              replies.push({
                id: replyDoc.id,
                postId: replyData.postId,
                authorId: replyData.authorId,
                authorName: replyAuthorName,
                authorAvatar: replyAuthorAvatar,
                content: replyData.content || '',
                mediaUrls: replyData.mediaUrls || [],
                likesCount: replyData.likesCount || 0,
                repliesCount: 0,
                parentCommentId: replyData.parentCommentId,
                createdAt: replyData.createdAt?.toDate() || new Date(),
                updatedAt: replyData.updatedAt?.toDate() || new Date(),
                userLiked: replyUserLiked,
                isEdited: replyData.isEdited || false,
              });
            }

            commentsData.push({
              id: docSnapshot.id,
              postId: commentData.postId,
              authorId: commentData.authorId,
              authorName,
              authorAvatar,
              content: commentData.content || '',
              mediaUrls: commentData.mediaUrls || [],
              likesCount: commentData.likesCount || 0,
              repliesCount: replies.length,
              parentCommentId: commentData.parentCommentId,
              createdAt: commentData.createdAt?.toDate() || new Date(),
              updatedAt: commentData.updatedAt?.toDate() || new Date(),
              userLiked,
              isEdited: commentData.isEdited || false,
            });
          }

          setComments(commentsData);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching comments:', err);
          setError('Error al cargar los comentarios');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in comments listener:', err);
        setError('Error al cargar los comentarios');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [postId, user]);

  const addComment = async (content: string, parentCommentId?: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (!content.trim()) throw new Error('El comentario no puede estar vacío');

    try {
      const newComment = {
        postId,
        authorId: user.uid,
        content: content.trim(),
        mediaUrls: [],
        likesCount: 0,
        repliesCount: 0,
        parentCommentId: parentCommentId || null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        isEdited: false,
      };

      const docRef = await addDoc(collection(db, 'comments'), newComment);
      
      // Actualizar contador de comentarios en el post
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentsCount: comments.length + 1,
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const editComment = async (commentId: string, newContent: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (!newContent.trim()) throw new Error('El comentario no puede estar vacío');

    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) throw new Error('Comentario no encontrado');
      if (comment.authorId !== user.uid) throw new Error('No tienes permisos para editar este comentario');

      const commentRef = doc(db, 'comments', commentId);
      await updateDoc(commentRef, {
        content: newContent.trim(),
        updatedAt: Timestamp.now(),
        isEdited: true,
      });
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) throw new Error('Comentario no encontrado');
      if (comment.authorId !== user.uid) throw new Error('No tienes permisos para eliminar este comentario');

      // Eliminar comentario y todas sus respuestas
      await deleteDoc(doc(db, 'comments', commentId));
      
      // Actualizar contador de comentarios en el post
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        commentsCount: Math.max(0, comments.length - 1),
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  const likeComment = async (commentId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Verificar si ya le dio like
      const existingLikeQuery = query(
        collection(db, 'comment_likes'),
        where('commentId', '==', commentId),
        where('userId', '==', user.uid),
        where('reactionType', '==', 'like')
      );
      const existingLikeSnapshot = await getDocs(existingLikeQuery);

      if (existingLikeSnapshot.empty) {
        // Agregar like
        await addDoc(collection(db, 'comment_likes'), {
          commentId,
          userId: user.uid,
          reactionType: 'like',
          createdAt: Timestamp.now(),
        });

        // Incrementar contador de likes
        const commentRef = doc(db, 'comments', commentId);
        const comment = comments.find(c => c.id === commentId);
        await updateDoc(commentRef, {
          likesCount: (comment?.likesCount || 0) + 1,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Quitar like
        const likeDoc = existingLikeSnapshot.docs[0];
        await deleteDoc(doc(db, 'comment_likes', likeDoc.id));

        // Decrementar contador de likes
        const commentRef = doc(db, 'comments', commentId);
        const comment = comments.find(c => c.id === commentId);
        await updateDoc(commentRef, {
          likesCount: Math.max(0, (comment?.likesCount || 1) - 1),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
    editComment,
    deleteComment,
    likeComment,
  };
}
