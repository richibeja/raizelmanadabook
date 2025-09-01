"use client";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import React from 'react';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <h1>Hacer un Pedido</h1>
        <p>Contacta con nosotros para agendar la entrega de tus productos.</p>
      </main>
      <Footer />
    </>
  );
}
