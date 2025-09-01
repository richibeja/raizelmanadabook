'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './BlockUserButton.css';

interface BlockUserButtonProps {
  targetUserId: string;
}

export default function BlockUserButton({ targetUserId }: BlockUserButtonProps) {
  const { user: currentUser } = useAuth();
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    const checkBlockStatus = async () => {
      const blockDocRef = doc(db, 'users', currentUser.uid, 'blockedUsers', targetUserId);
      const docSnap = await getDoc(blockDocRef);
      setIsBlocked(docSnap.exists());
      setIsLoading(false);
    };
    checkBlockStatus();
  }, [currentUser, targetUserId]);

  const handleBlock = async () => {
    if (!currentUser || !window.confirm(`¿Estás seguro de que quieres bloquear a este usuario? No podrán ver tu perfil ni interactuar contigo.`)) return;
    
    setIsLoading(true);
    const batch = writeBatch(db);

    // Referencias
    const currentUserRef = doc(db, 'users', currentUser.uid);
    const targetUserRef = doc(db, 'users', targetUserId);
    const blockRef = doc(currentUserRef, 'blockedUsers', targetUserId);
    const blockedByRef = doc(targetUserRef, 'blockedBy', currentUser.uid);

    // Añadir a listas de bloqueo
    batch.set(blockRef, { blockedAt: new Date() });
    batch.set(blockedByRef, { blockedAt: new Date() });

    // Romper seguimiento mutuo
    const followingRef1 = doc(currentUserRef, 'following', targetUserId);
    const followerRef1 = doc(targetUserRef, 'followers', currentUser.uid);
    const followingRef2 = doc(targetUserRef, 'following', currentUser.uid);
    const followerRef2 = doc(currentUserRef, 'followers', targetUserId);

    batch.delete(followingRef1);
    batch.delete(followerRef1);
    batch.delete(followingRef2);
    batch.delete(followerRef2);

    // Actualizar contadores (si es necesario, verificando si existía la relación)
    // Para simplificar, asumimos que la relación podría no existir. Una lógica más compleja verificaría antes de decrementar.

    await batch.commit();
    setIsBlocked(true);
    setIsLoading(false);
    window.location.reload(); // Recargar para que el contenido se filtre
  };

  const handleUnblock = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    const batch = writeBatch(db);
    const blockRef = doc(db, 'users', currentUser.uid, 'blockedUsers', targetUserId);
    const blockedByRef = doc(db, 'users', targetUserId, 'blockedBy', currentUser.uid);

    batch.delete(blockRef);
    batch.delete(blockedByRef);

    await batch.commit();
    setIsBlocked(false);
    setIsLoading(false);
  };

  if (isLoading || !currentUser || currentUser.uid === targetUserId) {
    return null;
  }

  return (
    <button 
      onClick={isBlocked ? handleUnblock : handleBlock} 
      disabled={isLoading} 
      className={`block-button ${isBlocked ? 'unblock' : 'block'}`}
    >
      {isBlocked ? 'Desbloquear' : 'Bloquear'}
    </button>
  );
}
