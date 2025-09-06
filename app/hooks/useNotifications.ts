'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'circle_invite' | 'moment_expired' | 'snippet_trending' | 'system';
  title: string;
  message: string;
  data?: {
    postId?: string;
    commentId?: string;
    circleId?: string;
    momentId?: string;
    snippetId?: string;
    fromUserId?: string;
    fromUserName?: string;
    fromUserAvatar?: string;
  };
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export function useNotifications() {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener notificaciones del usuario
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        try {
          const notificationsData: Notification[] = [];
          let unread = 0;
          
          snapshot.forEach((doc) => {
            const notificationData = doc.data();
            const notification: Notification = {
              id: doc.id,
              userId: notificationData.userId,
              type: notificationData.type,
              title: notificationData.title || '',
              message: notificationData.message || '',
              data: notificationData.data || {},
              isRead: notificationData.isRead || false,
              createdAt: notificationData.createdAt?.toDate() || new Date(),
              readAt: notificationData.readAt?.toDate(),
              priority: notificationData.priority || 'medium',
              actionUrl: notificationData.actionUrl,
            };
            
            notificationsData.push(notification);
            if (!notification.isRead) {
              unread++;
            }
          });

          setNotifications(notificationsData);
          setUnreadCount(unread);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching notifications:', err);
          setError('Error al cargar las notificaciones');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in notifications listener:', err);
        setError('Error al cargar las notificaciones');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      const batch = unreadNotifications.map(notification => 
        updateDoc(doc(db, 'notifications', notification.id), {
          isRead: true,
          readAt: Timestamp.now(),
        })
      );
      
      await Promise.all(batch);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  const createNotification = async (notificationData: {
    userId: string;
    type: Notification['type'];
    title: string;
    message: string;
    data?: Notification['data'];
    priority?: Notification['priority'];
    actionUrl?: string;
  }) => {
    try {
      const newNotification = {
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data || {},
        isRead: false,
        createdAt: Timestamp.now(),
        priority: notificationData.priority || 'medium',
        actionUrl: notificationData.actionUrl,
      };

      const docRef = await addDoc(collection(db, 'notifications'), newNotification);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👥';
      case 'mention':
        return '📢';
      case 'circle_invite':
        return '🌟';
      case 'moment_expired':
        return '⏰';
      case 'snippet_trending':
        return '🔥';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return 'text-red-500';
      case 'comment':
        return 'text-blue-500';
      case 'follow':
        return 'text-green-500';
      case 'mention':
        return 'text-purple-500';
      case 'circle_invite':
        return 'text-yellow-500';
      case 'moment_expired':
        return 'text-gray-500';
      case 'snippet_trending':
        return 'text-orange-500';
      case 'system':
        return 'text-indigo-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-gray-300';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString('es-ES');
  };

  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.isRead);
  };

  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  };

  const getHighPriorityNotifications = () => {
    return notifications.filter(n => n.priority === 'high' && !n.isRead);
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    getNotificationIcon,
    getNotificationColor,
    getPriorityColor,
    formatTimeAgo,
    getUnreadNotifications,
    getNotificationsByType,
    getHighPriorityNotifications,
  };
}
