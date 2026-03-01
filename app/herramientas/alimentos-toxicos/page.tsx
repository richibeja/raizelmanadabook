'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle, Search, Info, ShieldAlert } from 'lucide-react';

const TOXIC_FOODS = [
    { name: 'Chocolate', toxic: true, reason: 'Contiene teobromina, tóxica para el corazón y sistema nervioso.', severity: 'Alta' },
    { name: 'Uvas y Pasas', toxic: true, reason: 'Pueden causar insuficiencia renal aguda.', severity: 'Muy Alta' },
    { name: 'Cebolla y Ajo', toxic: true, reason: 'Dañan los glóbulos rojos, causando anemia.', severity: 'Alta' },
    { name: 'Aguacate', toxic: true, reason: 'Contiene persina, que puede causar diarrea y vómitos.', severity: 'Media' },
    { name: 'Alcohol', toxic: true, reason: 'Causa intoxicación grave, coma o muerte.', severity: 'Crtítica' },
    { name: 'Cafeína', toxic: true, reason: 'Afecta el corazón y el sistema nervioso.', severity: 'Alta' },
    { name: 'Xilitol (Edulcorante)', toxic: true, reason: 'Causa caída brusca de azúcar y daño hepático.', severity: 'Muy Alta' },
    { name: 'Macadamias', toxic: true, reason: 'Debilidad, vómitos y temblores.', severity: 'Media' },
    { name: 'Huesos Cocidos', toxic: true, reason: 'Se astillan fácilmente causando perforaciones.', severity: 'Alta' },
    { name: 'Manzana (Semillas)', toxic: true, reason: 'Contienen cianuro.', severity: 'Media' },
    { name: 'Leche (Lactosa)', toxic: true, reason: 'Muchos adultos son intolerantes (causa diarrea).', severity: 'Baja' },
    { name: 'Carne Seleccionada', toxic: false, reason: 'Proteína pura, base de la dieta BARF.', severity: 'Seguro' },
    { name: 'Zanahoria', toxic: false, reason: 'Excelente fuente de fibra y betacarotenos.', severity: 'Seguro' },
    { name: 'Manzana (Sin semillas)', toxic: false, reason: 'Fruta segura y refrescante.', severity: 'Seguro' },
    { name: 'Arándanos', toxic: false, reason: 'Antioxidantes naturales potentes.', severity: 'Seguro' },
];

export default function ToxicFoodChecker() {
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredFoods = TOXIC_FOODS.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-12">
                    <Link href="/" className="inline-flex items-center text-gray-500 hover:text-red-600 font-bold transition-all">
                        <ArrowLeft size={20} className="mr-2" />
                        VOLVER
                    </Link>
                    <RaizelLogo />
                </div>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-3xl mb-6 shadow-xl shadow-red-100">
                        <ShieldAlert size={40} className="text-red-600" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                        ¿Puede Comer <span className="text-red-600">Esto</span>?
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Buscador instantáneo de alimentos tóxicos y seguros para perros y gatos. ¡Salva vidas con un click!
                    </p>
                </div>

                {/* Buscador */}
                <div className="relative max-w-2xl mx-auto mb-16">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    <input
                        type="text"
                        placeholder="Escribe un alimento (ej: Chocolate, Manzana...)"
                        className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] text-xl font-bold focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Lista de alimentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredFoods.map((food, index) => (
                        <div key={index} className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 hover:scale-[1.02] ${food.toxic ? 'bg-red-50 border-red-100 hover:shadow-xl hover:shadow-red-200' : 'bg-green-50 border-green-100 hover:shadow-xl hover:shadow-green-200'
                            }`}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-black text-gray-900">{food.name}</h3>
                                {food.toxic ? (
                                    <XCircle className="text-red-600" size={32} />
                                ) : (
                                    <CheckCircle2 className="text-green-600" size={32} />
                                )}
                            </div>

                            <div className="mb-6">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${food.toxic ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                                    }`}>
                                    {food.toxic ? `Tóxico - Gravedad ${food.severity}` : 'Seguro'}
                                </span>
                            </div>

                            <p className="text-gray-700 font-medium leading-relaxed italic">
                                &quot;{food.reason}&quot;
                            </p>
                        </div>
                    ))}
                </div>

                {/* Advertencia Legal */}
                <div className="mt-20 p-8 bg-gray-900 rounded-[2.5rem] text-white flex items-start space-x-6">
                    <AlertTriangle className="text-yellow-400 flex-shrink-0" size={40} />
                    <div>
                        <h4 className="text-xl font-bold mb-2">Emergencia Veterinaria</h4>
                        <p className="text-gray-400 font-medium">
                            Si tu mascota ingirió alguno de los alimentos marcados como tóxicos, acude inmediatamente a un veterinario. No intentes inducir el vómito sin supervisión médica. Esta guía es informativa y no sustituye el diagnóstico profesional.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link href="/calculadora" className="inline-flex items-center text-red-600 font-black text-lg hover:underline group">
                        VOLVER A LA CALCULADORA DE PORCIONES
                        <ArrowLeft size={20} className="ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
