'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, documentId, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import Link from 'next/link';
import FollowButton from './FollowButton';
import './SuggestedFollows.css'; // Importar el archivo CSS

interface SuggestedUser {
  id: string;
  petName: string;
}

export default function SuggestedFollows() {
  const { user: currentUser } = useAuth();
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        // --- LÓGICA DE BLOQUEO ---
        // Obtener la lista de usuarios que he bloqueado y que me han bloqueado
        const blockedUsersRef = collection(db, 'users', currentUser.uid, 'blockedUsers');
        const blockedByRef = collection(db, 'users', currentUser.uid, 'blockedBy');
        const [blockedUsersSnap, blockedBySnap] = await Promise.all([
            getDocs(blockedUsersRef),
            getDocs(blockedByRef)
        ]);
        const blockedIds = new Set([
            ...blockedUsersSnap.docs.map(doc => doc.id),
            ...blockedBySnap.docs.map(doc => doc.id)
        ]);

        // 1. Obtener la lista de usuarios que sigo
        const followingRef = collection(db, 'users', currentUser.uid, 'following');
        const followingSnap = await getDocs(query(followingRef, limit(10))); // Limitamos para no hacer demasiadas lecturas
        const followingIds = followingSnap.docs.map(doc => doc.id);

        if (followingIds.length === 0) {
            setLoading(false);
            return; // No hay base para sugerir si no sigue a nadie
        }

        // 2. Obtener la lista de usuarios que ELLOS siguen (amigos de amigos)
        const friendsOfFriendsIds = new Set<string>();
        for (const userId of followingIds) {
          const friendsFollowingRef = collection(db, 'users', userId, 'following');
          const friendsFollowingSnap = await getDocs(query(friendsFollowingRef, limit(5)));
          friendsFollowingSnap.docs.forEach(doc => friendsOfFriendsIds.add(doc.id));
        }

        // 3. Filtrar la lista: quitarme a mí, a los que ya sigo y a los bloqueados
        const myIdAndFollowing = new Set([currentUser.uid, ...followingIds]);
        const finalSuggestionIds = [...friendsOfFriendsIds].filter(id => !myIdAndFollowing.has(id) && !blockedIds.has(id));

        if (finalSuggestionIds.length === 0) {
            setLoading(false);
            return;
        }

        // 4. Obtener los datos de perfil de los IDs sugeridos
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where(documentId(), 'in', finalSuggestionIds.slice(0, 5))); // Limitar a 5 sugerencias finales
        const usersSnap = await getDocs(q);
        
        const suggestedUsersPromises = usersSnap.docs.map(async (userDoc) => {
            const userData = userDoc.data();
            let petName = userData.displayName || 'Usuario Anónimo';
            if (userData.primaryPetId) {
                const petDocRef = doc(db, 'users', userDoc.id, 'pets', userData.primaryPetId);
                const petSnap = await getDoc(petDocRef);
                if (petSnap.exists()) {
                    petName = petSnap.data().name;
                }
            }
            return {
                id: userDoc.id,
                petName: petName,
            };
        });

        const suggestedUsers = await Promise.all(suggestedUsersPromises);
        setSuggestions(suggestedUsers);

      } catch (error) {
        console.error("Error fetching suggestions: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentUser]);

  if (loading || suggestions.length === 0) {
    return null; // No mostrar nada si está cargando o no hay sugerencias
  }

  return (
    <div className="suggested-follows-container">
      <h4>A quién seguir</h4>
      {suggestions.map(user => (
        <div key={user.id} className="suggested-item">
          <Link href={`/profile/${user.id}`}>
            {user.petName}
          </Link>
          <FollowButton targetUserId={user.id} />
        </div>
      ))}
    </div>
  );
}
