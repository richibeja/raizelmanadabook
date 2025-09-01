'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';
import Reacciones from './Reacciones'; // This component is generic enough
import ShareButton from './ShareButton'; // This component is generic enough
import './ClipCard.css'; // Renamed CSS file

export interface Clip { // Renamed interface
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

interface ClipCardProps {
  clip: Clip;
  isVisible: boolean;
}

export default function ClipCard({ clip, isVisible }: ClipCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => setIsPlaying(false));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isVisible]);

  const handleVideoPress = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="clip-card">
      <video
        ref={videoRef}
        src={clip.videoUrl}
        className="clip-video"
        loop
        onClick={handleVideoPress}
        playsInline
      />
      <div className="clip-overlay">
        <div className="clip-info">
          <Link href={`/profile/${clip.ownerId}`}>
            <strong>@{clip.ownerName}</strong>
          </Link>
          <p>{clip.description}</p>
        </div>
        <div className="clip-actions">
          <div className="action-button">
            <Reacciones postId={clip.id} postOwnerId={clip.ownerId} initialLikesCount={clip.likesCount} />
          </div>
          <div className="action-button">
            <button className="icon-button">💬 {clip.commentsCount}</button>
          </div>
          <div className="action-button">
            <ShareButton contentId={clip.id} contentType="post" />
          </div>
        </div>
      </div>
    </div>
  );
}
