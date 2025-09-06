'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
// import { useManadaBookAuth } from '@/contexts/ManadaBookAuthContext';

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  reportedUserName?: string;
  contentId: string;
  contentType: 'post' | 'comment' | 'moment' | 'snippet' | 'product' | 'user' | 'circle';
  reason: 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'violence' | 'hate_speech' | 'copyright' | 'other';
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  moderatorId?: string;
  moderatorName?: string;
  moderatorNotes?: string;
  actionTaken?: 'none' | 'warning' | 'content_removed' | 'user_suspended' | 'user_banned' | 'content_approved';
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  moderatorName: string;
  targetType: 'user' | 'content' | 'report';
  targetId: string;
  action: 'warn' | 'suspend' | 'ban' | 'remove_content' | 'approve_content' | 'dismiss_report';
  reason: string;
  duration?: number; // en días para suspensiones
  createdAt: Date;
}

export interface UserWarning {
  id: string;
  userId: string;
  userName: string;
  moderatorId: string;
  moderatorName: string;
  reason: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export function useModeration() {
  // const { user, userProfile } = useManadaBookAuth();
  const user = null;
  const userProfile = null;
  const [reports, setReports] = useState<Report[]>([]);
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);
  const [userWarnings, setUserWarnings] = useState<UserWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setReports([]);
      setMyReports([]);
      setPendingReports([]);
      setModerationActions([]);
      setUserWarnings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Query para obtener todos los reportes
    const reportsQuery = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      reportsQuery,
      async (snapshot) => {
        try {
          const reportsData: Report[] = [];
          
          for (const docSnapshot of snapshot.docs) {
            const reportData = docSnapshot.data();
            
            // Obtener información del reporter
            const reporterDoc = await doc(db, 'users', reportData.reporterId).get();
            let reporterName = 'Usuario Anónimo';
            
            if (reporterDoc.exists()) {
              const reporterData = reporterDoc.data();
              reporterName = reporterData.name || 'Usuario Anónimo';
            }

            // Obtener información del usuario reportado
            let reportedUserName = '';
            if (reportData.reportedUserId) {
              const reportedUserDoc = await doc(db, 'users', reportData.reportedUserId).get();
              if (reportedUserDoc.exists()) {
                const reportedUserData = reportedUserDoc.data();
                reportedUserName = reportedUserData.name || 'Usuario Anónimo';
              }
            }

            // Obtener información del moderador
            let moderatorName = '';
            if (reportData.moderatorId) {
              const moderatorDoc = await doc(db, 'users', reportData.moderatorId).get();
              if (moderatorDoc.exists()) {
                const moderatorData = moderatorDoc.data();
                moderatorName = moderatorData.name || 'Moderador';
              }
            }

            reportsData.push({
              id: docSnapshot.id,
              reporterId: reportData.reporterId,
              reporterName,
              reportedUserId: reportData.reportedUserId || '',
              reportedUserName,
              contentId: reportData.contentId || '',
              contentType: reportData.contentType || 'post',
              reason: reportData.reason || 'other',
              description: reportData.description || '',
              status: reportData.status || 'pending',
              priority: reportData.priority || 'medium',
              moderatorId: reportData.moderatorId || '',
              moderatorName,
              moderatorNotes: reportData.moderatorNotes || '',
              actionTaken: reportData.actionTaken || 'none',
              createdAt: reportData.createdAt?.toDate() || new Date(),
              updatedAt: reportData.updatedAt?.toDate() || new Date(),
              resolvedAt: reportData.resolvedAt?.toDate(),
            });
          }

          setReports(reportsData);
          
          // Filtrar reportes del usuario
          const userReports = reportsData.filter(report => 
            report.reporterId === user.uid
          );
          setMyReports(userReports);
          
          // Filtrar reportes pendientes
          const pending = reportsData.filter(report => 
            report.status === 'pending' || report.status === 'reviewing'
          );
          setPendingReports(pending);
          
          setLoading(false);
        } catch (err) {
          console.error('Error fetching reports:', err);
          setError('Error al cargar los reportes');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in reports listener:', err);
        setError('Error al cargar los reportes');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createReport = async (reportData: {
    reportedUserId?: string;
    contentId: string;
    contentType: Report['contentType'];
    reason: Report['reason'];
    description: string;
  }) => {
    if (!user) throw new Error('Usuario no autenticado');
    if (!reportData.contentId.trim()) throw new Error('ID de contenido requerido');
    if (!reportData.description.trim()) throw new Error('Descripción requerida');

    try {
      const newReport = {
        reporterId: user.uid,
        reportedUserId: reportData.reportedUserId || '',
        contentId: reportData.contentId,
        contentType: reportData.contentType,
        reason: reportData.reason,
        description: reportData.description.trim(),
        status: 'pending',
        priority: 'medium',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'reports'), newReport);
      return docRef.id;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  };

  const updateReportStatus = async (reportId: string, status: Report['status'], moderatorNotes?: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const reportRef = doc(db, 'reports', reportId);
      const updates: any = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (status === 'resolved') {
        updates.resolvedAt = Timestamp.now();
        updates.moderatorId = user.uid;
        updates.moderatorName = userProfile?.name || 'Moderador';
      }

      if (moderatorNotes) {
        updates.moderatorNotes = moderatorNotes;
      }

      await updateDoc(reportRef, updates);
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  };

  const takeModerationAction = async (actionData: {
    targetType: ModerationAction['targetType'];
    targetId: string;
    action: ModerationAction['action'];
    reason: string;
    duration?: number;
  }) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const newAction = {
        moderatorId: user.uid,
        moderatorName: userProfile?.name || 'Moderador',
        targetType: actionData.targetType,
        targetId: actionData.targetId,
        action: actionData.action,
        reason: actionData.reason,
        duration: actionData.duration || 0,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'moderation_actions'), newAction);
      return docRef.id;
    } catch (error) {
      console.error('Error taking moderation action:', error);
      throw error;
    }
  };

  const issueWarning = async (warningData: {
    userId: string;
    reason: string;
    description: string;
    severity: UserWarning['severity'];
    duration?: number; // en días
  }) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const expiresAt = warningData.duration 
        ? new Date(Date.now() + warningData.duration * 24 * 60 * 60 * 1000)
        : undefined;

      const newWarning = {
        userId: warningData.userId,
        userName: '', // Se llenará automáticamente
        moderatorId: user.uid,
        moderatorName: userProfile?.name || 'Moderador',
        reason: warningData.reason,
        description: warningData.description,
        severity: warningData.severity,
        isActive: true,
        createdAt: Timestamp.now(),
        expiresAt: expiresAt ? Timestamp.fromDate(expiresAt) : null,
      };

      const docRef = await addDoc(collection(db, 'user_warnings'), newWarning);
      return docRef.id;
    } catch (error) {
      console.error('Error issuing warning:', error);
      throw error;
    }
  };

  const getReportReasons = () => {
    return [
      { value: 'spam', label: 'Spam', description: 'Contenido repetitivo o no deseado' },
      { value: 'harassment', label: 'Acoso', description: 'Comportamiento intimidatorio o abusivo' },
      { value: 'inappropriate', label: 'Inapropiado', description: 'Contenido inadecuado para la plataforma' },
      { value: 'fake', label: 'Falso', description: 'Información falsa o engañosa' },
      { value: 'violence', label: 'Violencia', description: 'Contenido violento o peligroso' },
      { value: 'hate_speech', label: 'Discurso de odio', description: 'Contenido que promueve el odio' },
      { value: 'copyright', label: 'Derechos de autor', description: 'Uso no autorizado de contenido protegido' },
      { value: 'other', label: 'Otro', description: 'Otra razón no especificada' },
    ];
  };

  const getPriorityColor = (priority: Report['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'reviewing':
        return 'text-blue-600 bg-blue-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'dismissed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

  const getReportsByStatus = (status: Report['status']) => {
    return reports.filter(report => report.status === status);
  };

  const getReportsByPriority = (priority: Report['priority']) => {
    return reports.filter(report => report.priority === priority);
  };

  const getReportsByReason = (reason: Report['reason']) => {
    return reports.filter(report => report.reason === reason);
  };

  return {
    reports,
    myReports,
    pendingReports,
    moderationActions,
    userWarnings,
    loading,
    error,
    createReport,
    updateReportStatus,
    takeModerationAction,
    issueWarning,
    getReportReasons,
    getPriorityColor,
    getStatusColor,
    formatTimeAgo,
    getReportsByStatus,
    getReportsByPriority,
    getReportsByReason,
  };
}

// Hook para reportes
export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      // Simular datos de reportes
      setReports([]);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar reportes');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return {
    reports,
    loading,
    error,
    loadReports
  };
};

// Hook para acciones de moderación
export const useModerationActions = () => {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActions = async () => {
    try {
      setLoading(true);
      // Simular datos de acciones
      setActions([]);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar acciones de moderación');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  return {
    actions,
    loading,
    error,
    loadActions
  };
};
