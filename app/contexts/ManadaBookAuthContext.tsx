'use client';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  pets: Array<{
    id: string;
    name: string;
    species: string;
    breed?: string;
    age?: number;
    avatar?: string;
  }>;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ManadaBookAuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const ManadaBookAuthContext = createContext<ManadaBookAuthContextType | undefined>(undefined);

export const useManadaBookAuth = () => {
  const context = useContext(ManadaBookAuthContext);
  if (context === undefined) {
    throw new Error('useManadaBookAuth must be used within a ManadaBookAuthProvider');
  }
  return context;
};

interface ManadaBookAuthProviderProps {
  children: ReactNode;
}

export const ManadaBookAuthProvider: React.FC<ManadaBookAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Cargar perfil del usuario
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserProfile({
              id: user.uid,
              name: userData.name || user.displayName || 'Usuario',
              email: user.email || '',
              avatar: userData.avatar || user.photoURL || '',
              bio: userData.bio || '',
              location: userData.location || '',
              website: userData.website || '',
              pets: userData.pets || [],
              followers: userData.followers || [],
              following: userData.following || [],
              createdAt: userData.createdAt?.toDate() || new Date(),
              updatedAt: userData.updatedAt?.toDate() || new Date(),
            });
          } else {
            // Crear perfil básico si no existe
            const newProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || 'Usuario',
              email: user.email || '',
              avatar: user.photoURL || '',
              bio: '',
              location: '',
              website: '',
              pets: [],
              followers: [],
              following: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            
            await setDoc(doc(db, 'users', user.uid), {
              ...newProfile,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Crear perfil del usuario
      const userProfile: UserProfile = {
        id: user.uid,
        name,
        email: user.email || '',
        avatar: user.photoURL || '',
        bio: '',
        location: '',
        website: '',
        pets: [],
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', user.uid), {
        ...userProfile,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrarse');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Error al cerrar sesión');
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      const updatedProfile = {
        ...profile,
        updatedAt: new Date(),
      };
      
      await updateDoc(doc(db, 'users', user.uid), updatedProfile);
      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar perfil');
    }
  };

  const value: ManadaBookAuthContextType = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <ManadaBookAuthContext.Provider value={value}>
      {children}
    </ManadaBookAuthContext.Provider>
  );
};