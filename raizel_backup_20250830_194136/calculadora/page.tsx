"use client";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Page() {
  const [peso, setPeso] = useState('');
  const [resultado, setResultado] = useState('');

  const calcularPorcion = () => {
    const p = parseFloat(peso);
    if (!isNaN(p)) {
      setResultado(\Ración diaria recomendada: \ kg\);
    } else {
      setResultado('Ingresa un peso válido');
    }
  };

  return (
    <>
      <Header />
      <main>
        <h1>Calculadora de Porciones</h1>
        <input 
          type="number" 
          placeholder="Peso de tu mascota (kg)" 
          value={peso} 
          onChange={e => setPeso(e.target.value)} 
        />
        <button onClick={calcularPorcion}>Calcular</button>
        <p>{resultado}</p>
      </main>
      <Footer />
    </>
  );
}
