'use client';
import { useState, useEffect } from 'react';
import { subscribeToAds, AdsFilters as FirebaseAdsFilters } from '../../lib/firebase';

// Mantener interface legada para compatibilidad
export interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  target_audience: string;
  budget: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'paused' | 'completed' | 'pending' | 'rejected';
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  total_spent?: number;
  payment_status?: string;
  creative_type?: string;
  campaign_name?: string;
  owner_username?: string;
  owner_verified?: boolean;
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
    setLoading(true);
    setError(null);

    // Convertir filtros al formato Firebase
    const firebaseFilters: FirebaseAdsFilters = {
      status: filters?.status,
    };

    // Suscripción en tiempo real a Firebase
    const unsubscribe = subscribeToAds(
      firebaseFilters,
      (firebaseAds) => {
        try {
          // Convertir anuncios de Firebase al formato legado
          const legacyAds: Ad[] = firebaseAds.map(ad => ({
            id: ad.id,
            title: ad.creative.title,
            description: ad.creative.description,
            image_url: ad.creative.imageUrl,
            target_audience: ad.targetAudience.species?.[0] || 'general',
            budget: ad.budget,
            start_date: ad.startDate.toISOString(),
            end_date: ad.endDate.toISOString(),
            status: ad.status,
            impressions: ad.impressions,
            clicks: ad.clicks,
            ctr: ad.ctr,
            cpc: ad.bidAmount,
            total_spent: ad.spend,
            payment_status: ad.status === 'active' ? 'paid' : 'pending',
            creative_type: ad.adType,
            campaign_name: ad.campaignName,
            owner_username: ad.ownerUsername,
            owner_verified: ad.ownerVerified
          }));

          // Aplicar filtros adicionales localmente
          let filteredAds = legacyAds;

          if (filters?.target_audience) {
            filteredAds = filteredAds.filter(ad => 
              ad.target_audience.toLowerCase().includes(filters.target_audience!.toLowerCase())
            );
          }

          if (filters?.min_budget) {
            filteredAds = filteredAds.filter(ad => ad.budget >= filters.min_budget!);
          }

          if (filters?.max_budget) {
            filteredAds = filteredAds.filter(ad => ad.budget <= filters.max_budget!);
          }

          setAds(filteredAds);
          setLoading(false);
        } catch (err) {
          console.error('Error processing ads data:', err);
          setError('Error al procesar datos de anuncios');
          setLoading(false);
        }
      }
    );

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [filters]);

  return { ads, loading, error };
};
