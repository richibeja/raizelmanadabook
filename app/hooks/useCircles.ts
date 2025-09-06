'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Circle {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: 'breed' | 'location' | 'interest' | 'general' | 'adoption' | 'training' | 'health' | 'other';
  location?: string;
  tags: string[];
  members: string[];
  admins: string[];
  moderators: string[];
  isPublic: boolean;
  isActive: boolean;
  memberCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  rules?: string[];
  requirements?: {
    minAge?: number;
    maxAge?: number;
    species?: string[];
    location?: string;
    verification?: boolean;
  };
}

export interface CircleMembership {
  circleId: string;
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  isActive: boolean;
}

export function useCircles() {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const [circles, setCircles] = useState<Circle[]>([]);
  const [myCircles, setMyCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCircles([]);
      setMyCircles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener todos los círculos públicos y activos
    const circlesQuery = query(
      collection(db, 'circles'),
      where('isPublic', '==', true),
      where('isActive', '==', true),
      orderBy('memberCount', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      circlesQuery,
      async (snapshot) => {
        try {
          const circlesData: Circle[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const circleData = docSnapshot.data();
            
            // Verificar si el usuario es miembro
            const isMember = circleData.members?.includes(user.uid) || false;
            
            circlesData.push({
              id: docSnapshot.id,
              name: circleData.name || '',
              description: circleData.description || '',
              imageUrl: circleData.imageUrl || '',
              category: circleData.category || 'general',
              location: circleData.location || '',
              tags: circleData.tags || [],
              members: circleData.members || [],
              admins: circleData.admins || [],
              moderators: circleData.moderators || [],
              isPublic: circleData.isPublic || false,
              isActive: circleData.isActive || false,
              memberCount: circleData.memberCount || 0,
              postCount: circleData.postCount || 0,
              createdAt: circleData.createdAt?.toDate() || new Date(),
              updatedAt: circleData.updatedAt?.toDate() || new Date(),
              createdBy: circleData.createdBy || '',
              rules: circleData.rules || [],
              requirements: circleData.requirements || {},
            });
          }

          setCircles(circlesData);
          
          // Filtrar círculos del usuario
          const userCircles = circlesData.filter(circle => 
            circle.members.includes(user.uid)
          );
          setMyCircles(userCircles);
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching circles:', err);
          setError('Error al cargar los círculos');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in circles listener:', err);
        setError('Error al cargar los círculos');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createCircle = async (circleData: {
    name: string;
    description: string;
    category: Circle['category'];
    location?: string;
    tags: string[];
    isPublic: boolean;
    rules?: string[];
    requirements?: Circle['requirements'];
  }) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const newCircle = {
        name: circleData.name,
        description: circleData.description,
        category: circleData.category,
        location: circleData.location || '',
        tags: circleData.tags,
        members: [user.uid],
        admins: [user.uid],
        moderators: [],
        isPublic: circleData.isPublic,
        isActive: true,
        memberCount: 1,
        postCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: user.uid,
        rules: circleData.rules || [],
        requirements: circleData.requirements || {},
      };

      const docRef = await addDoc(collection(db, 'circles'), newCircle);
      return docRef.id;
    } catch (error) {
      console.error('Error creating circle:', error);
      throw error;
    }
  };

  const joinCircle = async (circleId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const circleRef = doc(db, 'circles', circleId);
      const circle = circles.find(c => c.id === circleId);
      
      if (!circle) throw new Error('Círculo no encontrado');
      if (circle.members.includes(user.uid)) throw new Error('Ya eres miembro de este círculo');

      const updatedMembers = [...circle.members, user.uid];
      
      await updateDoc(circleRef, {
        members: updatedMembers,
        memberCount: updatedMembers.length,
        updatedAt: Timestamp.now(),
      });

      // Crear registro de membresía
      await addDoc(collection(db, 'circle_memberships'), {
        circleId,
        userId: user.uid,
        role: 'member',
        joinedAt: Timestamp.now(),
        isActive: true,
      });
    } catch (error) {
      console.error('Error joining circle:', error);
      throw error;
    }
  };

  const leaveCircle = async (circleId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const circleRef = doc(db, 'circles', circleId);
      const circle = circles.find(c => c.id === circleId);
      
      if (!circle) throw new Error('Círculo no encontrado');
      if (!circle.members.includes(user.uid)) throw new Error('No eres miembro de este círculo');

      const updatedMembers = circle.members.filter(memberId => memberId !== user.uid);
      const updatedAdmins = circle.admins.filter(adminId => adminId !== user.uid);
      const updatedModerators = circle.moderators.filter(modId => modId !== user.uid);

      await updateDoc(circleRef, {
        members: updatedMembers,
        admins: updatedAdmins,
        moderators: updatedModerators,
        memberCount: updatedMembers.length,
        updatedAt: Timestamp.now(),
      });

      // Actualizar membresía
      const membershipQuery = query(
        collection(db, 'circle_memberships'),
        where('circleId', '==', circleId),
        where('userId', '==', user.uid)
      );
      const membershipSnapshot = await getDocs(membershipQuery);
      
      if (!membershipSnapshot.empty) {
        const membershipDoc = membershipSnapshot.docs[0];
        await updateDoc(doc(db, 'circle_memberships', membershipDoc.id), {
          isActive: false,
        });
      }
    } catch (error) {
      console.error('Error leaving circle:', error);
      throw error;
    }
  };

  const updateCircle = async (circleId: string, updates: Partial<Circle>) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const circle = circles.find(c => c.id === circleId);
      if (!circle) throw new Error('Círculo no encontrado');
      
      // Verificar permisos
      if (!circle.admins.includes(user.uid)) {
        throw new Error('No tienes permisos para editar este círculo');
      }

      const circleRef = doc(db, 'circles', circleId);
      await updateDoc(circleRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating circle:', error);
      throw error;
    }
  };

  const deleteCircle = async (circleId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const circle = circles.find(c => c.id === circleId);
      if (!circle) throw new Error('Círculo no encontrado');
      
      // Solo el creador puede eliminar
      if (circle.createdBy !== user.uid) {
        throw new Error('Solo el creador puede eliminar este círculo');
      }

      await deleteDoc(doc(db, 'circles', circleId));
    } catch (error) {
      console.error('Error deleting circle:', error);
      throw error;
    }
  };

  const searchCircles = async (searchTerm: string, category?: string, location?: string) => {
    try {
      let circlesQuery = query(
        collection(db, 'circles'),
        where('isPublic', '==', true),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(circlesQuery);
      let results: Circle[] = [];

      snapshot.forEach((doc) => {
        const circleData = doc.data();
        const circle: Circle = {
          id: doc.id,
          name: circleData.name || '',
          description: circleData.description || '',
          imageUrl: circleData.imageUrl || '',
          category: circleData.category || 'general',
          location: circleData.location || '',
          tags: circleData.tags || [],
          members: circleData.members || [],
          admins: circleData.admins || [],
          moderators: circleData.moderators || [],
          isPublic: circleData.isPublic || false,
          isActive: circleData.isActive || false,
          memberCount: circleData.memberCount || 0,
          postCount: circleData.postCount || 0,
          createdAt: circleData.createdAt?.toDate() || new Date(),
          updatedAt: circleData.updatedAt?.toDate() || new Date(),
          createdBy: circleData.createdBy || '',
          rules: circleData.rules || [],
          requirements: circleData.requirements || {},
        };

        // Filtros de búsqueda
        const matchesSearch = searchTerm === '' || 
          circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          circle.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          circle.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = !category || circle.category === category;
        const matchesLocation = !location || circle.location?.toLowerCase().includes(location.toLowerCase());

        if (matchesSearch && matchesCategory && matchesLocation) {
          results.push(circle);
        }
      });

      return results.sort((a, b) => b.memberCount - a.memberCount);
    } catch (error) {
      console.error('Error searching circles:', error);
      throw error;
    }
  };

  return {
    circles,
    myCircles,
    loading,
    error,
    createCircle,
    joinCircle,
    leaveCircle,
    updateCircle,
    deleteCircle,
    searchCircles,
  };
}

// Hook para círculos del usuario
export const useUserCircles = () => {
  const [userCircles, setUserCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserCircles = async () => {
    try {
      setLoading(true);
      // Simular datos de círculos del usuario
      setUserCircles([
        {
          id: '1',
          name: 'Amantes de Perros',
          description: 'Círculo para dueños de perros',
          memberCount: 150,
          isPublic: true,
          tags: ['perros', 'mascotas'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar círculos del usuario');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserCircles();
  }, []);

  return {
    userCircles,
    loading,
    error,
    loadUserCircles
  };
};

// Hook para miembros de círculos
export const useCircleMembers = (circleId: string) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCircleMembers = async () => {
    try {
      setLoading(true);
      // Simular datos de miembros
      setMembers([
        { id: '1', name: 'Usuario 1', avatar: '', role: 'admin' },
        { id: '2', name: 'Usuario 2', avatar: '', role: 'member' }
      ]);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar miembros del círculo');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (circleId) {
      loadCircleMembers();
    }
  }, [circleId]);

  return {
    members,
    loading,
    error,
    loadCircleMembers
  };
};
