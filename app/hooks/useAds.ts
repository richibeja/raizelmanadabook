'use client';
import { useState, useEffect } from 'react';

export interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  target_audience: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'completed';
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
}

export interface AdsFilters {
  status?: string;
  target_audience?: string;
  min_budget?: number;
  max_budget?: number;
}

export const useAds = (filters?: AdsFilters) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ads');
        const result = await response.json();
        
        if (result.success) {
          setAds(result.data);
        } else {
          setError(result.message || 'Error al cargar anuncios');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [filters]);

  return { ads, loading, error };
};
