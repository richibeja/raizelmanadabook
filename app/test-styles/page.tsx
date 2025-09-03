'use client';

import React from 'react';

export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          🎨 Test de Estilos TailwindCSS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">🐾</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mascotas</h3>
            <p className="text-gray-600">Gestiona el perfil de tu mascota y conecta con otros dueños.</p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">🛍️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Marketplace</h3>
            <p className="text-gray-600">Compra y vende productos para mascotas en la comunidad.</p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Círculos</h3>
            <p className="text-gray-600">Únete a comunidades de mascotas y comparte experiencias.</p>
          </div>
        </div>

        {/* Botones de prueba */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Botón Primario
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Botón Secundario
          </button>
          <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-400 transition-colors font-medium">
            Botón Outline
          </button>
        </div>

        {/* Formulario de prueba */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Formulario de Prueba</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la mascota
              </label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Max, Luna, Rocky..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especie
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Guardar Mascota
            </button>
          </form>
        </div>

        {/* Estado de los estilos */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            ✅ TailwindCSS funcionando correctamente
          </div>
        </div>
      </div>
    </div>
  );
}
