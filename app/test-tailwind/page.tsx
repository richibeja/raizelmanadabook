'use client';
import React from 'react';

export default function TestTailwindPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Test de TailwindCSS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Card 1</h2>
            <p className="text-gray-600 mb-4">Esta es una tarjeta de prueba con estilos de TailwindCSS.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Botón
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Card 2</h2>
            <p className="text-gray-600 mb-4">Otra tarjeta con diferentes estilos y efectos.</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Botón
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Card 3</h2>
            <p className="text-gray-600 mb-4">Tercera tarjeta para completar el grid.</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Botón
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sección de Prueba</h2>
          <p className="text-gray-600 mb-6">
            Si ves este texto con estilos, colores, sombras y efectos, entonces TailwindCSS está funcionando correctamente.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Gradiente
            </button>
            <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
              Rojo
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors">
              Outline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
