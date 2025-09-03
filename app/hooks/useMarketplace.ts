'use client';
import { useState, useEffect } from 'react';
import {
  subscribeToMarketplaceItems,
  createMarketplaceItem,
  updateMarketplaceItemStatus,
  addToFavorites,
  removeFromFavorites,
  MarketplaceItem,
} from '@/lib/firebase';
import { useAuthContext } from '../contexts/AuthContext';

export const useMarketplace = (filters?: { 
  category?: string; 
  city?: string; 
  priceMin?: number; 
  priceMax?: number; 
  search?: string;
  limit?: number;
}) => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Suscripción Firebase tiempo real con filtros
    const unsubscribe = subscribeToMarketplaceItems(filters || {}, (marketplaceItems) => {
      setItems(marketplaceItems);
      setLoading(false);
    });

    return unsubscribe;
  }, [filters]); // Simplificar dependencias para evitar warnings

  return { items, loading, error };
};

// Hook para gestionar items del usuario
export const useUserMarketplace = () => {
  const { user } = useAuthContext();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMarketplaceItems(
      { sellerId: user.uid },
      (userItems) => {
        setItems(userItems);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  const create = async (itemData: Omit<MarketplaceItem, 'id' | 'sellerId' | 'createdAt' | 'updatedAt' | 'stats'>) => {
    if (!user?.uid) {
      setError('Usuario no autenticado');
      return null;
    }

    try {
      setError(null);
      
      const newItemData = {
        ...itemData,
        sellerId: user.uid
      };

      const itemId = await createMarketplaceItem(newItemData);
      return itemId;
    } catch (err: any) {
      setError(err.message || 'Error al crear artículo');
      return null;
    }
  };

  const updateStatus = async (itemId: string, status: MarketplaceItem['status']) => {
    if (!user?.uid) return false;
    
    try {
      await updateMarketplaceItemStatus(itemId, status, user.uid);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estado');
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    create,
    updateStatus
  };
};

// Hook para favoritos
export const useMarketplaceFavorites = () => {
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const addFavorite = async (itemId: string) => {
    if (!user?.uid) return false;
    
    try {
      setLoading(true);
      await addToFavorites(itemId, user.uid);
      setFavorites(prev => new Set([...prev, itemId]));
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (itemId: string) => {
    if (!user?.uid) return false;
    
    try {
      setLoading(true);
      await removeFromFavorites(itemId, user.uid);
      setFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (itemId: string) => favorites.has(itemId);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite
  };
};

// Hook para estadísticas del marketplace
export const useMarketplaceStats = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    categoriesCount: {},
    averagePrice: 0
  });

  const { items } = useMarketplace({ limit: 1000 }); // Get all for stats

  useEffect(() => {
    if (items.length === 0) return;

    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    const averagePrice = totalValue / totalItems;
    
    const categoriesCount = items.reduce((acc: any, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    setStats({
      totalItems,
      totalValue,
      categoriesCount,
      averagePrice
    });
  }, [items]);

  return stats;
};