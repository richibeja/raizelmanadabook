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
    edadAnos: '',
    edadMeses: '',
    actividad: 'normal',
    condicion: 'normal'
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const peso = parseFloat(formData.peso);
    const edadAnos = parseInt(formData.edadAnos) || 0;
    const edadMeses = parseInt(formData.edadMeses) || 0;
    
    if (!peso || peso <= 0) {
      alert('Por favor, ingresa un peso válido para tu mascota');
      return;
    }
    
    if (edadAnos === 0 && edadMeses === 0) {
      alert('Por favor, ingresa la edad de tu mascota (años o meses)');
      return;
    }
    
    if (edadMeses > 11) {
      alert('Los meses deben ser entre 0 y 11. Si tu mascota tiene más de 11 meses, suma 1 año.');
      return;
    }

    // Convertir edad a meses totales para cálculos más precisos
    const edadTotalMeses = (edadAnos * 12) + edadMeses;
    const edadTotalAnos = edadTotalMeses / 12;

    // Cálculo base según especie
    let baseAmount = 0;
    let recommendations: string[] = [];

    if (formData.especie === 'perro') {
      // Cálculo para perros: 2-3% del peso corporal
      baseAmount = peso * 0.025; // 2.5% como promedio
      
      // Ajustes por edad (usando meses totales para mayor precisión)
      if (edadTotalMeses < 12) {
        baseAmount *= 1.5; // Cachorros necesitan más
        recommendations.push('Los cachorros necesitan más alimento por su crecimiento acelerado');
      } else if (edadTotalAnos > 7) {
        baseAmount *= 0.8; // Perros senior necesitan menos
        recommendations.push('Los perros senior requieren menos calorías pero más proteína de calidad');
      }
    } else {
      // Cálculo para gatos: 2-4% del peso corporal
      baseAmount = peso * 0.03; // 3% como promedio
      
      // Ajustes por edad (usando meses totales para mayor precisión)
      if (edadTotalMeses < 12) {
        baseAmount *= 1.3; // Gatitos necesitan más
        recommendations.push('Los gatitos necesitan más alimento por su metabolismo acelerado');
      } else if (edadTotalAnos > 10) {
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
    setShowResult(true);
  };

  const handleReset = () => {
    setFormData({
      especie: 'perro',
      peso: '',
      edadAnos: '',
      edadMeses: '',
      actividad: 'normal',
      condicion: 'normal'
    });
    setResult(null);
    setShowResult(false);
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad de tu mascota
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="number"
                      id="edadAnos"
                      name="edadAnos"
                      value={formData.edadAnos}
                      onChange={handleChange}
                      min="0"
                      max="25"
                      step="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Años"
                    />
                    <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      id="edadMeses"
                      name="edadMeses"
                      value={formData.edadMeses}
                      onChange={handleChange}
                      min="0"
                      max="11"
                      step="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Meses"
                    />
                    <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ejemplo: 2 años y 6 meses = 2 años + 6 meses
                </p>
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

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Calcular porciones
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Resultado principal */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resultado del cálculo</h2>
                  
                  {/* Información de la mascota */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          {formData.especie === 'perro' ? '🐕' : '🐱'} {formData.especie === 'perro' ? 'Perro' : 'Gato'}
                        </div>
                        <div className="text-gray-600">Especie</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">{formData.peso}kg</div>
                        <div className="text-gray-600">Peso</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          {Number(formData.edadAnos) > 0 ? `${formData.edadAnos} años` : ''}
                          {Number(formData.edadAnos) > 0 && Number(formData.edadMeses) > 0 ? ' y ' : ''}
                          {Number(formData.edadMeses) > 0 ? `${formData.edadMeses} meses` : ''}
                        </div>
                        <div className="text-gray-600">Edad</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-red-50 rounded-xl border-2 border-red-200">
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        {result.dailyAmount}g
                      </div>
                      <div className="text-gray-600 font-medium">Por día</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-xl font-semibold text-orange-600">
                          {result.weeklyAmount.toLocaleString()}g
                        </div>
                        <div className="text-sm text-orange-700 font-medium">Por semana</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-xl font-semibold text-yellow-600">
                          {result.monthlyAmount.toLocaleString()}g
                        </div>
                        <div className="text-sm text-yellow-700 font-medium">Por mes</div>
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
                  <ul className="space-y-3 mb-6">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-600 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Botones de acción */}
                  <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Imprimir resultado
                    </button>
                    <button
                      onClick={() => {
                        const text = `Calculadora de Porciones - ${formData.especie === 'perro' ? 'Perro' : 'Gato'}\nPeso: ${formData.peso}kg\nEdad: ${formData.edadAnos} años ${formData.edadMeses} meses\n\nPorciones recomendadas:\n- Diario: ${result.dailyAmount}g\n- Semanal: ${result.weeklyAmount}g\n- Mensual: ${result.monthlyAmount}g`;
                        navigator.clipboard.writeText(text);
                        alert('Resultado copiado al portapapeles');
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Copiar resultado
                    </button>
                  </div>
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




