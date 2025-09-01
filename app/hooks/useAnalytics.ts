'use client';
import { useState, useEffect } from 'react';

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id?: string;
  pet_id?: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface AnalyticsMetrics {
  total_users: number;
  total_posts: number;
  total_interactions: number;
  daily_active_users: number;
  weekly_growth: number;
}

export const useAnalyticsEvents = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics/events');
        const result = await response.json();
        
        if (result.success) {
          setEvents(result.data);
        } else {
          setError(result.message || 'Error al cargar eventos');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

export const useAnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics/metrics');
        const result = await response.json();
        
        if (result.success) {
          setMetrics(result.data);
        } else {
          setError(result.message || 'Error al cargar métricas');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
};
