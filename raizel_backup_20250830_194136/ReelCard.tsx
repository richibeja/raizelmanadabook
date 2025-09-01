'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import Reacciones from '@/components/Reacciones'; // Corrected Path
import ShareButton from '@/components/ShareButton'; // Corrected Path
import './ReelCard.css';

export interface Reel {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl?: string;
  videoUrl: string;
  description: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp;
}

interface ReelCardProps {
  reel: Reel;
}

export default function ReelCard({ reel }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoPress = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="reel-card">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="reel-video"
        loop
        onClick={handleVideoPress}
        playsInline // Importante para la reproducción automática en móviles
      />
      <div className="reel-overlay">
        <div className="reel-info">
          <Link href={`/profile/${reel.ownerId}`}>
            <strong>@{reel.ownerName}</strong>
          </Link>
          <p>{reel.description}</p>
        </div>
        <div className="reel-actions">
          <div className="action-button">
            {/* Asumimos que la colección de reels es 'reels' */}
            <Reacciones postId={reel.id} postOwnerId={reel.ownerId} initialLikesCount={reel.likesCount} />
          </div>
          <div className="action-button">
            {/* Placeholder para comentarios */}
            <button className="icon-button">💬 {reel.commentsCount}</button>
          </div>
          <div className="action-button">
            {/* El botón de compartir funciona aquí perfectamente */}
            <ShareButton contentId={reel.id} contentType="post" />
          </div>
        </div>
      </div>
    </div>
  );
}
