'use client';

import Link from 'next/link';
import { Timestamp } from 'firebase/firestore'; // Assuming Timestamp is used for createdAt

interface Notification {
  type: 'new_follower' | 'new_like' | 'new_comment' | 'momento_reaction' | 'post_mention';
  fromUserId: string;
  fromUserName: string;
  reaction?: string; // For new_like
  postId?: string; // For new_like, new_comment, post_mention
  commentText?: string; // For new_comment
  emoji?: string; // For momento_reaction
  read: boolean;
  createdAt: Timestamp;
}

import './NotificationItem.css';

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const renderContent = () => {
    switch (notification.type) {
      case 'new_follower':
        return (
          <p>
            <Link href={`/profile/${notification.fromUserId}`}><strong>{notification.fromUserName}</strong></Link> ha comenzado a seguirte.
          </p>
        );
      case 'new_like':
        return (
          <p>
            <Link href={`/profile/${notification.fromUserId}`}><strong>{notification.fromUserName}</strong></Link> ha reaccionado con un {notification.reaction || '❤️'} a tu <Link href={`/posts/${notification.postId}`}>publicación</Link>.
          </p>
        );
      case 'new_comment':
        return (
          <p>
            <Link href={`/profile/${notification.fromUserId}`}><strong>{notification.fromUserName}</strong></Link> ha comentado en tu <Link href={`/posts/${notification.postId}`}>publicación</Link>: "{notification.commentText}"
          </p>
        );
      case 'momento_reaction':
        return (
          <p>
            <Link href={`/profile/${notification.fromUserId}`}><strong>{notification.fromUserName}</strong></Link> ha reaccionado con un {notification.emoji} a tu Momento.
          </p>
        );
      case 'post_mention':
        return (
          <p>
            <Link href={`/profile/${notification.fromUserId}`}><strong>{notification.fromUserName}</strong></Link> te ha mencionado en una <Link href={`/posts/${notification.postId}`}>publicación</Link>.
          </p>
        );
      default:
        return <p>Tienes una nueva notificación.</p>;
    }
  };

  return (
    <div className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
      {renderContent()}
      <small className="notification-time">
        {notification.createdAt.toDate().toLocaleString('es-CO')}
      </small>
    </div>
  );
}
