'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  doc, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
// // import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: 'page_view' | 'post_created' | 'post_liked' | 'post_shared' | 'comment_created' | 'follow' | 'unfollow' | 'moment_created' | 'snippet_created' | 'product_created' | 'product_purchased' | 'circle_joined' | 'circle_left' | 'search' | 'profile_view';
  eventData: {
    page?: string;
    postId?: string;
    commentId?: string;
    targetUserId?: string;
    circleId?: string;
    productId?: string;
    searchTerm?: string;
    category?: string;
    value?: number;
    metadata?: Record<string, any>;
  };
  timestamp: Date;
  sessionId: string;
  userAgent: string;
  ipAddress?: string;
  location?: {
    country: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

export interface UserAnalytics {
  userId: string;
  userName: string;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalFollowers: number;
  totalFollowing: number;
  totalMoments: number;
  totalSnippets: number;
  totalProducts: number;
  totalCircles: number;
  engagementRate: number;
  reach: number;
  impressions: number;
  profileViews: number;
  lastActive: Date;
  createdAt: Date;
}

export interface ContentAnalytics {
  contentId: string;
  contentType: 'post' | 'moment' | 'snippet' | 'product';
  authorId: string;
  authorName: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  reach: number;
  impressions: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface PlatformAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalMoments: number;
  totalSnippets: number;
  totalProducts: number;
  totalCircles: number;
  totalOrders: number;
  revenue: number;
  engagementRate: number;
  averageSessionDuration: number;
  bounceRate: number;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  topLocations: Array<{
    location: string;
    count: number;
    percentage: number;
  }>;
  growthRate: number;
  retentionRate: number;
}

export function useAnalytics() {
  //   // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [contentAnalytics, setContentAnalytics] = useState<ContentAnalytics[]>([]);
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics | null>(null);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserAnalytics(null);
      setContentAnalytics([]);
      setPlatformAnalytics(null);
      setRecentEvents([]);
      setLoading(false);
      return;
    }

        setLoading(true);
    setError(null);

    // Cargar analytics del usuario
    loadUserAnalytics();
    loadContentAnalytics();
    loadPlatformAnalytics();
    loadRecentEvents();

    setLoading(false);
  }, [user]);

  const loadUserAnalytics = async () => {
    if (!user) return;

    try {
      // Obtener estadísticas del usuario
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserAnalytics({
          userId: user.uid,
          userName: userData.name || 'Usuario Anónimo',
          totalPosts: userData.postsCount || 0,
          totalLikes: userData.likesCount || 0,
          totalComments: userData.commentsCount || 0,
          totalShares: userData.sharesCount || 0,
          totalFollowers: userData.followersCount || 0,
          totalFollowing: userData.followingCount || 0,
          totalMoments: userData.momentsCount || 0,
          totalSnippets: userData.snippetsCount || 0,
          totalProducts: userData.productsCount || 0,
          totalCircles: userData.circlesCount || 0,
          engagementRate: userData.engagementRate || 0,
          reach: userData.reach || 0,
          impressions: userData.impressions || 0,
          profileViews: userData.profileViews || 0,
          lastActive: userData.lastActive?.toDate() || new Date(),
          createdAt: userData.createdAt?.toDate() || new Date(),
        });
      }
    } catch (error) {
      console.error('Error loading user analytics:', error);
    }
  };

  const loadContentAnalytics = async () => {
    if (!user) return;

    try {
      // Obtener analytics de contenido del usuario
      const postsQuery = query(
        collection(db, 'posts'),
        where('authorId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const postsSnapshot = await getDocs(postsQuery);
      const contentData: ContentAnalytics[] = [];

      for (const postDoc of postsSnapshot.docs) {
        const postData = postDoc.data();
        contentData.push({
          contentId: postDoc.id,
          contentType: 'post',
          authorId: postData.authorId,
          authorName: postData.authorName || 'Usuario Anónimo',
          title: postData.content?.substring(0, 50) + '...' || 'Sin título',
          views: postData.viewsCount || 0,
          likes: postData.likesCount || 0,
          comments: postData.commentsCount || 0,
          shares: postData.sharesCount || 0,
          engagement: (postData.likesCount || 0) + (postData.commentsCount || 0) + (postData.sharesCount || 0),
          reach: postData.reach || 0,
          impressions: postData.impressions || 0,
          createdAt: postData.createdAt?.toDate() || new Date(),
          lastUpdated: postData.updatedAt?.toDate() || new Date(),
        });
      }

      setContentAnalytics(contentData);
    } catch (error) {
      console.error('Error loading content analytics:', error);
    }
  };

  const loadPlatformAnalytics = async () => {
    try {
      // Obtener estadísticas generales de la plataforma
      const usersQuery = query(collection(db, 'users'));
      const postsQuery = query(collection(db, 'posts'));
      const momentsQuery = query(collection(db, 'moments'));
      const snippetsQuery = query(collection(db, 'snippets'));
      const productsQuery = query(collection(db, 'products'));
      const circlesQuery = query(collection(db, 'circles'));
      const ordersQuery = query(collection(db, 'orders'));

      const [usersSnapshot, postsSnapshot, momentsSnapshot, snippetsSnapshot, productsSnapshot, circlesSnapshot, ordersSnapshot] = await Promise.all([
        getDocs(usersQuery),
        getDocs(postsQuery),
        getDocs(momentsQuery),
        getDocs(snippetsQuery),
        getDocs(productsQuery),
        getDocs(circlesQuery),
        getDocs(ordersQuery),
      ]);

      const totalUsers = usersSnapshot.size;
      const totalPosts = postsSnapshot.size;
      const totalMoments = momentsSnapshot.size;
      const totalSnippets = snippetsSnapshot.size;
      const totalProducts = productsSnapshot.size;
      const totalCircles = circlesSnapshot.size;
      const totalOrders = ordersSnapshot.size;

      // Calcular revenue
      let revenue = 0;
      ordersSnapshot.forEach(orderDoc => {
        const orderData = orderDoc.data();
        revenue += orderData.totalPrice || 0;
      });

      // Calcular engagement rate
      let totalEngagement = 0;
      postsSnapshot.forEach(postDoc => {
        const postData = postDoc.data();
        totalEngagement += (postData.likesCount || 0) + (postData.commentsCount || 0) + (postData.sharesCount || 0);
      });

      const engagementRate = totalPosts > 0 ? (totalEngagement / totalPosts) : 0;

      setPlatformAnalytics({
        totalUsers,
        activeUsers: totalUsers, // Simplificado
        totalPosts,
        totalMoments,
        totalSnippets,
        totalProducts,
        totalCircles,
        totalOrders,
        revenue,
        engagementRate,
        averageSessionDuration: 0, // Simplificado
        bounceRate: 0, // Simplificado
        topCategories: [], // Simplificado
        topLocations: [], // Simplificado
        growthRate: 0, // Simplificado
        retentionRate: 0, // Simplificado
      });
    } catch (error) {
      console.error('Error loading platform analytics:', error);
    }
  };

  const loadRecentEvents = async () => {
    if (!user) return;

    try {
      const eventsQuery = query(
        collection(db, 'analytics_events'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(eventsQuery);
      const eventsData: AnalyticsEvent[] = [];

      snapshot.forEach((doc) => {
        const eventData = doc.data();
        eventsData.push({
          id: doc.id,
          userId: eventData.userId,
          eventType: eventData.eventType,
          eventData: eventData.eventData || {},
          timestamp: eventData.timestamp?.toDate() || new Date(),
          sessionId: eventData.sessionId || '',
          userAgent: eventData.userAgent || '',
          ipAddress: eventData.ipAddress,
          location: eventData.location || {},
        });
      });

      setRecentEvents(eventsData);
    } catch (error) {
      console.error('Error loading recent events:', error);
    }
  };

  const trackEvent = async (eventType: AnalyticsEvent['eventType'], eventData: AnalyticsEvent['eventData']) => {
    if (!user) return;

    try {
      const newEvent = {
        userId: user.uid,
        eventType,
        eventData,
        timestamp: Timestamp.now(),
        sessionId: generateSessionId(),
        userAgent: navigator.userAgent,
        ipAddress: '', // Se llenaría con el IP real
        location: {}, // Se llenaría con la ubicación real
      };

      await addDoc(collection(db, 'analytics_events'), newEvent);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const getEventTypeLabel = (eventType: AnalyticsEvent['eventType']) => {
    const labels: { [key: string]: string } = {
      'page_view': 'Vista de página',
      'post_created': 'Post creado',
      'post_liked': 'Post likeado',
      'post_shared': 'Post compartido',
      'comment_created': 'Comentario creado',
      'follow': 'Seguir usuario',
      'unfollow': 'Dejar de seguir',
      'moment_created': 'Moment creado',
      'snippet_created': 'Snippet creado',
      'product_created': 'Producto creado',
      'product_purchased': 'Producto comprado',
      'circle_joined': 'Círculo unido',
      'circle_left': 'Círculo abandonado',
      'search': 'Búsqueda',
      'profile_view': 'Vista de perfil',
    };
    return labels[eventType] || eventType;
  };

  const getEventIcon = (eventType: AnalyticsEvent['eventType']) => {
    const icons: { [key: string]: string } = {
      'page_view': '👁️',
      'post_created': '📝',
      'post_liked': '❤️',
      'post_shared': '📤',
      'comment_created': '💬',
      'follow': '👥',
      'unfollow': '👤',
      'moment_created': '⏰',
      'snippet_created': '🎬',
      'product_created': '🛍️',
      'product_purchased': '💰',
      'circle_joined': '🌟',
      'circle_left': '⭐',
      'search': '🔍',
      'profile_view': '👤',
    };
    return icons[eventType] || '📊';
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getEngagementRate = (likes: number, comments: number, shares: number, views: number) => {
    if (views === 0) return 0;
    return ((likes + comments + shares) / views * 100).toFixed(1);
  };

  return {
    userAnalytics,
    contentAnalytics,
    platformAnalytics,
    recentEvents,
    loading,
    error,
    trackEvent,
    getEventTypeLabel,
    getEventIcon,
    formatTimeAgo,
    formatNumber,
    getEngagementRate,
  };
}

// Hook para eventos de analytics
export const useAnalyticsEvents = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsRef = collection(db, 'analytics_events');
      const q = query(eventsRef, orderBy('timestamp', 'desc'), limit(100));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const eventsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AnalyticsEvent[];
        setEvents(eventsData);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      setError('Error al cargar eventos de analytics');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return {
    events,
    loading,
    error,
    loadEvents
  };
};

// Hook para dashboard de analytics
export const useAnalyticsDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simular datos del dashboard
      setDashboardData({
        totalUsers: 1250,
        totalPosts: 3400,
        totalLikes: 12500,
        totalComments: 3200
      });
      setLoading(false);
    } catch (err) {
      setError('Error al cargar datos del dashboard');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    loadDashboardData
  };
};
