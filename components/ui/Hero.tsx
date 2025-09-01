'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, Users, MapPin } from 'lucide-react';

interface HeroProps {
  className?: string;
}

export default function Hero({ className = '' }: HeroProps) {
  return (
    <section className={`relative bg-gradient-to-br from-neutral-50 to-primary-50 overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500 rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
              Conecta con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                mascotas
              </span>{' '}
              increíbles
            </h1>
            
            <p className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Únete a la comunidad más grande de amantes de mascotas. Encuentra tu compañero perfecto, 
              comparte momentos especiales y conecta con otros dueños responsables.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mb-8">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-primary-500" />
                <span className="text-neutral-600">
                  <span className="font-semibold text-neutral-900">2,500+</span> adopciones exitosas
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary-500" />
                <span className="text-neutral-600">
                  <span className="font-semibold text-neutral-900">15,000+</span> miembros activos
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span className="text-neutral-600">
                  <span className="font-semibold text-neutral-900">50+</span> ciudades
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 group"
              >
                Registrarse gratis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                href="/adoptions"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-500 text-primary-500 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                Explorar adopciones
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-neutral-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Verificación de identidad</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Adopciones seguras</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hero-dog.jpg"
                  alt="Perro feliz en el parque"
                  className="w-full h-96 lg:h-[500px] object-cover"
                  onError={(e) => {
                    // Fallback si la imagen no existe
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGOUZBIi8+CjxwYXRoIGQ9Ik0xNTAgMjAwQzE1MCAxNzguOTEgMTY2LjkxIDE2MiAxODggMTYySDQxMkM0MzMuMDkgMTYyIDQ1MCAxNzguOTEgNDUwIDIwMFYzMDBDNDUwIDMyMS4wOSA0MzMuMDkgMzM4IDQxMiAzMzhIMTg4QzE2Ni45MSAzMzggMTUwIDMyMS4wOSAxNTAgMzAwVjIwMFoiIGZpbGw9IiNFNkVFRjciLz4KPGNpcmNsZSBjeD0iMjAwIiBjeT0iMjIwIiByPSIyMCIgZmlsbD0iIzZCNzI4MCIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMjAiIHI9IjIwIiBmaWxsPSIjNkI3MjgwIi8+CjxwYXRoIGQ9Ik0yNTAgMjgwQzI1MCAyNjguOTUgMjU5Ljk1IDI2MCAyNzEgMjYwSDMyOUMzNDAuMDUgMjYwIDM1MCAyNjguOTUgMzUwIDI4MFYzMDBDMzUwIDMxMS4wNSAzNDAuMDUgMzIwIDMyOSAzMjBIMjcxQzI1OS45NSAzMjAgMjUwIDMxMS4wNSAyNTAgMzAwVjI4MFoiIGZpbGw9IiM2QjcyODAiLz4KPHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5GAPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+';
                  }}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">Luna</p>
                    <p className="text-sm text-neutral-600">Golden Retriever • 2 años</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span className="text-xs text-success-600">Disponible para adopción</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-500">98%</p>
                  <p className="text-sm text-neutral-600">Tasa de éxito</p>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-accent-200 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-200 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
