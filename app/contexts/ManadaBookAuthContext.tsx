'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'rodent' | 'horse' | 'exotic' | 'other';
  breed?: string;
  age: number;
  gender: 'male' | 'female';
  personality: string[];
  interests: string[];
  location: string;
  bio: string;
  avatarUrl?: string;
  privacy: 'public' | 'friends' | 'private';
  vaccines: string[];
  createdAt: Date;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  pets: Pet[];
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ManadaBookAuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
  updatePet: (petId: string, updates: Partial<Pet>) => Promise<void>;
}

const ManadaBookAuthContext = createContext<ManadaBookAuthContextType | undefined>(undefined);

export function ManadaBookAuthProvider({ children }: { children: React.ReactNode }) {
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
              name: userData.name || user.displayName || '',
              email: user.email || '',
              phone: userData.phone || '',
              avatarUrl: userData.avatarUrl || user.photoURL || '',
              bio: userData.bio || '',
              location: userData.location || '',
              pets: userData.pets || [],
              followers: userData.followers || [],
              following: userData.following || [],
              createdAt: userData.createdAt?.toDate() || new Date(),
              updatedAt: userData.updatedAt?.toDate() || new Date(),
            });
          } else {
            // Crear perfil inicial si no existe
            const initialProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || '',
              email: user.email || '',
              avatarUrl: user.photoURL || '',
              pets: [],
              followers: [],
              following: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            await setDoc(doc(db, 'users', user.uid), {
              ...initialProfile,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            setUserProfile(initialProfile);
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

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      
      // Crear perfil inicial
      const initialProfile: UserProfile = {
        id: result.user.uid,
        name,
        email,
        pets: [],
        followers: [],
        following: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', result.user.uid), {
        ...initialProfile,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Verificar si es un usuario nuevo
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        const initialProfile: UserProfile = {
          id: result.user.uid,
          name: result.user.displayName || '',
          email: result.user.email || '',
          avatarUrl: result.user.photoURL || '',
          pets: [],
          followers: [],
          following: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await setDoc(doc(db, 'users', result.user.uid), {
          ...initialProfile,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: new Date(),
      });
      
      setUserProfile(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const addPet = async (pet: Omit<Pet, 'id' | 'createdAt'>) => {
    if (!user) return;
    
    try {
      const newPet: Pet = {
        ...pet,
        id: `pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
      };
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedPets = [...(userData.pets || []), newPet];
        
        await updateDoc(doc(db, 'users', user.uid), {
          pets: updatedPets,
          updatedAt: new Date(),
        });
        
        setUserProfile(prev => prev ? { 
          ...prev, 
          pets: [...prev.pets, newPet],
          updatedAt: new Date()
        } : null);
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    }
  };

  const updatePet = async (petId: string, updates: Partial<Pet>) => {
    if (!user || !userProfile) return;
    
    try {
      const updatedPets = userProfile.pets.map(pet => 
        pet.id === petId ? { ...pet, ...updates } : pet
      );
      
      await updateDoc(doc(db, 'users', user.uid), {
        pets: updatedPets,
        updatedAt: new Date(),
      });
      
      setUserProfile(prev => prev ? { 
        ...prev, 
        pets: updatedPets,
        updatedAt: new Date()
      } : null);
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  };

  const value: ManadaBookAuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateUserProfile,
    addPet,
    updatePet,
  };

  return (
    <ManadaBookAuthContext.Provider value={value}>
      {children}
    </ManadaBookAuthContext.Provider>
  );
}

export function useManadaBookAuth() {
  const context = useContext(ManadaBookAuthContext);
  if (context === undefined) {
    throw new Error('useManadaBookAuth must be used within a ManadaBookAuthProvider');
  }
  return context;
}
