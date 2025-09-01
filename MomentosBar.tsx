'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './MomentosBar.css';

interface MomentoUser {
  userId: string;
  petName: string;
  petAvatarUrl: string;
}

interface MomentosBarProps {
  onUserClick: (userId: string) => void;
  onAddClick: () => void;
}

export default function MomentosBar({ onUserClick, onAddClick }: MomentosBarProps) {
  const { user: currentUser } = useAuth();
  const [momentoUsers, setMomentoUsers] = useState<MomentoUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchMomentos = async () => {
      try {
        const twentyFourHoursAgo = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
        
        // 1. Obtener a quién sigo
        const followingRef = collection(db, 'users', currentUser.uid, 'following');
        const followingSnap = await getDocs(followingRef);
        const followingIds = followingSnap.docs.map(doc => doc.id);
        const userIdsToQuery = [currentUser.uid, ...followingIds];

        // 2. Buscar usuarios que tengan Momentos activos
        const usersRef = collection(db, 'users');
        const q = query(usersRef, 
            where('__name__', 'in', userIdsToQuery),
            where('hasActiveMomento', '==', true),
            where('lastMomentoAt', '>=', twentyFourHoursAgo),
            orderBy('lastMomentoAt', 'desc')
        );

        const usersSnap = await getDocs(q);
        const usersWithMomentosPromises = usersSnap.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            const petDoc = await getDoc(doc(db, 'users', userDoc.id, 'pets', userData.primaryPetId));
            return {
                userId: userDoc.id,
                petName: petDoc.exists() ? petDoc.data().name : userData.displayName,
                petAvatarUrl: petDoc.exists() ? petDoc.data().avatarUrl : '',
            };
        });

        const users = await Promise.all(usersWithMomentosPromises);
        setMomentoUsers(users);
      } catch (error) {
        console.error("Error fetching momentos bar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMomentos();
  }, [currentUser]);

  return (
    <div className="momentos-bar-container">
        <div className="momento-circle add-momento" onClick={onAddClick}>
            <div className="momento-avatar" style={{ backgroundImage: `url(${currentUser?.photoURL || 'https://via.placeholder.com/150'})` }}></div>
            <span className="add-icon">+</span>
        </div>
        {momentoUsers.filter(u => u.userId !== currentUser?.uid).map(user => (
            <div key={user.userId} className="momento-circle" onClick={() => onUserClick(user.userId)}>
                <div className="momento-avatar" style={{ backgroundImage: `url(${user.petAvatarUrl})` }}></div>
                <span>{user.petName}</span>
            </div>
        ))}
    </div>
  );
}
