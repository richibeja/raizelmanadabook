"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from 'react';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <h1>Catálogo de Productos</h1>
        <p>Descubre nuestra línea de alimentos naturales Vital BARF y Vital Pellets.</p>
      </main>
      <Footer />
    </>
  );
}
