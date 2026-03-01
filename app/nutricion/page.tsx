'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Microscope, Apple, Heart, Info, Clock, CheckCircle2, LayoutDashboard, Smartphone } from 'lucide-react';

export default function NutricionPage() {
    const proteins = [
        {
            name: 'Pollo (Artesanal)',
            icon: '🍗',
            description: 'Proteína de alta digestibilidad, presentada en albóndigas recubiertas de avena. Ideal para el mantenimiento muscular y energía diaria.',
            stats: { protein: '18%', fat: '12%', moisture: '65%', fiber: '2%' },
            ingredients: ['Pechuga de Pollo', 'Hígado de Pollo', 'Avena Integral', 'Zanahoria', 'Espinaca', 'Corazón de Pollo', 'Aceite de Coco'],
            benefits: ['Digestión Ligera', 'Piel Saludable', 'Alta Palatabilidad']
        },
        {
            name: 'Res (Fuerza)',
            icon: '🥩',
            description: 'Rica en hierro y vitamina B12, en formato de albóndigas recubiertas de avena. Perfecta para mascotas activas y fortalecimiento inmunológico.',
            stats: { protein: '20%', fat: '14%', moisture: '62%', fiber: '2%' },
            ingredients: ['Carne de Res Magra', 'Bofe', 'Riñón', 'Avena Integral', 'Calabacín', 'Auyama', 'Semillas de Chía'],
            benefits: ['Energía Extra', 'Músculos Fuertes', 'Vitalidad']
        },
        {
            name: 'Cordero (Premium)',
            icon: '🐑',
            description: 'Proteína hipoalergénica en albóndigas recubiertas de avena. Ideal para mascotas con sensibilidades alimentarias o piel delicada.',
            stats: { protein: '17%', fat: '15%', moisture: '64%', fiber: '2%' },
            ingredients: ['Carne de Cordero', 'Hígado de Cordero', 'Avena Integral', 'Manzana', 'Brócoli', 'Aceite de Oliva', 'Cúrcuma'],
            benefits: ['Cero Alergias', 'Brillo en el Pelo', 'Articulaciones Sanas']
        }
    ];

    const RaizelLogo = ({ className = "text-2xl" }) => (
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

    return (
        <div className="min-h-screen bg-[#f3ede4] pb-20">
            {/* Header */}
            <header className="bg-white border-b border-[#4a3728]/10 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                        <ArrowLeft className="text-[#4a3728]" size={24} />
                    </Link>
                    <RaizelLogo />
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                        <ShieldCheck size={14} /> Certificación Nutricional
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-[#4a3728] tracking-tighter uppercase italic leading-none mb-6">
                        Análisis <span className="text-green-700 tracking-[0.2em] not-italic font-black text-2xl align-middle mx-4 underline decoration-[#4a3728]/20">Real</span> Garantizado
                    </h1>
                    <p className="text-gray-600 font-bold max-w-2xl mx-auto italic">
                        &quot;Nutrición natural y potente para perros campeones.&quot;
                    </p>
                </div>

                {/* Nutritional Cards */}
                <div className="space-y-12">
                    {proteins.map((p, i) => (
                        <div key={i} className="bg-[#c8b29b] rounded-[2.5rem] shadow-2xl border-4 border-white overflow-hidden group hover:scale-[1.02] transition-all">
                            <div className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row gap-10">
                                    {/* Left Side: Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-[#4a3728]">
                                                <span className="text-5xl">{p.icon}</span>
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">{p.name}</h2>
                                                <div className="flex items-center gap-2 text-[#4a3728] font-black text-[10px] uppercase tracking-widest">
                                                    <CheckCircle2 size={12} /> Hecho Artesanalmente
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[#4a3728] font-bold mb-8 leading-relaxed italic bg-white/20 p-4 rounded-xl border border-white/30">
                                            {p.description}
                                        </p>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                            {Object.entries(p.stats).map(([k, v]) => (
                                                <div key={k} className="bg-white rounded-2xl p-4 text-center border-2 border-[#4a3728]">
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{k === 'protein' ? 'Proteína' : k === 'fat' ? 'Grasa' : k === 'moisture' ? 'Humedad' : 'Fibra'}</div>
                                                    <div className="text-lg font-black text-[#4a3728]">{v}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] drop-shadow-sm">Ingredientes de Grado Humano</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {p.ingredients.map((ing, idx) => (
                                                    <span key={idx} className="bg-white text-[#4a3728] px-3 py-1.5 rounded-lg text-xs font-black border-2 border-[#4a3728]/20 shadow-sm">
                                                        {ing}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Benefits */}
                                    <div className="w-full md:w-64 bg-[#4a3728] rounded-3xl p-8 text-white shadow-xl">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6 flex items-center gap-2">
                                            <Microscope size={14} className="text-green-500" /> Bio-Beneficios
                                        </h4>
                                        <ul className="space-y-6">
                                            {p.benefits.map((b, idx) => (
                                                <li key={idx} className="flex items-start gap-3">
                                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                                                        <CheckCircle2 size={10} className="text-white" />
                                                    </div>
                                                    <span className="text-sm font-black tracking-tight italic uppercase">{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-10 pt-10 border-t border-white/10">
                                            <div className="bg-white/10 p-4 rounded-xl mb-4 border border-white/5">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-green-400 mb-2">Compromiso Artesanal</div>
                                                <p className="text-[10px] font-bold text-gray-300 leading-tight">Procesado en pequeños lotes para garantizar frescura absoluta. Grado humano, sin subproductos industriales.</p>
                                            </div>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">Nutrición de Élite por</div>
                                            <div className="text-lg font-black italic tracking-tighter">VITAL BARF</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* New: CTA to App */}
                <div className="mt-16 bg-white rounded-[3rem] p-10 shadow-xl border-4 border-green-700/10 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-700">
                        <Smartphone size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-[#4a3728] tracking-tighter uppercase italic mb-4">
                        Gestiona su Bienestar
                    </h2>
                    <p className="text-gray-600 font-bold mb-8 max-w-md mx-auto italic">
                        Usa nuestra herramienta gratuita para organizar la rutina de tu mascota, su peso y calendario de vacunas.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 bg-green-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-[#4a3728] transition-all transform hover:-translate-y-1"
                    >
                        <LayoutDashboard size={20} /> Entrar a ManadaBook
                    </Link>
                </div>

                {/* Bottom Assurance */}
                <div className="mt-20 bg-[#4a3728] rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <div className="bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white/20">
                            <Heart className="text-white" size={32} />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter italic uppercase mb-4">Aliado Natural para su Rendimiento</h3>
                        <p className="text-gray-300 font-bold max-w-xl mx-auto text-lg leading-relaxed italic">
                            &quot;Más que alimento, un estilo de vida artesanal, sin químicos ni conservantes.&quot;
                        </p>
                        <div className="mt-10 flex flex-col items-center">
                            <div className="w-12 h-1 bg-green-600 rounded-full mb-6"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-2 tracking-[1em]">Original Concept</p>
                            <p className="text-2xl font-black italic tracking-tighter text-white underline decoration-green-600 decoration-4 underline-offset-8">Richard Bejarano A</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
