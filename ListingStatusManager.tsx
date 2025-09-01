'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';
import './ListingStatusManager.css';

interface ListingStatusManagerProps {
  listingId: string;
  currentStatus: 'available' | 'sold';
  sellerId: string;
  onStatusChange: (newStatus: 'sold') => void;
}

export default function ListingStatusManager({ listingId, currentStatus, sellerId, onStatusChange }: ListingStatusManagerProps) {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleMarkAsSold = async () => {
    if (!currentUser || currentUser.uid !== sellerId) return;

    setLoading(true);
    try {
      const listingRef = doc(db, 'marketplace_listings', listingId);
      await updateDoc(listingRef, {
        status: 'sold'
      });
      onStatusChange('sold'); // Notificar al componente padre del cambio
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Hubo un error al actualizar el estado.");
    } finally {
      setLoading(false);
    }
  };

  // Solo el vendedor puede ver este componente
  if (!currentUser || currentUser.uid !== sellerId) {
    return null;
  }

  if (currentStatus === 'sold') {
    return (
      <div className="status-manager-container sold">
        <p>Este artículo ya fue vendido.</p>
      </div>
    );
  }

  return (
    <div className="status-manager-container">
      <h4>Gestionar Artículo</h4>
      <p>¿Ya vendiste este artículo?</p>
      <button onClick={handleMarkAsSold} disabled={loading}>
        {loading ? 'Actualizando...' : 'Marcar como Vendido'}
      </button>
    </div>
  );
}
