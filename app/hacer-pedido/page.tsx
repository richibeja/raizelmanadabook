'use client';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

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




