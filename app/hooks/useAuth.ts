'use client';
import { useState, useEffect } from 'react';
import { 
  auth, 
  signInUser, 
  registerUser, 
  signInWithGoogle, 
  signOutUser, 
  onAuthStateChange,
  User as FirebaseUserDoc 
} from '../../lib/firebase';
import { User as FirebaseAuthUser } from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface RegisterData {
  username: string;
  displayName?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser: FirebaseAuthUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      await signInUser(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: RegisterData) => {
    try {
      setError(null);
      setLoading(true);
      await registerUser(email, password, userData);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
    } catch (err: any) {
      setError(err.message || 'Error al cerrar sesión');
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    register,
    signInGoogle,
    signOut
  };
};