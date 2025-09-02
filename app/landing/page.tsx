'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Heart, Shield, Clock, MapPin } from 'lucide-react';
import Header from '../components/Header';
// import Hero from '../components/ui/Hero';
import Footer from '../components/Footer';
// import { Card, CardContent } from '../components/ui/Card';
// import Button from '../components/ui/Button';
// import CardMascota from '../components/ui/CardMascota';

// Mock data for mascotas
const mascotasDestacadas = [
  {
    id: '1',
    nombre: 'Luna',
    tipo: 'gato' as const,
    edad: '2 años',
    ubicacion: 'Madrid',
    imagen: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
    descripcion: 'Luna es una gatita muy cariñosa que busca un hogar tranquilo donde pueda recibir mucho amor.',
    fechaPublicacion: '2024-01-15',
  },
  {
    id: '2',
    nombre: 'Max',
    tipo: 'perro' as const,
    edad: '3 años',
    ubicacion: 'Barcelona',
    imagen: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    descripcion: 'Max es un perro muy activo y juguetón, perfecto para familias con niños.',
    fechaPublicacion: '2024-01-10',
  },
  {
    id: '3',
    nombre: 'Milo',
    tipo: 'perro' as const,
    edad: '1 año',
    ubicacion: 'Valencia',
    imagen: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    descripcion: 'Milo es un cachorro muy inteligente y obediente, ideal para entrenamiento.',
    fechaPublicacion: '2024-01-08',
  },
];

const testimonios = [
  {
    id: '1',
    nombre: 'María García',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    texto: 'Adopté a Luna hace 6 meses y ha cambiado mi vida completamente. Es la mejor decisión que he tomado.',
    rating: 5,
  },
  {
    id: '2',
    nombre: 'Carlos Rodríguez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    texto: 'Raizel me ayudó a encontrar a mi compañero perfecto. El proceso fue muy fácil y transparente.',
    rating: 5,
  },
  {
    id: '3',
    nombre: 'Ana López',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    texto: 'Gracias a Raizel, mi familia y yo tenemos a Max. Es increíble ver cómo se ha adaptado a nuestro hogar.',
    rating: 5,
  },
];

const features = [
  {
    icon: Shield,
    title: 'Adopción Segura',
    description: 'Todas nuestras mascotas pasan por un riguroso proceso de verificación y cuidado veterinario.',
  },
  {
    icon: Clock,
    title: 'Proceso Rápido',
    description: 'Nuestro proceso de adopción está optimizado para que encuentres tu compañero en poco tiempo.',
  },
  {
    icon: MapPin,
    title: 'Ubicación Cercana',
    description: 'Conectamos mascotas y adoptantes en tu área local para facilitar el proceso.',
  },
  {
    icon: Heart,
    title: 'Seguimiento',
    description: 'Te acompañamos durante todo el proceso y después de la adopción para asegurar el éxito.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FBFDFF]">
      <Header />
      {/* Hero section placeholder */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido a Raízel</h1>
          <p>Alimento natural para tus mascotas</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-4">
              ¿Por qué elegir Raizel?
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Nuestro compromiso es hacer que el proceso de adopción sea seguro, 
              transparente y lleno de amor para todos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="card hover h-full text-center">
                  <div className="card-content p-6">
                    <div className="w-16 h-16 bg-[#E6F0FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-[#0F6FF6]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0B1220] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mascotas Destacadas */}
      <section className="py-20 bg-[#FBFDFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-4">
              Mascotas Destacadas
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Estas mascotas están buscando un hogar amoroso. 
              ¿Podrías ser su familia perfecta?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mascotasDestacadas.map((mascota, index) => (
              <motion.div
                key={mascota.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mascota-card p-4 bg-white rounded-lg">
                  <img 
                    src={mascota.imagen}
                    alt={mascota.nombre}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold">{mascota.nombre}</h3>
                  <p className="text-sm text-gray-600">{mascota.tipo} • {mascota.edad}</p>
                  <p className="text-xs text-gray-500">{mascota.ubicacion}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button className="button button-lg group">
              Ver Todas las Mascotas
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1220] mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Historias reales de familias que han encontrado su compañero perfecto.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonios.map((testimonio, index) => (
              <motion.div
                key={testimonio.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="card h-full">
                  <div className="card-content p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonio.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-[#374151] mb-6 italic">
                      &ldquo;{testimonio.texto}&rdquo;
                    </p>
                    <div className="flex items-center">
                      <img
                        src={testimonio.avatar}
                        alt={testimonio.nombre}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-[#0B1220]">
                          {testimonio.nombre}
                        </h4>
                        <p className="text-sm text-[#6B7280]">
                          Adoptante Feliz
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0F6FF6] to-[#00C2A8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Listo para cambiar una vida?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Únete a nuestra comunidad y descubre la alegría de darle un hogar 
              a una mascota que lo necesita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="button button-secondary button-lg">
                Explorar Mascotas
              </button>
              <button className="button button-outline button-lg border-white text-white hover:bg-white hover:text-[#0F6FF6]">
                Saber Más
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
