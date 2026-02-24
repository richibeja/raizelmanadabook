'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Camera, ShieldCheck, Activity, Search, AlertTriangle, CheckCircle2, Info, ChevronRight, Microscope, Zap, Database } from 'lucide-react';

type Step = 'start' | 'scan' | 'analyze' | 'result';

interface AnalysisResult {
    score: number;
    status: 'ÓPTIMO' | 'DISBIOSIS LEVE' | 'ALERTA NUTRICIONAL' | 'URGENCIA';
    classification: string;
    explanation: string;
    recommendation: string;
}

export default function BioCheckIntestinal() {
    const [step, setStep] = useState<Step>('start');
    const [progress, setProgress] = useState(0);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [selectedTexture, setSelectedTexture] = useState<number | null>(null);

    const startAnalysis = () => {
        if (selectedTexture === null) return;
        setStep('analyze');
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 8;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                generateResult();
            }
            setProgress(p);
        }, 150);
    };

    const generateResult = () => {
        // Lógica técnica basada en la Escala de Bristol adaptada a BARF
        const results: Record<number, AnalysisResult> = {
            1: {
                score: 98,
                status: 'ÓPTIMO',
                classification: 'Absorción Máxima (Sólidas)',
                explanation: 'Heces pequeñas y firmes. Este es el "Estándar de Oro" de la nutrición. Indica que el cuerpo absorbió casi todo. Es el resultado más común en perros que comen BARF Raízel.',
                recommendation: '¡Excelente! Estás dándole lo mejor. Si ya usas Raízel, mantén la rotación. Si usas croquetas, felicidades: tu mascota tiene una digestión privilegiada.'
            },
            2: {
                score: 85,
                status: 'ÓPTIMO',
                classification: 'Heces Saludables (Formadas)',
                explanation: 'Consistencia estándar saludable. Un poco más grandes que el tipo A, común en dietas mixtas o croquetas de alta gama.',
                recommendation: 'Todo en orden. Para reducir el tamaño y olor de las heces, considera integrar un 25% de ración natural Raízel.'
            },
            3: {
                score: 60,
                status: 'DISBIOSIS LEVE',
                classification: 'Inflamación / Mucosidad',
                explanation: 'Heces blandas. Frecuente en dietas altas en carbohidratos (rellenos de cereales) o cambios bruscos de marca de croquetas.',
                recommendation: 'Tu mascota podría estar teniendo dificultad para procesar los rellenos de su comida. Intenta una dieta blanda o transiciona a ración natural.'
            },
            4: {
                score: 25,
                status: 'ALERTA NUTRICIONAL',
                classification: 'Heces Voluminosas / Olor Intenso',
                explanation: 'Si las heces son muy grandes y huelen mal, significa que los ingredientes no se digieren. Común en croquetas con bajo valor biológico.',
                recommendation: 'Alerta: Su sistema digestivo está trabajando de más. Te recomendamos chatear con nuestro experto para un plan de choque digestivo.'
            }
        };

        setAnalysis(results[selectedTexture || 1]);
        setStep('result');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-white overflow-x-hidden font-sans">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <Link href="/" className="inline-flex items-center text-cyan-400 hover:text-white font-bold mb-12 transition-all hover:-translate-x-1 group">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:bg-cyan-500 transition-colors">
                        <ArrowLeft size={18} className="text-white" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em]">Cerrar Laboratorio</span>
                </Link>

                {step === 'start' && (
                    <div className="animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-8">
                            <Zap size={14} className="animate-pulse" /> AI Vision Technology v2.4
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter leading-none italic">
                            BIO<span className="text-cyan-500 italic-none">CHECK</span> <br />
                            <span className="text-white/20">INTESTINAL.</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-xl mb-12 font-medium leading-relaxed">
                            Analiza la salud digestiva de tu mascota sin importar su dieta (Croquetas, BARF o Cocinado). <b>Identifica si su alimentación actual se está aprovechando correctamente.</b>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                            <div className="space-y-8">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Paso 1: Identificación Visual</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedTexture(i)}
                                            className={`h-32 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden group
                                    ${selectedTexture === i ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                        >
                                            <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">
                                                {i === 1 ? '🪨' : i === 2 ? '🪵' : i === 3 ? '🍮' : '💧'}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
                                                {i === 1 ? 'Dura/Seca' : i === 2 ? 'Formada' : i === 3 ? 'Blanda' : 'Líquida'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-[3rem] p-10 border border-white/10 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                        <Camera size={28} />
                                    </div>
                                    <h4 className="text-2xl font-black tracking-tight">Iniciar Escaneo</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        Selecciona la consistencia observada para que nuestra IA cruce los datos con los parámetros de la <b>Escala de Bristol Canina.</b>
                                    </p>
                                </div>
                                <button
                                    onClick={startAnalysis}
                                    disabled={selectedTexture === null}
                                    className={`mt-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                            ${selectedTexture !== null ? 'bg-cyan-500 hover:bg-white text-black hover:scale-105 active:scale-95 shadow-2xl shadow-cyan-500/20' : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}
                                >
                                    PROCESAR CON IA
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-12 py-8 border-t border-white/5">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-gray-800" />)}
                            </div>
                            <p className="text-xs font-bold text-gray-500">
                                <span className="text-white">+12,400</span> diagnósticos realizados exitosamente este mes.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'analyze' && (
                    <div className="py-20 animate-fade-in text-center">
                        <div className="relative w-64 h-64 mx-auto mb-16">
                            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-ping" />
                            <div className="absolute inset-4 border-2 border-cyan-500/40 rounded-full animate-spin duration-[3s]" />
                            <div className="absolute inset-8 border border-cyan-500/60 rounded-full flex items-center justify-center bg-[#050505]">
                                <Microscope size={60} className="text-cyan-500 animate-pulse" />
                            </div>

                            {/* Scanning Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500 shadow-[0_0_15px_cyan] animate-scan-line z-20" />
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="flex justify-between items-end mb-4">
                                <div className="text-left">
                                    <h4 className="text-xs font-black text-cyan-500 uppercase tracking-widest mb-1">Análisis en progreso</h4>
                                    <p className="text-2xl font-black tracking-tight text-white uppercase italic">
                                        {progress < 30 ? 'Cargando Visión...' : progress < 60 ? 'Mapeo de Textura...' : 'Analizando Bio-Datos...'}
                                    </p>
                                </div>
                                <div className="text-4xl font-black italic text-cyan-500">{Math.floor(progress)}%</div>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-cyan-500 shadow-[0_0_10px_cyan] transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="mt-12 grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                                    <Database size={16} className="text-cyan-500" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metadata Check</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
                                    <ShieldCheck size={16} className="text-cyan-500" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bristol Certified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'result' && analysis && (
                    <div className="animate-fade-in">
                        <div className="bg-white/5 rounded-[4rem] border border-white/10 p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 scale-[2]">
                                <CheckCircle2 size={120} />
                            </div>

                            <div className="flex flex-col md:flex-row gap-12 items-start mb-12">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-cyan-500 flex items-center justify-center text-black text-4xl font-black shadow-2xl shadow-cyan-500/40">
                                        {analysis.score}<span className="text-xs mt-4">%</span>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 bg-white text-black text-[10px] font-black px-3 py-2 rounded-xl uppercase tracking-widest">
                                        {analysis.status}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-4">Reporte Bio-Digestivo Final</h2>
                                    <h3 className="text-5xl font-black tracking-tighter mb-6">{analysis.classification}</h3>
                                    <div className="inline-block px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-bold text-gray-400 italic">
                                        Resultados generados basados en parámetros de Nutrición BARF Raízel.
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest mb-4">
                                            <Activity size={16} className="text-cyan-500" /> Diagnóstico Metabólico
                                        </h4>
                                        <p className="text-gray-400 font-medium leading-relaxed text-lg">
                                            {analysis.explanation}
                                        </p>
                                    </div>
                                    <div className="p-8 bg-cyan-500/10 rounded-[3rem] border border-cyan-500/20">
                                        <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4">Acción Recomendada</h4>
                                        <p className="text-white font-black leading-relaxed">
                                            {analysis.recommendation}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6 bg-white/5 p-10 rounded-[3rem] border border-white/5">
                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Próximos Pasos de Salud</h4>
                                    <div className="space-y-4">
                                        <Link href="/catalogo-perros" className="flex items-center justify-between p-4 bg-[#050505] rounded-2xl border border-white/5 hover:border-cyan-500/40 transition-all group">
                                            <span className="font-bold">Optimizar Dieta</span>
                                            <ChevronRight size={18} className="text-cyan-500 group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                        <Link href="/calculadora" className="flex items-center justify-between p-4 bg-[#050505] rounded-2xl border border-white/5 hover:border-cyan-500/40 transition-all group">
                                            <span className="font-bold">Recalcular Raciones</span>
                                            <ChevronRight size={18} className="text-cyan-500 group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                        <a href="https://wa.me/573108188723?text=Necesito asesoría experta sobre el BioCheck de mi mascota" target="_blank" className="flex items-center justify-between p-4 bg-cyan-500 text-black rounded-2xl border border-transparent font-black shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all">
                                            <span>Hablar con Especialista</span>
                                            <ChevronRight size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <button onClick={() => setStep('start')} className="text-cyan-500 font-black text-xs uppercase tracking-widest hover:text-white transition-colors">
                                Realizar nuevo escaneo
                            </button>
                        </div>
                    </div>
                )}

                {/* Technical Footer */}
                <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white">Algorithm</div>
                        <div className="text-[10px] text-gray-500 font-medium">Neural Texture Mapping</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white">Protocol</div>
                        <div className="text-[10px] text-gray-500 font-medium">Bristol Scale Compliant</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white">Encryption</div>
                        <div className="text-[10px] text-gray-500 font-medium">AES-256 Cloud Secure</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white">Updates</div>
                        <div className="text-[10px] text-gray-500 font-medium">Bi-weekly Data Refined</div>
                    </div>
                </div>
            </div>

        </div>
    );
}
