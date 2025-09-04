'use client';
import React from 'react';

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Test Simple - TailwindCSS
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            ¿Se ven los estilos?
          </h2>
          <p className="text-gray-600 mb-6">
            Si ves este texto con estilos, colores, sombras y efectos, entonces TailwindCSS está funcionando.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
              Botón Azul
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
              Botón Verde
            </button>
            <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors">
              Botón Rojo
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Card 1</h3>
            <p className="text-gray-600">Esta es una tarjeta de prueba.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Card 2</h3>
            <p className="text-gray-600">Otra tarjeta de prueba.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
