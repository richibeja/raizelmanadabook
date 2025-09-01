'use client';

import { useState } from 'react';
import { doc, setDoc, serverTimestamp, collection, writeBatch, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './MomentoReactions.css';

const PET_EMOJIS = ['🐾', '❤️', '😂', '😮', '🥰'];

interface MomentoReactionsProps {
  momentoId: string;
  ownerId: string;
  fromPetName: string;
}

export default function MomentoReactions({ momentoId, ownerId, fromPetName }: MomentoReactionsProps) {
  const { user: currentUser } = useAuth();
  const [showPalette, setShowPalette] = useState(false);

  const handleReaction = async (emoji: string) => {
    if (!currentUser) return;
    setShowPalette(false);

    const batch = writeBatch(db);

    // 1. Set the user's reaction
    const reactionRef = doc(db, 'users', ownerId, 'momentos', momentoId, 'reactions', currentUser.uid);
    batch.set(reactionRef, { emoji, reactedAt: serverTimestamp() });

    // 2. Increment total reaction count on the momento
    const momentoRef = doc(db, 'users', ownerId, 'momentos', momentoId);
    batch.update(momentoRef, { reactionsCount: increment(1) });

    // 3. Send notification
    if (currentUser.uid !== ownerId) {
        const notificationRef = doc(collection(db, 'users', ownerId, 'notifications'));
        batch.set(notificationRef, {
            type: 'momento_reaction',
            fromUserId: currentUser.uid,
            fromUserName: fromPetName,
            momentoId: momentoId,
            emoji: emoji,
            read: false,
            createdAt: serverTimestamp(),
        });
    }

    await batch.commit().catch(error => console.error("Error sending reaction: ", error));
  };

  return (
    <div className="momento-reactions-container">
      {showPalette && (
        <div className="emoji-palette">
          {PET_EMOJIS.map(emoji => (
            <button key={emoji} onClick={() => handleReaction(emoji)}>{emoji}</button>
          ))}
        </div>
      )}
      <button className="main-reaction-button" onClick={() => setShowPalette(!showPalette)}>
        React
      </button>
    </div>
  );
}
