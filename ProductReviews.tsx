
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // Ajusta la ruta si es necesario

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );

    // onSnapshot escucha cambios en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviewsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const createdAt = data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date();
        return {
          id: doc.id,
          userName: data.userName,
          rating: data.rating,
          comment: data.comment,
          createdAt: createdAt,
        };
      });
      setReviews(reviewsData);
      setLoading(false);
    });

    // Se desuscribe al desmontar el componente para evitar fugas de memoria
    return () => unsubscribe();
  }, [productId]);

  if (loading) {
    return <p>Cargando reseñas...</p>;
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Reseñas del Producto</h3>
      {reviews.length === 0 ? (
        <p>Este producto aún no tiene reseñas. ¡Sé el primero!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {reviews.map(review => (
            <li key={review.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
              <p><strong>{review.userName}</strong> - {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              <p>{review.comment}</p>
              <small>{review.createdAt.toLocaleDateString('es-MX')}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
