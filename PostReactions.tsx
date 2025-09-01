'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteDoc, writeBatch, increment, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './PostReactions.css';

const PET_REACTIONS = ['❤️', '🐾', '😂', '😮', '🥰'];

interface PostReactionsProps {
  postId: string;
  postOwnerId: string;
  initialReactionsCount: number;
}

export default function PostReactions({ postId, postOwnerId, initialReactionsCount }: PostReactionsProps) {
  const { user: currentUser } = useAuth();
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [reactionsCount, setReactionsCount] = useState(initialReactionsCount);
  const [isLoading, setIsLoading] = useState(true);
  const [showPalette, setShowPalette] = useState(false);
  const [currentUserPetName, setCurrentUserPetName] = useState('');

  // Fetch current user's pet name for notifications
  useEffect(() => {
    if (currentUser) {
      const fetchPetName = async () => {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().primaryPetId) {
          const petDoc = await getDoc(doc(db, 'users', currentUser.uid, 'pets', userDoc.data().primaryPetId));
          if (petDoc.exists()) {
            setCurrentUserPetName(petDoc.data().name);
          }
        }
      };
      fetchPetName();
    }
  }, [currentUser]);

  // Check if the user has already reacted to this post
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    const checkReactionStatus = async () => {
      const reactionDocRef = doc(db, 'posts', postId, 'reactions', currentUser.uid);
      const docSnap = await getDoc(reactionDocRef);
      if (docSnap.exists()) {
        setUserReaction(docSnap.data().reaction);
      } else {
        setUserReaction(null);
      }
      setIsLoading(false);
    };
    checkReactionStatus();
  }, [currentUser, postId]);

  const handleReaction = async (reaction: string) => {
    if (!currentUser || isLoading) return;
    setIsLoading(true);
    setShowPalette(false);

    const batch = writeBatch(db);
    const postRef = doc(db, 'posts', postId);
    const reactionRef = doc(db, 'posts', postId, 'reactions', currentUser.uid);

    const isNewReaction = !userReaction;

    setUserReaction(reaction);
    if (isNewReaction) {
      setReactionsCount(prev => prev + 1);
    }

    batch.set(reactionRef, { reaction, reactedAt: serverTimestamp() });
    if (isNewReaction) {
      batch.update(postRef, { likesCount: increment(1) }); // Using likesCount as reactionsCount
    }

    if (currentUser.uid !== postOwnerId) {
        const notificationRef = doc(collection(db, 'users', postOwnerId, 'notifications'));
        batch.set(notificationRef, {
            type: 'new_like',
            fromUserId: currentUser.uid,
            fromUserName: currentUserPetName || currentUser.displayName || 'Alguien',
            postId: postId,
            reaction: reaction,
            read: false,
            createdAt: serverTimestamp(),
        });
    }

    await batch.commit().catch(error => {
        console.error("Error sending reaction: ", error);
        setUserReaction(null);
        if (isNewReaction) setReactionsCount(prev => prev - 1);
    });
    setIsLoading(false);
  };

  const handleRemoveReaction = async () => {
    if (!currentUser || isLoading || !userReaction) return;
    setIsLoading(true);

    const batch = writeBatch(db);
    const postRef = doc(db, 'posts', postId);
    const reactionRef = doc(db, 'posts', postId, 'reactions', currentUser.uid);

    setUserReaction(null);
    setReactionsCount(prev => prev - 1);

    batch.delete(reactionRef);
    batch.update(postRef, { likesCount: increment(-1) });

    await batch.commit().catch(error => {
        console.error("Error removing reaction: ", error);
        setUserReaction(userReaction);
        setReactionsCount(prev => prev + 1);
    });
    setIsLoading(false);
  };

  return (
    <div className="post-reactions-container" onMouseEnter={() => setShowPalette(true)} onMouseLeave={() => setShowPalette(false)}>
      {showPalette && (
        <div className="reaction-palette">
          {PET_REACTIONS.map(emoji => (
            <button key={emoji} onClick={() => handleReaction(emoji)}>{emoji}</button>
          ))}
        </div>
      )}
      <button 
        onClick={userReaction ? handleRemoveReaction : () => setShowPalette(true)} 
        disabled={!currentUser || isLoading} 
        className={`main-reaction-btn ${userReaction ? 'reacted' : ''}`}
      >
        {userReaction ? <span>{userReaction} Te gusta</span> : 'Reaccionar'}
      </button>
      <span className="reactions-count">{reactionsCount}</span>
    </div>
  );
}
