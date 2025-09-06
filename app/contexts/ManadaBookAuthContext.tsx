'use client';
import React, { createContext, useContext, ReactNode } from 'react';

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
  user: any;
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
    return {
      user: null,
      userProfile: null,
      loading: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      updateProfile: async () => {}
    };
  }
  return context;
};

interface ManadaBookAuthProviderProps {
  children: ReactNode;
}

export const ManadaBookAuthProvider: React.FC<ManadaBookAuthProviderProps> = ({ children }) => {
  const value: ManadaBookAuthContextType = {
    user: null,
    userProfile: null,
    loading: false,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    updateProfile: async () => {}
  };

  return (
    <ManadaBookAuthContext.Provider value={value}>
      {children}
    </ManadaBookAuthContext.Provider>
  );
};