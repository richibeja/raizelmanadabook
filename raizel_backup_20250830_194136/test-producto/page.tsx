"use client";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Page() {
  const [respuesta, setRespuesta] = useState('');
  const [recomendacion, setRecomendacion] = useState('');

  const enviarTest = () => {
    if (respuesta === 'activo') {
      setRecomendacion('Te recomendamos Vital BARF para perros activos.');
    } else if (respuesta === 'tranquilo') {
      setRecomendacion('Te recomendamos Vital Pellets Naturales.');
    } else {
      setRecomendacion('Selecciona una opción válida.');
    }
  };

  return (
    <>
      <Header />
      <main>
        <h1>Test de Producto</h1>
        <label>
          Tipo de perro:
          <select value={respuesta} onChange={e => setRespuesta(e.target.value)}>
            <option value="">Selecciona</option>
            <option value="activo">Activo</option>
            <option value="tranquilo">Tranquilo</option>
          </select>
        </label>
        <button onClick={enviarTest}>Ver recomendación</button>
        <p>{recomendacion}</p>
      </main>
      <Footer />
    </>
  );
}
