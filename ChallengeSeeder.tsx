'use client';

import { useState } from 'react';
import { collection, writeBatch, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const sampleChallenges = [
  {
    title: "Paseo Matutino",
    description: "Sube una foto de tu paseo de la mañana con tu mascota en el feed principal.",
    reward: "10 Puntos de Manada",
    type: 'action',
    isActive: true,
  },
  {
    title: "Amigo Social",
    description: "Sigue a 3 nuevos usuarios esta semana.",
    reward: "Medalla 'Explorador'",
    type: 'community',
    isActive: true,
  },
  {
    title: "Voz de la Comunidad",
    description: "Publica tu primer mensaje en un grupo.",
    reward: "Medalla 'Miembro Activo'",
    type: 'community',
    isActive: true,
  },
];

export default function ChallengeSeeder() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('');
    try {
      const batch = writeBatch(db);
      const challengesCollection = collection(db, 'challenges');

      sampleChallenges.forEach(challenge => {
        const docRef = doc(challengesCollection);
        batch.set(docRef, { ...challenge, createdAt: serverTimestamp() });
      });

      await batch.commit();
      setMessage('¡Éxito! Se han añadido 3 retos de ejemplo a tu base de datos.');
    } catch (error) {
      console.error("Error seeding challenges: ", error);
      setMessage('Error al añadir los retos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px dashed #ccc', margin: '20px 0', textAlign: 'center' }}>
      <h4>Herramienta para Contenido de Ejemplo</h4>
      <p>Usa este botón para añadir retos a tu Firestore.</p>
      <button onClick={handleSeed} disabled={loading}>
        {loading ? 'Añadiendo...' : 'Añadir Retos de Ejemplo'}
      </button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
