'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface UserManagementRowProps {
  userData: any;
}

export default function UserManagementRow({ userData }: UserManagementRowProps) {
  const [status, setStatus] = useState(userData.status || 'active');
  const [loading, setLoading] = useState(false);

  const handleToggleSuspend = async () => {
    setLoading(true);
    const newStatus = status === 'active' ? 'suspended' : 'active';
    try {
      const userRef = doc(db, 'users', userData.id);
      await updateDoc(userRef, {
        status: newStatus
      });
      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Hubo un error al cambiar el estado del usuario.");
    } finally {
      setLoading(false);
    }
  };

  const registrationDate = userData.createdAt?.toDate().toLocaleDateString('es-CO') || 'N/A';

  return (
    <tr>
      <td>{userData.displayName}</td>
      <td>{userData.email}</td>
      <td>{registrationDate}</td>
      <td>
        <span className={`status-badge status-${status}`}>{status}</span>
      </td>
      <td>
        <button 
          onClick={handleToggleSuspend} 
          disabled={loading}
          className={`action-button ${status === 'active' ? 'suspend' : 'activate'}`}
        >
          {loading ? '...' : (status === 'active' ? 'Suspender' : 'Reactivar')}
        </button>
      </td>
    </tr>
  );
}
