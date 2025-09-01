'use client';

import React from 'react';
import Header from '../components/Header';
// import Hero from '../components/ui/Hero';
// import { MascotasGrid, mascotasEjemplo } from '../components/ui/CardMascota';

export default function TestUIPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      {/* Hero section placeholder */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Test UI - Raízel</h1>
          <p>Página de prueba de componentes</p>
        </div>
      </section>
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Mascotas Disponibles
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Explora nuestra selección de mascotas que buscan un hogar amoroso. 
            Cada una tiene una historia única y está lista para ser parte de tu familia.
          </p>
        </div>
        
        {/* Mascotas grid placeholder */}
        <div className="mascotas-grid">
          <p>Grid de mascotas placeholder</p>
        </div>
      </section>

      {/* Sección de características */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              ¿Por qué elegir RaízSocial?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Nuestra plataforma ofrece todo lo que necesitas para encontrar 
              y cuidar de tu mascota perfecta.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐾</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Adopciones Seguras
              </h3>
              <p className="text-neutral-600">
                Todas las mascotas pasan por un proceso de verificación 
                para garantizar su salud y bienestar.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Comunidad Activa
              </h3>
              <p className="text-neutral-600">
                Conecta con otros dueños de mascotas, comparte experiencias 
                y obtén consejos de expertos.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Cuidado Integral
              </h3>
              <p className="text-neutral-600">
                Accede a recursos educativos, servicios veterinarios 
                y productos de calidad para tu mascota.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para encontrar tu compañero perfecto?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a miles de familias que ya han encontrado su mascota ideal 
            a través de RaízSocial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors duration-200">
              Explorar Mascotas
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200">
              Crear Cuenta
            </button>
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RaízSocial</h3>
              <p className="text-neutral-400">
                Conectando mascotas con familias amorosas desde 2024.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cómo funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Guía de adopción</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cuidado de mascotas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Términos de servicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 RaízSocial. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
