'use client';
import React from 'react';
import Header from './components/Header';
import SponsorsCarousel from './components/SponsorsCarousel';
import Link from 'next/link';
import './globals.css';

export default function HomePage() {
    return (
        <div className='home-page-container'>
            <Header />
            <main>
                <h1>Bienvenido a Raízel</h1>
                <p>El ecosistema completo para el bienestar de tu mascota.</p>
            </main>
            <SponsorsCarousel />
            <section>
                <h2>Sección de enlaces</h2>
                <Link href='/catalogo'>Ver Catálogo</Link>
            </section>
        </div>
    );
}
