'use client';
import { useState, useEffect } from 'react';

export interface Snippet {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  user_id: string;
  pet_id?: string;
  duration: number;
  views: number;
  likes: number;
  created_at: string;
}

export interface SnippetsFilters {
  duration?: 'short' | 'medium' | 'long';
  sort_by?: 'newest' | 'popular' | 'trending';
}

export const useSnippets = (filters?: SnippetsFilters) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/snippets');
        const result = await response.json();
        
        if (result.success) {
          setSnippets(result.data);
        } else {
          setError(result.message || 'Error al cargar snippets');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, [filters]);

  return { snippets, loading, error };
};
