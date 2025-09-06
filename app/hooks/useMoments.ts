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
import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Moment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  mediaUrls: string[];
  mediaType: 'image' | 'video' | 'text';
  petId?: string;
  petName?: string;
  petSpecies?: string;
  location?: string;
  tags: string[];
  viewsCount: number;
  reactionsCount: number;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  userViewed?: boolean;
  userReacted?: boolean;
}

export interface MomentReaction {
  id: string;
  momentId: string;
  userId: string;
  reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  createdAt: Date;
}

export function useMoments() {
  const { user, userProfile } = useManadaBookAuth();
  const [moments, setMoments] = useState<Moment[]>([]);
  const [myMoments, setMyMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setMoments([]);
      setMyMoments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener todos los moments activos
    const momentsQuery = query(
      collection(db, 'moments'),
      where('isActive', '==', true),
      where('expiresAt', '>', Timestamp.now()),
      orderBy('expiresAt', 'asc'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      momentsQuery,
      async (snapshot) => {
        try {
          const momentsData: Moment[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const momentData = docSnapshot.data();
            
            // Obtener información del autor
            const authorDoc = await doc(db, 'users', momentData.authorId).get();
            let authorName = 'Usuario Anónimo';
            let authorAvatar = '';
            
            if (authorDoc.exists()) {
              const authorData = authorDoc.data();
              authorName = authorData.name || 'Usuario Anónimo';
              authorAvatar = authorData.avatarUrl || '';
            }

            // Verificar si el usuario actual vio este moment
            const viewQuery = query(
              collection(db, 'moment_views'),
              where('momentId', '==', docSnapshot.id),
              where('userId', '==', user.uid)
            );
            const viewSnapshot = await getDocs(viewQuery);
            const userViewed = !viewSnapshot.empty;

            // Verificar si el usuario reaccionó
            const reactionQuery = query(
              collection(db, 'moment_reactions'),
              where('momentId', '==', docSnapshot.id),
              where('userId', '==', user.uid)
            );
            const reactionSnapshot = await getDocs(reactionQuery);
            const userReacted = !reactionSnapshot.empty;

            momentsData.push({
              id: docSnapshot.id,
              authorId: momentData.authorId,
              authorName,
              authorAvatar,
              content: momentData.content || '',
              mediaUrls: momentData.mediaUrls || [],
              mediaType: momentData.mediaType || 'text',
              petId: momentData.petId || '',
              petName: momentData.petName || '',
              petSpecies: momentData.petSpecies || '',
              location: momentData.location || '',
              tags: momentData.tags || [],
              viewsCount: momentData.viewsCount || 0,
              reactionsCount: momentData.reactionsCount || 0,
              createdAt: momentData.createdAt?.toDate() || new Date(),
              expiresAt: momentData.expiresAt?.toDate() || new Date(),
              isActive: momentData.isActive || false,
              userViewed,
              userReacted,
            });
          }

          setMoments(momentsData);
          
          // Filtrar moments del usuario
          const userMoments = momentsData.filter(moment => 
            moment.authorId === user.uid
          );
          setMyMoments(userMoments);
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching moments:', err);
          setError('Error al cargar los moments');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in moments listener:', err);
        setError('Error al cargar los moments');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createMoment = async (momentData: {
    content: string;
    mediaUrls: string[];
    mediaType: 'image' | 'video' | 'text';
    petId?: string;
    petName?: string;
    petSpecies?: string;
    location?: string;
    tags: string[];
  }) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (!momentData.content.trim() && momentData.mediaUrls.length === 0) {
      throw new Error('El moment debe tener contenido o media');
    }

    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas

      const newMoment = {
        authorId: user.uid,
        content: momentData.content.trim(),
        mediaUrls: momentData.mediaUrls,
        mediaType: momentData.mediaType,
        petId: momentData.petId || '',
        petName: momentData.petName || '',
        petSpecies: momentData.petSpecies || '',
        location: momentData.location || '',
        tags: momentData.tags,
        viewsCount: 0,
        reactionsCount: 0,
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(expiresAt),
        isActive: true,
      };

      const docRef = await addDoc(collection(db, 'moments'), newMoment);
      return docRef.id;
    } catch (error) {
      console.error('Error creating moment:', error);
      throw error;
    }
  };

  const viewMoment = async (momentId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Verificar si ya vio este moment
      const existingViewQuery = query(
        collection(db, 'moment_views'),
        where('momentId', '==', momentId),
        where('userId', '==', user.uid)
      );
      const existingViewSnapshot = await getDocs(existingViewQuery);

      if (existingViewSnapshot.empty) {
        // Agregar vista
        await addDoc(collection(db, 'moment_views'), {
          momentId,
          userId: user.uid,
          viewedAt: Timestamp.now(),
        });

        // Incrementar contador de vistas
        const momentRef = doc(db, 'moments', momentId);
        const moment = moments.find(m => m.id === momentId);
        await updateDoc(momentRef, {
          viewsCount: (moment?.viewsCount || 0) + 1,
        });
      }
    } catch (error) {
      console.error('Error viewing moment:', error);
      throw error;
    }
  };

  const reactToMoment = async (momentId: string, reactionType: MomentReaction['reactionType']) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Verificar si ya reaccionó
      const existingReactionQuery = query(
        collection(db, 'moment_reactions'),
        where('momentId', '==', momentId),
        where('userId', '==', user.uid)
      );
      const existingReactionSnapshot = await getDocs(existingReactionQuery);

      if (existingReactionSnapshot.empty) {
        // Agregar reacción
        await addDoc(collection(db, 'moment_reactions'), {
          momentId,
          userId: user.uid,
          reactionType,
          createdAt: Timestamp.now(),
        });

        // Incrementar contador de reacciones
        const momentRef = doc(db, 'moments', momentId);
        const moment = moments.find(m => m.id === momentId);
        await updateDoc(momentRef, {
          reactionsCount: (moment?.reactionsCount || 0) + 1,
        });
      } else {
        // Actualizar reacción existente
        const reactionDoc = existingReactionSnapshot.docs[0];
        await updateDoc(doc(db, 'moment_reactions', reactionDoc.id), {
          reactionType,
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error reacting to moment:', error);
      throw error;
    }
  };

  const deleteMoment = async (momentId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const moment = moments.find(m => m.id === momentId);
      if (!moment) throw new Error('Moment no encontrado');
      if (moment.authorId !== user.uid) throw new Error('No tienes permisos para eliminar este moment');

      await deleteDoc(doc(db, 'moments', momentId));
    } catch (error) {
      console.error('Error deleting moment:', error);
      throw error;
    }
  };

  const getExpiredMoments = () => {
    const now = new Date();
    return moments.filter(moment => moment.expiresAt <= now);
  };

  const getActiveMoments = () => {
    const now = new Date();
    return moments.filter(moment => moment.expiresAt > now);
  };

  const getMomentsByUser = (userId: string) => {
    return moments.filter(moment => moment.authorId === userId);
  };

  const getMomentsByPet = (petId: string) => {
    return moments.filter(moment => moment.petId === petId);
  };

  return {
    moments: getActiveMoments(),
    myMoments,
    expiredMoments: getExpiredMoments(),
    loading,
    error,
    createMoment,
    viewMoment,
    reactToMoment,
    deleteMoment,
    getMomentsByUser,
    getMomentsByPet,
  };
}
