'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, writeBatch, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '@/AuthContext';

interface AttendEventButtonProps {
  eventId: string;
}

export default function AttendEventButton({ eventId }: AttendEventButtonProps) {
  const { user: currentUser } = useAuth();
  const [isAttending, setIsAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const checkAttendanceStatus = async () => {
      const attendeeDocRef = doc(db, 'events', eventId, 'attendees', currentUser.uid);
      const docSnap = await getDoc(attendeeDocRef);
      setIsAttending(docSnap.exists());
      setIsLoading(false);
    };

    checkAttendanceStatus();
  }, [currentUser, eventId]);

  const handleAttend = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const batch = writeBatch(db);

    // 1. Añadir al usuario a la subcolección 'attendees' del evento
    const attendeeRef = doc(db, 'events', eventId, 'attendees', currentUser.uid);
    batch.set(attendeeRef, { rsvpAt: serverTimestamp() });

    // 2. Añadir el evento a la subcolección 'attendingEvents' del usuario
    const userEventRef = doc(db, 'users', currentUser.uid, 'attendingEvents', eventId);
    batch.set(userEventRef, { rsvpAt: serverTimestamp() });

    // 3. Incrementar el contador de asistentes del evento
    const eventRef = doc(db, 'events', eventId);
    batch.update(eventRef, { attendeeCount: increment(1) });

    await batch.commit();
    setIsAttending(true);
    setIsLoading(false);
  };

  const handleUnattend = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    const batch = writeBatch(db);

    // 1. Eliminar al usuario de la subcolección 'attendees' del evento
    const attendeeRef = doc(db, 'events', eventId, 'attendees', currentUser.uid);
    batch.delete(attendeeRef);

    // 2. Eliminar el evento de la subcolección 'attendingEvents' del usuario
    const userEventRef = doc(db, 'users', currentUser.uid, 'attendingEvents', eventId);
    batch.delete(userEventRef);

    // 3. Decrementar el contador de asistentes del evento
    const eventRef = doc(db, 'events', eventId);
    batch.update(eventRef, { attendeeCount: increment(-1) });

    await batch.commit();
    setIsAttending(false);
    setIsLoading(false);
  };

  if (!currentUser) return <p>Inicia sesión para confirmar tu asistencia.</p>;
  if (isLoading) return <button disabled className="attend-event-button">Cargando...</button>;

  return (
    <button 
      onClick={isAttending ? handleUnattend : handleAttend} 
      disabled={isLoading} 
      className={`attend-event-button ${isAttending ? 'unattend' : 'attend'}`}
    >
      {isAttending ? 'Cancelar Asistencia' : '¡Asistiré!'}
    </button>
  );
}
