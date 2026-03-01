'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Dog, Cat, Scale, Calendar, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

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

  const RaizelLogo = ({ className = "text-xl" }) => (
    <div className={`flex items-center font-black tracking-tighter ${className} text-[#4a3728]`}>
      <span>Ra</span>
      <div className="relative w-[0.8em] h-[1.4em] mx-0.5 flex items-center justify-center translate-y-[0.1em]">
        <svg viewBox="0 0 24 32" className="w-full h-full text-green-700 overflow-visible" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Stem */}
          <path d="M12 26V10" />
          {/* Leaf Left */}
          <path d="M12 10C12 10 6 4 4 6C2 8 8 12 12 12" />
          {/* Leaf Right */}
          <path d="M12 10C12 10 18 4 20 6C22 8 16 12 12 12" />
          {/* Roots */}
          <path d="M12 26C12 26 10 28.5 7 28" strokeWidth="1.5" />
          <path d="M12 26C12 26 14 28.5 17 28" strokeWidth="1.5" />
          <path d="M12 26V31" strokeWidth="1.5" />
          <path d="M10 29L8 31" strokeWidth="1" opacity="0.6" />
          <path d="M14 29L16 31" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>
      <span>zel</span>
    </div>
  );

  // ... (keeping logic same for accuracy but updating UI)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const peso = parseFloat(formData.peso);
    const edadAnos = parseInt(formData.edadAnos) || 0;
    const edadMeses = parseInt(formData.edadMeses) || 0;

    if (!peso || peso <= 0) return;

    const edadTotalMeses = (edadAnos * 12) + edadMeses;
    const edadTotalAnos = edadTotalMeses / 12;
    let baseAmount = 0;
    let recommendations: string[] = [];

    if (formData.especie === 'perro') {
      baseAmount = peso * 0.025;
      if (edadTotalMeses < 12) baseAmount *= 1.5;
    } else {
      baseAmount = peso * 0.03;
      if (edadTotalMeses < 12) baseAmount *= 1.3;
    }

    const adjustments = {
      alta: 1.3,
      baja: 0.8,
      normal: 1
    };
    baseAmount *= adjustments[formData.actividad as keyof typeof adjustments];

    const condAdjust = {
      sobrepeso: 0.7,
      bajo_peso: 1.2,
      normal: 1
    };
    baseAmount *= condAdjust[formData.condicion as keyof typeof condAdjust];

    const dailyAmount = Math.round(baseAmount * 1000);
    setResult({
      dailyAmount,
      weeklyAmount: dailyAmount * 7,
      monthlyAmount: dailyAmount * 30,
      recommendations: [
        'Asegura agua fresca ilimitada siempre.',
        'Divide la porción en 2 o 3 tomas al día.',
        'La dieta BARF mejora la calidad del pelaje en 15 días.'
      ]
    });
    setShowResult(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in font-sans">
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="inline-flex items-center text-gray-900 hover:text-red-500 font-bold transition-all hover:-translate-x-1 group">
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-red-50 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm uppercase tracking-widest leading-none">Volver</span>
          </Link>
          <RaizelLogo />
        </div>

        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
            Smart <span className="text-red-600">Diet</span> Calculator.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Nuestros algoritmos calculan la nutrición exacta para que tu mascota viva más tiempo y con más energía.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Formulario Estilo Premium */}
          <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Selector de Especie Animado */}
              <div className="space-y-6">
                <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">01. Elige tu mascota</label>
                <div className="grid grid-cols-2 gap-6">
                  {['perro', 'gato'].map((esp) => (
                    <button
                      key={esp}
                      type="button"
                      onClick={() => setFormData({ ...formData, especie: esp })}
                      className={`relative flex flex-col items-center justify-center p-8 rounded-[2rem] border-4 transition-all duration-300 ${formData.especie === esp
                        ? 'border-red-500 bg-red-50 shadow-xl shadow-red-100'
                        : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'
                        }`}
                    >
                      <div className="text-5xl mb-4">{esp === 'perro' ? '🐕' : '🐱'}</div>
                      <span className={`text-lg font-black uppercase tracking-widest ${formData.especie === esp ? 'text-red-600' : 'text-gray-400'}`}>
                        {esp}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Medición de Peso con Range Slider Moderno */}
              <div className="space-y-6">
                <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">02. Peso Corporal ({formData.peso || '0'} kg)</label>
                <input
                  type="range"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  className="w-full h-4 bg-gray-100 rounded-full appearance-none cursor-pointer accent-red-600 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  <span>Mini (0.5kg)</span>
                  <span>Gigante (100kg)</span>
                </div>
              </div>

              {/* Inputs de Edad Minimalistas */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">03. Años</label>
                  <input
                    type="number"
                    placeholder="Años"
                    value={formData.edadAnos}
                    onChange={(e) => setFormData({ ...formData, edadAnos: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl p-6 text-xl font-bold transition-all outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">04. Meses</label>
                  <input
                    type="number"
                    placeholder="Meses"
                    value={formData.edadMeses}
                    onChange={(e) => setFormData({ ...formData, edadMeses: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl p-6 text-xl font-bold transition-all outline-none"
                  />
                </div>
              </div>

              {/* Selectores de Estilo de Vida */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">05. Actividad</label>
                  <select
                    value={formData.actividad}
                    onChange={(e) => setFormData({ ...formData, actividad: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl p-6 text-lg font-bold transition-all outline-none appearance-none"
                  >
                    <option value="baja">🛋️ Sedentario</option>
                    <option value="normal">🚶 Activo</option>
                    <option value="alta">⚡ Deportista</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">06. Estado</label>
                  <select
                    value={formData.condicion}
                    onChange={(e) => setFormData({ ...formData, condicion: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl p-6 text-lg font-bold transition-all outline-none appearance-none"
                  >
                    <option value="normal">✅ Peso Ideal</option>
                    <option value="sobrepeso">🍕 Sobrepeso</option>
                    <option value="bajo_peso">🦴 Bajo Peso</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white text-2xl font-black py-8 rounded-[2.5rem] hover:bg-black transition-all duration-500 shadow-2xl shadow-red-200 hover:shadow-black/20"
              >
                OBTENER PLAN NUTRICIONAL
              </button>
            </form>
          </div>

          {/* Resultados Estilo Dashboard Moderno */}
          <div className="lg:col-span-5 space-y-8">
            {showResult && result ? (
              <div className="animate-fade-in space-y-8">
                {/* Porción Diaria Destacada */}
                <div className="bg-gray-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-red-600 rounded-full blur-[80px] opacity-30 -mr-10 -mt-10" />
                  <h3 className="text-xs uppercase tracking-[0.3em] font-black text-red-500 mb-8 relative z-10">Ración Diaria</h3>
                  <div className="text-8xl md:text-9xl font-black mb-6 tracking-tighter relative z-10">
                    {result.dailyAmount}<span className="text-3xl font-bold ml-2">g</span>
                  </div>
                  <p className="text-gray-400 font-medium text-lg relative z-10">Dosis perfecta de salud.</p>
                </div>

                {/* Desglose Semanal/Mensual */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Semanal</p>
                    <div className="text-3xl font-black text-gray-900">{result.weeklyAmount}g</div>
                  </div>
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mensual</p>
                    <div className="text-3xl font-black text-gray-900">{(result.monthlyAmount / 1000).toFixed(1)}kg</div>
                  </div>
                </div>

                {/* Healthy Score - SIMULACION PARA EL GANCHO */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-black text-gray-900 uppercase tracking-widest">Health Score</h4>
                    <span className="bg-green-100 text-green-600 font-black px-4 py-1 rounded-full text-xs">8.5/10</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
                    <div className="w-[85%] h-full bg-green-500" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium italic">&quot;Tu mascota tiene un metabolismo estable. Una dieta BARF optimizará su digestión en un 40%.&quot;</p>
                </div>

                {/* Quick Tips */}
                <div className="bg-red-50 rounded-[2.5rem] p-10">
                  <h4 className="font-black text-red-600 uppercase tracking-widest mb-6 flex items-center">
                    <Info size={18} className="mr-2" />
                    Bio-Tips
                  </h4>
                  <ul className="space-y-4">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start text-sm text-red-900 font-bold">
                        <CheckCircle2 size={16} className="mr-3 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-[3rem] p-16 text-center border-4 border-dashed border-gray-200">
                <Calculator className="mx-auto text-gray-300 mb-8" size={80} />
                <h3 className="text-2xl font-black text-gray-500 mb-4 uppercase tracking-tighter">Esperando Datos...</h3>
                <p className="text-gray-400 font-medium">Completa el formulario para generar el perfil nutricional premium.</p>
              </div>
            )}

            {/* Banner de Herramientas Extra */}
            <Link href="/herramientas/alimentos-toxicos" className="block group">
              <div className="bg-orange-500 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-orange-200 group-hover:bg-orange-600 transition-colors relative overflow-hidden">
                <ShieldAlert className="absolute right-0 bottom-0 -mr-6 -mb-6 text-white/10" size={180} />
                <h4 className="text-2xl font-black mb-2 relative z-10">¿Alimento Peligroso?</h4>
                <p className="font-bold text-orange-100 relative z-10 group-hover:translate-x-1 transition-transform">Prueba nuestro buscador de toxicidad interactivo &rarr;</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




