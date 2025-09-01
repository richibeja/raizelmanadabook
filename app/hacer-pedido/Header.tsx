import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import '../globals.css';
'use client';
import React from 'react';

export default function Header({ children }: { children: React.ReactNode }) {
    return <header>{children}</header>;
}
