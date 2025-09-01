import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../globals.css';
'use client';

import React, { createContext, useContext, useState, ReactNode } from "react";

@/app/@/app/AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

@/app/@/app/AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => setUser(username);
  const logout = () => setUser(null);

  return (
@/app/@/app/AuthContext.Provider value={{ user, login, logout }}>
      {children}
@/app/@/app/AuthContext.Provider>
  );
}

export function useAuth() {
@/app/@/app/AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}




