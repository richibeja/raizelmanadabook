'use client';

import { useState } from 'react';
import { collection, writeBatch, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const sampleArticles = [
  {
    title: "La importancia de la proteína en la dieta de tu perro",
    summary: "Descubre por qué la proteína es el macronutriente más importante para la salud y energía de tu compañero.",
    content: `La proteína es fundamental en la dieta de cualquier carnívoro, y los perros no son la excepción. Sirve como el bloque de construcción para músculos, piel, pelo, y enzimas vitales...\n\nUna dieta rica en proteína de alta calidad, como la que se encuentra en la carne fresca, asegura un desarrollo muscular óptimo, un pelaje brillante y un sistema inmunológico fuerte. Busca alimentos que listen una fuente de proteína animal como primer ingrediente.`,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Perro+Sano",
  },
  {
    title: "¿Cuánta agua debe beber tu mascota al día?",
    summary: "La hidratación es clave. Te enseñamos a calcular la cantidad de agua necesaria para tu perro o gato.",
    content: `Una regla general es que un perro debe beber aproximadamente 50-60 ml de agua por cada kilogramo de peso corporal al día. Para un perro de 10 kg, esto significa entre 500 y 600 ml de agua.\n\nFactores como el calor, el ejercicio y el tipo de dieta (seca o húmeda) pueden aumentar esta necesidad. Asegúrate siempre de que tu mascota tenga acceso a agua fresca y limpia.`,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Agua+es+Vida",
  },
  {
    title: "Entendiendo las etiquetas del alimento para mascotas",
    summary: "Te ayudamos a descifrar la lista de ingredientes para que elijas la mejor opción para tu mejor amigo.",
    content: `Leer la etiqueta de un alimento puede ser confuso. Lo más importante es mirar los primeros cinco ingredientes, ya que componen la mayor parte del producto. Busca fuentes de proteína identificables (ej. \"pollo\", \"cordero\") en lugar de términos genéricos (\"harina de carne\").\n\nEvita ingredientes de relleno como el maíz, el trigo o la soja en grandes cantidades, así como colorantes y conservantes artificiales.`,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Etiqueta+de+Alimento",
  },
];

export default function EducationContentSeeder() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('');
    try {
      const batch = writeBatch(db);
      const articlesCollection = collection(db, 'articles');

      sampleArticles.forEach(article => {
        const docRef = doc(articlesCollection);
        batch.set(docRef, { ...article, createdAt: serverTimestamp() });
      });

      await batch.commit();
      setMessage('¡Éxito! Se han añadido 3 artículos de ejemplo a tu base de datos.');
    } catch (error) {
      console.error("Error seeding database: ", error);
      setMessage('Error al añadir los artículos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px dashed #ccc', margin: '20px 0' }}>
      <h4>Herramienta para Contenido de Ejemplo</h4>
      <p>Usa este botón para añadir artículos educativos a tu Firestore.</p>
      <button onClick={handleSeed} disabled={loading}>
        {loading ? 'Añadiendo...' : 'Añadir Artículos de Ejemplo'}
      </button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
