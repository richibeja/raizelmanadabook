
'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, writeBatch, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './JoinGroupButton.css'; // Importar el archivo CSS

interface JoinGroupButtonProps {
  groupId: string;
}

export default function JoinGroupButton({ groupId }: JoinGroupButtonProps) {
  const { user: currentUser } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const checkMembershipStatus = async () => {
      const memberDocRef = doc(db, 'groups', groupId, 'members', currentUser.uid);
      const docSnap = await getDoc(memberDocRef);
      setIsMember(docSnap.exists());
      setIsLoading(false);
    };

    checkMembershipStatus();
  }, [currentUser, groupId]);

  const handleJoin = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const batch = writeBatch(db);

    // 1. Añadir al usuario a la subcolección 'members' del grupo
    const memberRef = doc(db, 'groups', groupId, 'members', currentUser.uid);
    batch.set(memberRef, { joinedAt: serverTimestamp() });

    // 2. Añadir el grupo a la subcolección 'groups' del usuario
    const userGroupRef = doc(db, 'users', currentUser.uid, 'groups', groupId);
    batch.set(userGroupRef, { joinedAt: serverTimestamp() });

    // 3. Incrementar el contador de miembros del grupo
    const groupRef = doc(db, 'groups', groupId);
    batch.update(groupRef, { memberCount: increment(1) });

    await batch.commit();
    setIsMember(true);
    setIsLoading(false);
  };

  const handleLeave = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const batch = writeBatch(db);

    // 1. Eliminar al usuario de la subcolección 'members' del grupo
    const memberRef = doc(db, 'groups', groupId, 'members', currentUser.uid);
    batch.delete(memberRef);

    // 2. Eliminar el grupo de la subcolección 'groups' del usuario
    const userGroupRef = doc(db, 'users', currentUser.uid, 'groups', groupId);
    batch.delete(userGroupRef);

    // 3. Decrementar el contador de miembros del grupo
    const groupRef = doc(db, 'groups', groupId);
    batch.update(groupRef, { memberCount: increment(-1) });

    await batch.commit();
    setIsMember(false);
    setIsLoading(false);
  };

  if (!currentUser) return <p>Inicia sesión para unirte a grupos.</p>;
  if (isLoading) return <button disabled className="join-group-button">Cargando...</button>;

  return (
    <button 
      onClick={isMember ? handleLeave : handleJoin} 
      disabled={isLoading} 
      className={`join-group-button ${isMember ? 'leave' : 'join'}`}
    >
      {isMember ? 'Salir del Grupo' : 'Unirse al Grupo'}
    </button>
  );
}
