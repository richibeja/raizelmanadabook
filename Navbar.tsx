
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './Navbar.css'; // Importar el archivo CSS

const ADMIN_UIDS = ['YOUR_ADMIN_UID_HERE']; // Reemplaza con los UIDs de tus administradores

export default function Navbar() {
  const { user, loading } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'users', user.uid, 'notifications'),
        where('read', '==', false)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setNotificationCount(snapshot.size);
      });

      return () => unsubscribe();
    } else {
      setNotificationCount(0);
    }
  }, [user]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/">Raízel App</Link>
      </div>
      <button className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </button>
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
        <div className="navbar-links-inner">
          {/* Raízel Core */}
          <Link href="/clips" onClick={() => setIsMenuOpen(false)}>Clips</Link>
          <Link href="/products" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
          <Link href="/calculator" onClick={() => setIsMenuOpen(false)}>Calculadora</Link>
          <Link href="/education" onClick={() => setIsMenuOpen(false)}>Educación</Link>
          <Link href="/pedidos" onClick={() => setIsMenuOpen(false)}>Hacer Pedido</Link>
          
          {/* ManadaBook Module */}
          <Link href="/dashboard" className="manadabook-link" onClick={() => setIsMenuOpen(false)}>🐾 ManadaBook</Link>
          
          {/* Shared Modules */}
          <Link href="/mercado" onClick={() => setIsMenuOpen(false)}>Mercado</Link>
          <Link href="/adoptions" onClick={() => setIsMenuOpen(false)}>Adopciones</Link>
          
          {!loading && user && ADMIN_UIDS.includes(user.uid) && (
            <Link href="/admin" className="admin-link" onClick={() => setIsMenuOpen(false)}>⚙️ Admin</Link>
          )}

          {user && <Link href={`/profile/${user.uid}`} onClick={() => setIsMenuOpen(false)}>Mi Perfil</Link>}
        </div>
      </div>
      <div className="navbar-auth">
        {user ? (
          <>
            <Link href="/notifications" className="navbar-link-notifications">
              Notificaciones
              {notificationCount > 0 && (
                <span className="navbar-badge">
                  {notificationCount}
                </span>
              )}
            </Link>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <Link href="/login">Iniciar Sesión</Link>
        )}
      </div>
    </nav>
  );
}
