'use client';
import { useState, useEffect } from 'react';

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string;
  reported_pet_id?: string;
  reported_post_id?: string;
  report_type: 'spam' | 'inappropriate' | 'harassment' | 'fake_profile' | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  moderator_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ModerationAction {
  id: string;
  moderator_id: string;
  target_type: 'user' | 'pet' | 'post' | 'comment';
  target_id: string;
  action_type: 'warning' | 'suspension' | 'ban' | 'content_removal';
  reason: string;
  duration_days?: number;
  created_at: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reports');
        const result = await response.json();
        
        if (result.success) {
          setReports(result.data);
        } else {
          setError(result.message || 'Error al cargar reportes');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { reports, loading, error };
};

export const useModerationActions = () => {
  const [actions, setActions] = useState<ModerationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/moderation/actions');
        const result = await response.json();
        
        if (result.success) {
          setActions(result.data);
        } else {
          setError(result.message || 'Error al cargar acciones');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  return { actions, loading, error };
};
