'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Link from 'next/link';
import MomentoReactions from './MomentoReactions';
import './MomentosViewer.css'; 

interface Momento {
  id: string;
  videoUrl: string;
  ownerId: string;
}

interface PetInfo {
    name: string;
    avatarUrl: string;
}

interface MomentosViewerProps {
  userId: string;
  onClose: () => void;
}

export default function MomentosViewer({ userId, onClose }: MomentosViewerProps) {
  const [momentos, setMomentos] = useState<Momento[]>([]);
  const [currentMomentoIndex, setCurrentMomentoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMomentosAndPetInfo = async () => {
      setLoading(true);
      try {
        // Fetch Pet Info
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().primaryPetId) {
            const petDocRef = doc(db, 'users', userId, 'pets', userDocSnap.data().primaryPetId);
            const petSnap = await getDoc(petDocRef);
            if (petSnap.exists()) {
                const petData = petSnap.data();
                setPetInfo({ name: petData.name, avatarUrl: petData.avatarUrl });
            }
        }

        // Fetch Momentos
        const twentyFourHoursAgo = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
        const q = query(
          collection(db, 'users', userId, 'momentos'),
          where('createdAt', '>=', twentyFourHoursAgo),
          orderBy('createdAt', 'asc')
        );
        const snapshot = await getDocs(q);
        const userMomentos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Momento[];
        setMomentos(userMomentos);
      } catch (error) {
          console.error("Error fetching momentos data: ", error);
      } finally {
          setLoading(false);
      }
    };
    fetchMomentosAndPetInfo();
  }, [userId]);

  useEffect(() => {
    const videoElement = videoRef.current;
    const progressElement = progressRef.current;

    const handleTimeUpdate = () => {
      if (videoElement && progressElement) {
        const progress = (videoElement.currentTime / videoElement.duration) * 100;
        progressElement.style.width = `${progress}%`;
      }
    };

    const handleVideoEnd = () => {
      if (currentMomentoIndex < momentos.length - 1) {
        setCurrentMomentoIndex(prev => prev + 1);
      } else {
        onClose();
      }
    };

    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [currentMomentoIndex, momentos.length, onClose]);

  const goToNext = () => {
    if (currentMomentoIndex < momentos.length - 1) {
      setCurrentMomentoIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentMomentoIndex > 0) {
      setCurrentMomentoIndex(prev => prev - 1);
    }
  };

  if (loading) return <div className="momentos-viewer-overlay"><p>Cargando...</p></div>;
  if (momentos.length === 0) {
    onClose();
    return null;
  }

  return (
    <div className="momentos-viewer-overlay" onClick={onClose}>
      <div className="momentos-viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
            <div className="progress-bar-container">
                {momentos.map((_, index) => (
                    <div key={index} className="progress-segment">
                        <div className="progress-fill" style={{ width: index < currentMomentoIndex ? '100%' : (index === currentMomentoIndex ? '0%' : '0%') }} ref={index === currentMomentoIndex ? progressRef : null}></div>
                    </div>
                ))}
            </div>
            {petInfo && (
                <div className="pet-info-header">
                    <img src={petInfo.avatarUrl} alt={petInfo.name} className="pet-avatar-small" />
                    <Link href={`/profile/${userId}`}><strong>{petInfo.name}</strong></Link>
                </div>
            )}
        </div>
        <video ref={videoRef} src={momentos[currentMomentoIndex].videoUrl} autoPlay playsInline />
        <div className="viewer-footer">
            <input type="text" placeholder="Enviar un mensaje..." className="momento-comment-input" />
            <MomentoReactions 
                momentoId={momentos[currentMomentoIndex].id} 
                ownerId={userId}
                fromPetName={petInfo?.name || 'Alguien'}
            />
        </div>
        <button className="nav-button prev" onClick={goToPrev}>‹</button>
        <button className="nav-button next" onClick={goToNext}>›</button>
        <button className="close-viewer-button" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
}
