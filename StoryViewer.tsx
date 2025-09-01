
'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, collection, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './StoryViewer.css'; // Importar el archivo CSS

// Definimos los tipos de datos que el visor espera
interface Story {
  id: string;
  ownerId: string;
  ownerName: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
}

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex?: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialStoryIndex = 0, onClose }: StoryViewerProps) {
  const { user: currentUser } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reactionAnimation, setReactionAnimation] = useState<{ emoji: string; id: number }[]>([]);
  const animationIdRef = useRef(0);

  const currentStory = stories[currentIndex];

  // Lógica para avanzar a la siguiente historia
  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose(); // Si es la última, cerrar el visor
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  // Efecto para manejar la barra de progreso y el avance automático
  useEffect(() => {
    setProgress(0); // Reiniciar progreso al cambiar de historia
    if (currentStory.mediaType === 'image') {
      const timer = setTimeout(goToNext, 7000); // 7 segundos para imágenes
      return () => clearTimeout(timer);
    }
  }, [currentIndex, stories]);

  // Efecto para la barra de progreso en tiempo real
   useEffect(() => {
    if (currentStory.mediaType === 'image') {
        const interval = setInterval(() => {
            setProgress(p => p + 100 / (7000 / 50));
        }, 50);
        return () => clearInterval(interval);
    }
  }, [currentIndex, stories]);

  const handleVideoEnd = () => {
    goToNext();
  };

  const handleReaction = async (emoji: string) => {
    if (!currentUser || !currentStory) return;

    // Animación visual
    animationIdRef.current += 1;
    const newAnimation = { emoji, id: animationIdRef.current };
    setReactionAnimation(prev => [...prev, newAnimation]);
    setTimeout(() => {
        setReactionAnimation(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 1000); // Duración de la animación

    // Lógica de base de datos
    const batch = writeBatch(db);

    // 1. Guardar la reacción en la historia
    const reactionRef = doc(collection(db, 'stories', currentStory.id, 'reactions'));
    batch.set(reactionRef, {
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email,
      emoji: emoji,
      createdAt: serverTimestamp(),
    });

    // 2. Crear notificación para el dueño de la historia (si no es el mismo usuario)
    if (currentUser.uid !== currentStory.ownerId) {
      const notificationRef = doc(collection(db, 'users', currentStory.ownerId, 'notifications'));
      batch.set(notificationRef, {
        type: 'story_reaction',
        fromUserId: currentUser.uid,
        fromUserName: currentUser.displayName || currentUser.email,
        storyId: currentStory.id,
        emoji: emoji,
        read: false,
        createdAt: serverTimestamp(),
      });
    }

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error saving reaction: ", error);
    }
  };

  return (
    <div className="story-viewer-overlay">
      <div className="story-viewer-header">
        <div className="story-viewer-progress-container">
            {stories.map((_, index) => (
                <div key={index} className="story-viewer-progress-bar">
                    <div style={{width: `${index === currentIndex ? progress : (index < currentIndex ? 100 : 0)}%`}} className="story-viewer-progress"></div>
                </div>
            ))}
        </div>
        <div className="story-viewer-user-info">{currentStory.ownerName}</div>
        <button onClick={onClose} className="story-viewer-close-button">X</button>
      </div>

      <div className="story-viewer-content">
        {currentStory.mediaType === 'image' ? (
          <img src={currentStory.mediaUrl} className="story-viewer-media" alt="Story" />
        ) : (
          <video
            ref={videoRef}
            src={currentStory.mediaUrl}
            className="story-viewer-media"
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
          />
        )}
        {reactionAnimation.map(anim => (
            <span key={anim.id} className="story-viewer-reaction-animation">{anim.emoji}</span>
        ))}
      </div>

      <div onClick={goToPrevious} className="story-viewer-nav-button prev"></div>
      <div onClick={goToNext} className="story-viewer-nav-button next"></div>

      {/* Barra de Reacciones Rápidas */}
      <div className="story-viewer-reaction-bar">
        <button onClick={() => handleReaction('❤️')} className="story-viewer-reaction-button">❤️</button>
        <button onClick={() => handleReaction('😂')} className="story-viewer-reaction-button">😂</button>
        <button onClick={() => handleReaction('🔥')} className="story-viewer-reaction-button">🔥</button>
        <button onClick={() => handleReaction('🥰')} className="story-viewer-reaction-button">🥰</button>
      </div>
    </div>
  );
}
