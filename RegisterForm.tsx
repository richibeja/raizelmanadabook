
'use client';

import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, writeBatch, increment, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './AuthForms.css'; // Importar el archivo CSS

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const referrerId = searchParams.get('ref');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Actualizar perfil con displayName
      await updateProfile(user, { displayName: displayName });

      // 3. Crear documento de usuario en Firestore y manejar referidos
      const batch = writeBatch(db);
      const userDocRef = doc(db, 'users', user.uid);

      const userData: { [key: string]: any } = {
        email: user.email,
        displayName: displayName,
        createdAt: serverTimestamp(),
        followersCount: 0,
        followingCount: 0,
        referredCount: 0, // Inicializar contador de referidos
      };

      if (referrerId) {
        userData.referredBy = referrerId;
      }

      batch.set(userDocRef, userData);

      // 4. Lógica de Referidos y Recompensas
      if (referrerId && referrerId !== user.uid) {
        const referrerDocRef = doc(db, 'users', referrerId);
        const referrerBadgeRef = doc(db, 'users', referrerId, 'badges', 'embajador');

        // Incrementar contador de referidos del referidor
        batch.update(referrerDocRef, { referredCount: increment(1) });

        // Otorgar medalla "Embajador" si es la primera referencia
        const badgeSnap = await getDoc(referrerBadgeRef);
        if (!badgeSnap.exists()) {
          batch.set(referrerBadgeRef, {
            name: "Embajador",
            description: "Otorgada por referir a tu primer amigo.",
            earnedAt: serverTimestamp(),
          });
        }
      }

      await batch.commit();

      router.push('/profile/setup'); // Redirigir a la creación del perfil de la mascota
    } catch (err: any) {
      console.error("Error during registration:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="displayName">Nombre de Usuario:</label>
          <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="terms-agreement">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <label htmlFor="terms">
            He leído y acepto los <Link href="/legal/terms" target="_blank">Términos y Condiciones</Link> y la <Link href="/legal/privacy" target="_blank">Política de Privacidad</Link>.
          </label>
        </div>
        <button type="submit" disabled={loading || !agreedToTerms}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
