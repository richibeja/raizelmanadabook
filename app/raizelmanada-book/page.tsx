'use client';
import React from 'react';
import { BookOpen, PenTool, Feather, Compass, Facebook, Twitter, Instagram } from 'lucide-react';

export default function RaizelmanadaBookPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-2xl font-bold">
              <BookOpen className="mr-3 h-8 w-8" />
              <span>Raizelmanada</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#inicio" className="hover:bg-white/20 px-3 py-2 rounded transition-all duration-300">
                Inicio
              </a>
              <a href="#contenido" className="hover:bg-white/20 px-3 py-2 rounded transition-all duration-300">
                Contenido
              </a>
              <a href="#testimonios" className="hover:bg-white/20 px-3 py-2 rounded transition-all duration-300">
                Testimonios
              </a>
              <a href="#contacto" className="hover:bg-white/20 px-3 py-2 rounded transition-all duration-300">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative py-20 text-white text-center bg-cover bg-center bg-no-repeat" 
               style={{backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80)'}}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg">
            Raizelmanada Book
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-shadow">
            Una experiencia literaria única que combina tradición y modernidad en cada página
          </p>
          <a href="#contenido" 
             className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            Descubrir más
          </a>
        </div>
      </section>

      {/* Book Content */}
      <section id="contenido" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              El Contenido
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Descubre los elementos únicos que hacen de Raizelmanada una experiencia literaria excepcional
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:-translate-y-2 transition-all duration-300">
              <PenTool className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Narrativa Profunda
              </h3>
              <p className="text-gray-600">
                Sumérgete en una narrativa rica y profunda que explora las raíces culturales con un enfoque contemporáneo.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:-translate-y-2 transition-all duration-300">
              <Feather className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Estilo Único
              </h3>
              <p className="text-gray-600">
                Un estilo literario distintivo que combina elementos tradicionales con técnicas narrativas modernas.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:-translate-y-2 transition-all duration-300">
              <Compass className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Viaje Cultural
              </h3>
              <p className="text-gray-600">
                Embárcate en un viaje a través de diferentes perspectivas culturales y experiencias humanas universales.
              </p>
            </div>
          </div>
          
          {/* Contenido original del libro */}
          <div className="bg-gray-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-blue-800 text-center mb-6">
              Sobre Raizelmanada
            </h3>
            <div className="space-y-4 text-gray-700">
              <p>
                Raizelmanada es una obra literaria que fusiona elementos de la tradición con visiones contemporáneas, 
                creando un tapiz narrativo único.
              </p>
              <p>
                Cada capítulo está cuidadosamente elaborado para transportar al lector a través de diferentes 
                dimensiones culturales y emocionales.
              </p>
              <p>
                El libro explora temas universales desde perspectivas frescas e innovadoras, invitando a la 
                reflexión y al descubrimiento personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Testimonios
            </h2>
            <p className="text-gray-600 text-lg">
              Lo que los lectores dicen sobre Raizelmanada
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="relative mb-6">
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  &ldquo;Una obra maestra de la literatura contemporánea. Raizelmanada logra conectar con lo más profundo del ser humano.&rdquo;
                </p>
                <div className="absolute -top-4 -left-2 text-6xl text-blue-600 opacity-20">&ldquo;</div>
                <div className="absolute -bottom-8 -right-2 text-6xl text-blue-600 opacity-20">&rdquo;</div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ML
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">María López</h4>
                  <p className="text-gray-600">Crítica literaria</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="relative mb-6">
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  &ldquo;Nunca había leído algo tan original y conmovedor. Cada página es una sorpresa y una delight para los sentidos.&rdquo;
                </p>
                <div className="absolute -top-4 -left-2 text-6xl text-blue-600 opacity-20">&ldquo;</div>
                <div className="absolute -bottom-8 -right-2 text-6xl text-blue-600 opacity-20">&rdquo;</div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  CG
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Carlos González</h4>
                  <p className="text-gray-600">Escritor y periodista</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="relative mb-6">
                <p className="text-gray-700 italic text-lg leading-relaxed">
                  &ldquo;Raizelmanada redefine lo que significa la literatura en el siglo XXI. Una experiencia transformadora.&rdquo;
                </p>
                <div className="absolute -top-4 -left-2 text-6xl text-blue-600 opacity-20">&ldquo;</div>
                <div className="absolute -bottom-8 -right-2 text-6xl text-blue-600 opacity-20">&rdquo;</div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  AP
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Ana Pérez</h4>
                  <p className="text-gray-600">Profesora de literatura</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="contacto" className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para comenzar el viaje?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Sumérgete en el mundo de Raizelmanada y descubre una experiencia literaria que transformará tu perspectiva.
          </p>
          <a href="#" 
             className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            Obtener el libro
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-2xl font-bold mb-6">
              <BookOpen className="mr-3 h-8 w-8" />
              <span>Raizelmanada</span>
            </div>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" className="hover:text-red-500 transition-colors duration-300">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors duration-300">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-red-500 transition-colors duration-300">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-400">
              &copy; 2024 Raizelmanada Book. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
