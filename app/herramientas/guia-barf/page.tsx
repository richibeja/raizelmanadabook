'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    AlertTriangle,
    Thermometer,
    Clock,
    ShieldCheck,
    Droplets,
    Calculator,
    Snowflake,
    Zap,
    ChevronRight,
    MessageCircle
} from 'lucide-react';

export default function GuiaBarf() {
    const [activeSection, setActiveSection] = useState('t-gradual');

    const sections = [
        { id: 't-gradual', title: 'Transición Gradual', icon: <Clock size={20} /> },
        { id: 'manejo', title: 'Manejo e Higiene', icon: <ShieldCheck size={20} /> },
        { id: 'porciones', title: 'Porciones y Tomas', icon: <Calculator size={20} /> },
        { id: 'tips', title: 'Tips Maestros', icon: <Zap size={20} /> }
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-rose-100 font-sans">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header Navigation */}
                <Link href="/" className="inline-flex items-center text-gray-900 hover:text-rose-600 font-bold mb-12 transition-all hover:-translate-x-1 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-rose-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm uppercase tracking-widest leading-none">Volver al Inicio</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sidebar navigation */}
                    <div className="lg:col-span-4 space-y-8">
                        <div>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-600 rounded-3xl mb-6 shadow-xl shadow-rose-200 text-white">
                                <BookOpen size={30} />
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                                Guía <span className="text-rose-600">Maestra</span> BARF.
                            </h1>
                            <p className="text-gray-500 font-medium leading-relaxed">
                                Todo lo que necesitas saber para dar el paso a la alimentación natural de forma profesional y segura.
                            </p>
                        </div>

                        <nav className="space-y-3">
                            {sections.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all font-black text-sm uppercase tracking-widest
                                        ${activeSection === s.id
                                            ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-lg shadow-rose-100'
                                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        {s.icon}
                                        {s.title}
                                    </div>
                                    <ChevronRight size={16} className={activeSection === s.id ? 'opacity-100' : 'opacity-0'} />
                                </button>
                            ))}
                        </nav>

                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                            <ShieldCheck className="absolute right-0 bottom-0 -mr-6 -mb-6 text-white/5" size={120} />
                            <h4 className="text-xl font-black mb-4 relative z-10">Compromiso Raízel</h4>
                            <p className="text-sm text-gray-400 font-medium relative z-10">
                                Nuestros alimentos están balanceados por veterinarios para garantizar que cada bocado sea un seguro de vida.
                            </p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-8">
                        {activeSection === 't-gradual' && (
                            <div className="animate-fade-in space-y-12">
                                <section>
                                    <h2 className="text-3xl font-black text-gray-900 mb-8 border-b-4 border-rose-600 inline-block">El método 75/25 de Transición</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                        {[
                                            { d: 'Días 1-3', p: '25% BARF / 75% Croquetas', desc: 'Comienza con carne blanca (Pollo Raízel) y un poco de calabaza/auyama.' },
                                            { d: 'Días 4-6', p: '50% BARF / 50% Croquetas', desc: 'Aumenta la porción natural. Vigila la consistencia de sus heces.' },
                                            { d: 'Días 7-9', p: '75% BARF / 25% Croquetas', desc: 'Ya casi estamos. Su metabolismo ya está reconociendo la nutrición real.' },
                                            { d: 'Día 10+', p: '100% BARF Raízel', desc: '¡Felicidades! Bienvenido al mundo de la salud biológica.' }
                                        ].map((step, i) => (
                                            <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
                                                <div className="text-rose-600 font-black text-xs uppercase tracking-[0.2em] mb-2">{step.d}</div>
                                                <div className="text-xl font-black text-gray-900 mb-3">{step.p}</div>
                                                <p className="text-sm text-gray-500 font-medium">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-amber-50 rounded-[2.5rem] p-10 border border-amber-100">
                                        <div className="flex items-start gap-4">
                                            <AlertTriangle className="text-amber-600 flex-shrink-0" size={32} />
                                            <div>
                                                <h4 className="text-xl font-black text-amber-900 mb-2">REGLA DE ORO</h4>
                                                <p className="text-amber-800 font-medium text-lg leading-relaxed">
                                                    <b>NUNCA mezcles croquetas y BARF en la misma toma.</b> Las croquetas tardan hasta 12h en digerirse, mientras que el BARF solo 4h. Mezclarlas puede causar fermentación y gases.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeSection === 'manejo' && (
                            <div className="animate-fade-in space-y-12">
                                <section>
                                    <h2 className="text-3xl font-black text-gray-900 mb-8 border-b-4 border-rose-600 inline-block">Higiene y Descongelado</h2>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6 p-8 bg-blue-50 rounded-3xl border border-blue-100">
                                            <Snowflake className="text-blue-600" size={40} />
                                            <div>
                                                <h4 className="text-xl font-black text-blue-900 mb-1">Descongelado en Nevera</h4>
                                                <p className="text-blue-800 font-medium text-sm">Pasa la ración del congelador a la parte baja de la nevera 24h antes de servir. Evita cambios bruscos.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 p-8 bg-red-50 rounded-3xl border border-red-100">
                                            <Thermometer className="text-red-600" size={40} />
                                            <div>
                                                <h4 className="text-xl font-black text-red-900 mb-1">PROHIBIDO Microondas</h4>
                                                <p className="text-red-800 font-medium text-sm">El microondas cocina los huesos (incluso si están molidos), haciéndolos peligrosos. Sirve a temperatura ambiente.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 p-8 rounded-3xl">
                                                <Droplets className="text-rose-600 mb-4" size={24} />
                                                <h5 className="font-black text-gray-900 mb-2">Limpieza de Recipientes</h5>
                                                <p className="text-sm text-gray-500 font-medium italic">Lava el plato de tu mascota después de cada toma como si fuera el tuyo.</p>
                                            </div>
                                            <div className="bg-gray-50 p-8 rounded-3xl">
                                                <ShieldCheck className="text-green-600 mb-4" size={24} />
                                                <h5 className="font-black text-gray-900 mb-2">Caducidad</h5>
                                                <p className="text-sm text-gray-500 font-medium italic">Una vez descongelado, el BARF dura máximo 48h en la nevera.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeSection === 'porciones' && (
                            <div className="animate-fade-in space-y-12 text-center">
                                <div className="py-20 bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-200">
                                    <Calculator className="mx-auto text-rose-300 mb-8" size={80} />
                                    <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter">¿Cuántos gramos hoy?</h2>
                                    <p className="text-xl text-gray-500 max-w-lg mx-auto mb-12 font-medium">
                                        Usa nuestra calculadora inteligente para obtener la ración exacta según peso, edad y actividad.
                                    </p>
                                    <Link
                                        href="/calculadora"
                                        className="inline-flex items-center gap-4 bg-rose-600 text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-rose-200"
                                    >
                                        IR A LA CALCULADORA <ChevronRight size={24} />
                                    </Link>
                                </div>
                            </div>
                        )}

                        {activeSection === 'tips' && (
                            <div className="animate-fade-in space-y-8">
                                <h2 className="text-3xl font-black text-gray-900 mb-4 border-b-4 border-rose-600 inline-block">Secretos del Experto</h2>

                                <div className="space-y-4">
                                    {[
                                        { t: 'Dientes como Perlas', d: 'El BARF previene el sarro. No te asustes si mastican un poco más, es su cepillo de dientes natural.' },
                                        { t: 'Heces Pequeñas y Firmes', d: 'Notarás que ahora recoge menos. Es porque están absorbiendo el 90% de los nutrientes.' },
                                        { t: 'Menos Olor Corporal', d: 'La dieta natural reduce el "olor a perro" y el olor de las heces considerablemente.' },
                                        { t: 'Paciencia en la Transición', d: 'Algunos perros pueden tener heces un poco más blandas la primera semana. Es parte de la bio-detox.' }
                                    ].map((tip, i) => (
                                        <div key={i} className="flex gap-6 p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-xl transition-all group">
                                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-gray-900 mb-1">{tip.t}</h4>
                                                <p className="text-gray-500 font-medium">{tip.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 text-center p-12 bg-gray-900 rounded-[4rem] text-white">
                                    <h3 className="text-3xl font-black mb-6">¿Dudas en el proceso?</h3>
                                    <a
                                        href="https://wa.me/573108188723?text=Hola! Estoy haciendo la transición a BARF y tengo algunas dudas."
                                        target="_blank"
                                        className="inline-flex items-center gap-3 bg-green-500 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-green-600 transition-all shadow-2xl shadow-green-500/20"
                                    >
                                        <MessageCircle size={24} /> CHAT CON ESPECIALISTA
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
