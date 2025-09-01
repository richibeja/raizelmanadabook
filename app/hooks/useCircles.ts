'use client';
import { useState, useEffect } from 'react';

export interface Circle {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  max_members?: number;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useCircles = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/circles');
        const result = await response.json();
        
        if (result.success) {
          setCircles(result.data);
        } else {
          setError(result.message || 'Error al cargar círculos');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchCircles();
  }, []);

  return { circles, loading, error };
};
