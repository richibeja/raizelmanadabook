
'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import ShareButton from './ShareButton';
import './UserBadges.css'; // Importar el archivo CSS

interface Badge {
  id: string;
  name: string;
  description: string;
}

interface UserBadgesProps {
  userId: string;
  userName: string; // Añadimos userName como prop
}

export default function UserBadges({ userId, userName }: UserBadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, 'users', userId, 'badges'),
      orderBy('earnedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const badgesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        description: doc.data().description,
      }));
      setBadges(badgesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return <p>Cargando medallas...</p>;
  }

  return (
    <div className="user-badges-container">
      <h3>Medallas Obtenidas</h3>
      {badges.length === 0 ? (
        <p>Este usuario aún no ha ganado ninguna medalla.</p>
      ) : (
        <div className="badges-grid">
          {badges.map(badge => (
            <div key={badge.id} className="badge-card">
              <span className="badge-icon">🏅</span>
              <h4 className="badge-name">{badge.name}</h4>
              <p className="badge-description">{badge.description}</p>
              <div className="badge-share-button-container">
                <ShareButton 
                  contentId={badge.id} 
                  contentType="achievement" 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
