'use client';

import { useState } from 'react';
import { collection, writeBatch, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const sampleProducts = [
  {
    name: "Vital BARF Pollo",
    summary: "Dieta cruda completa y balanceada para perros de todas las edades.",
    description: "Nuestra fórmula de pollo ofrece una mezcla perfecta de carne muscular, hueso carnoso y órganos para una nutrición óptima. Ideal para mejorar la digestión, el pelaje y los niveles de energía.",
    imageUrl: "https://via.placeholder.com/400x300.png?text=Vital+BARF+Pollo",
    category: "BARF",
  },
  {
    name: "Vital BARF Res",
    summary: "Una opción rica en hierro y nutrientes esenciales para perros activos.",
    description: "La carne de res es una excelente fuente de proteína y aminoácidos. Esta dieta apoya el desarrollo de masa muscular y la vitalidad de tu mascota.",
    imageUrl: "https://via.placeholder.com/400x300.png?text=Vital+BARF+Res",
    category: "BARF",
  },
  {
    name: "ChoriBARF",
    summary: "Deliciosos chorizos naturales para un premio saludable y nutritivo.",
    description: "Hechos con carne de alta calidad y sin aditivos artificiales, nuestros ChoriBARF son el snack perfecto para consentir a tu mascota mientras cuidas su salud.",
    imageUrl: "https://via.placeholder.com/400x300.png?text=ChoriBARF",
    category: "Snacks",
  },
  {
    name: "Helados para Mascotas",
    summary: "Refrescantes y saludables helados formulados especialmente para ellos.",
    description: "Una golosina ideal para los días calurosos. Hechos a base de frutas y yogur natural, sin azúcares añadidos ni lactosa. ¡Les encantará!",
    imageUrl: "https://via.placeholder.com/400x300.png?text=Helados+para+Mascotas",
    category: "Snacks",
  },
  {
    name: "Vital Pellets",
    summary: "La conveniencia del alimento seco con la calidad de los ingredientes naturales.",
    description: "Nuestros pellets son prensados en frío para conservar la máxima cantidad de nutrientes. Una alternativa perfecta para quienes buscan una transición a una dieta más natural sin la logística del alimento crudo.",
    imageUrl: "https://via.placeholder.com/400x300.png?text=Vital+Pellets",
    category: "Pellets",
  },
];

export default function ProductSeeder() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('');
    try {
      const batch = writeBatch(db);
      const productsCollection = collection(db, 'raizel_products');

      sampleProducts.forEach(product => {
        const docRef = doc(productsCollection);
        batch.set(docRef, { ...product, createdAt: serverTimestamp() });
      });

      await batch.commit();
      setMessage('¡Éxito! Se han actualizado los productos de ejemplo en tu base de datos.');
    } catch (error) {
      console.error("Error seeding products: ", error);
      setMessage('Error al añadir los productos.');
    } finally {
      setLoading(false);
    }
  };

  // No mostrar este componente en producción
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div style={{ padding: '20px', border: '1px dashed #ccc', margin: '20px 0', textAlign: 'center' }}>
      <h4>Herramienta para Contenido de Ejemplo (Raízel)</h4>
      <p>Usa este botón para añadir productos a tu Firestore.</p>
      <button onClick={handleSeed} disabled={loading}>
        {loading ? 'Añadiendo...' : 'Añadir Productos de Ejemplo'}
      </button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
