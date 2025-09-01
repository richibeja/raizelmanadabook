'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Dog, Cat, Scale, Calendar, Info } from 'lucide-react';

interface CalculationResult {
  dailyAmount: number;
  weeklyAmount: number;
  monthlyAmount: number;
  recommendations: string[];
}

export default function CalculadoraPorciones() {
  const [formData, setFormData] = useState({
    especie: 'perro',
    peso: '',
    edad: '',
    actividad: 'normal',
    condicion: 'normal'
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const peso = parseFloat(formData.peso);
    const edad = parseInt(formData.edad);
    
    if (!peso || !edad) return;

    // Cálculo base según especie
    let baseAmount = 0;
    let recommendations: string[] = [];

    if (formData.especie === 'perro') {
      // Cálculo para perros: 2-3% del peso corporal
      baseAmount = peso * 0.025; // 2.5% como promedio
      
      // Ajustes por edad
      if (edad < 1) {
        baseAmount *= 1.5; // Cachorros necesitan más
        recommendations.push('Los cachorros necesitan más alimento por su crecimiento acelerado');
      } else if (edad > 7) {
        baseAmount *= 0.8; // Perros senior necesitan menos
        recommendations.push('Los perros senior requieren menos calorías pero más proteína de calidad');
      }
    } else {
      // Cálculo para gatos: 2-4% del peso corporal
      baseAmount = peso * 0.03; // 3% como promedio
      
      // Ajustes por edad
      if (edad < 1) {
        baseAmount *= 1.3; // Gatitos necesitan más
        recommendations.push('Los gatitos necesitan más alimento por su metabolismo acelerado');
      } else if (edad > 10) {
        baseAmount *= 0.9; // Gatos senior
        recommendations.push('Los gatos senior requieren menos calorías pero más taurina');
      }
    }

    // Ajustes por actividad
    if (formData.actividad === 'alta') {
      baseAmount *= 1.3;
      recommendations.push('Mascotas muy activas necesitan más alimento para mantener su energía');
    } else if (formData.actividad === 'baja') {
      baseAmount *= 0.8;
      recommendations.push('Mascotas sedentarias requieren menos alimento para evitar sobrepeso');
    }

    // Ajustes por condición
    if (formData.condicion === 'sobrepeso') {
      baseAmount *= 0.7;
      recommendations.push('Para mascotas con sobrepeso, reducir gradualmente la cantidad');
    } else if (formData.condicion === 'bajo_peso') {
      baseAmount *= 1.2;
      recommendations.push('Para mascotas con bajo peso, aumentar gradualmente la cantidad');
    }

    // Convertir a gramos y redondear
    const dailyAmount = Math.round(baseAmount * 1000);
    const weeklyAmount = dailyAmount * 7;
    const monthlyAmount = dailyAmount * 30;

    setResult({
      dailyAmount,
      weeklyAmount,
      monthlyAmount,
      recommendations
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Raízel
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Calculadora de Porciones</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Descubre cuánto debe comer tu mascota según su peso, edad y nivel de actividad. 
            Esta calculadora te ayudará a mantener una dieta balanceada y saludable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <Calculator className="mr-2 text-red-600" size={24} />
              Calcula las porciones
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Especie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Qué tipo de mascota tienes?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
                    <input
                      type="radio"
                      name="especie"
                      value="perro"
                      checked={formData.especie === 'perro'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <Dog className="mr-2 text-gray-600" size={20} />
                    <span className="font-medium">Perro</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-300 transition-colors">
                    <input
                      type="radio"
                      name="especie"
                      value="gato"
                      checked={formData.especie === 'gato'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <Cat className="mr-2 text-gray-600" size={20} />
                    <span className="font-medium">Gato</span>
                  </label>
                </div>
              </div>

              {/* Peso */}
              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-2">
                  Peso de tu mascota (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="peso"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    required
                    min="0.1"
                    max="100"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ej: 15.5"
                  />
                  <Scale className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              {/* Edad */}
              <div>
                <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-2">
                  Edad (años)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="edad"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    required
                    min="0.1"
                    max="25"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Ej: 3"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              {/* Nivel de actividad */}
              <div>
                <label htmlFor="actividad" className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel de actividad
                </label>
                <select
                  id="actividad"
                  name="actividad"
                  value={formData.actividad}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="baja">Sedentaria (poca actividad)</option>
                  <option value="normal">Normal (actividad moderada)</option>
                  <option value="alta">Muy activa (ejercicio intenso)</option>
                </select>
              </div>

              {/* Condición corporal */}
              <div>
                <label htmlFor="condicion" className="block text-sm font-medium text-gray-700 mb-2">
                  Condición corporal
                </label>
                <select
                  id="condicion"
                  name="condicion"
                  value={formData.condicion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="normal">Peso normal</option>
                  <option value="sobrepeso">Sobrepeso</option>
                  <option value="bajo_peso">Bajo peso</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
              >
                Calcular porciones
              </button>
            </form>
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Resultado principal */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resultado del cálculo</h2>
                  
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-red-50 rounded-xl">
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        {result.dailyAmount}g
                      </div>
                      <div className="text-gray-600">Por día</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-semibold text-gray-800">
                          {result.weeklyAmount.toLocaleString()}g
                        </div>
                        <div className="text-sm text-gray-600">Por semana</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-semibold text-gray-800">
                          {result.monthlyAmount.toLocaleString()}g
                        </div>
                        <div className="text-sm text-gray-600">Por mes</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recomendaciones */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Info className="mr-2 text-blue-600" size={20} />
                    Recomendaciones
                  </h3>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-600 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <Calculator className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Calcula las porciones</h3>
                <p className="text-gray-600 text-sm">
                  Completa el formulario para obtener las porciones recomendadas para tu mascota.
                </p>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Información importante</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Nota:</strong> Esta calculadora proporciona estimaciones generales. 
                  Siempre consulta con tu veterinario para una dieta personalizada.
                </p>
                <p>
                  <strong>Transición:</strong> Si cambias la dieta de tu mascota, hazlo gradualmente 
                  durante 7-10 días para evitar problemas digestivos.
                </p>
                <p>
                  <strong>Monitoreo:</strong> Observa el peso y condición de tu mascota regularmente 
                  y ajusta las porciones según sea necesario.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ¿Necesitas productos específicos?
          </h2>
          <p className="text-gray-600 mb-6">
            Explora nuestro catálogo de alimentos naturales para perros y gatos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalogo-perros" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Productos para Perros
            </Link>
            <Link href="/catalogo-gatos" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Productos para Gatos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




