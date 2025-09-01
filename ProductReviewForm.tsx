
'use client';

import { useState, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // Ajusta la ruta si es necesario
import { useAuth } from './AuthContext'; // Usamos el AuthContext que ya creamos

interface ProductReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void; // Callback para refrescar las reseñas
}

export default function ProductReviewForm({ productId, onReviewSubmitted }: ProductReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      setError('Debes iniciar sesión para dejar una reseña.');
      return;
    }

    if (comment.trim().length < 10) {
        setError('Tu comentario debe tener al menos 10 caracteres.');
        return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'reviews'), {
        userId: user.uid,
        userName: user.displayName || user.email || 'Anónimo',
        productId: productId,
        rating: rating,
        comment: comment,
        createdAt: serverTimestamp(),
      });
      
      // Limpiamos el formulario y notificamos al padre que se actualicen las reseñas
      setComment('');
      setRating(5);
      onReviewSubmitted();

    } catch (err) {
      console.error("Error submitting review:", err);
      setError('Ocurrió un error al enviar tu reseña. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <p>Por favor, <a href="/login">inicia sesión</a> para dejar una reseña.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <h4>Escribe tu reseña</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Calificación:</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          <option value={5}>5 Estrellas</option>
          <option value={4}>4 Estrellas</option>
          <option value={3}>3 Estrellas</option>
          <option value={2}>2 Estrellas</option>
          <option value={1}>1 Estrella</option>
        </select>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Comentario:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
          style={{ width: '100%', minHeight: '100px' }}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
      </button>
    </form>
  );
}
