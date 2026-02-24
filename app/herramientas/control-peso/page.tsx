'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, TrendingUp, TrendingDown, Plus, Trash2, Calendar, Target, Info, CheckCircle2 } from 'lucide-react';

interface WeightEntry {
    id: string;
    weight: number;
    date: string;
    note: string;
}

export default function ControlPeso() {
    const [entries, setEntries] = useState<WeightEntry[]>([]);
    const [petName, setPetName] = useState('');
    const [targetWeight, setTargetWeight] = useState('');
    const [newWeight, setNewWeight] = useState('');
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        const savedName = localStorage.getItem('raizel_pet_name');
        const savedEntries = localStorage.getItem('raizel_weight_entries');
        const savedTarget = localStorage.getItem('raizel_target_weight');
        if (savedName) setPetName(savedName);
        if (savedEntries) setEntries(JSON.parse(savedEntries));
        if (savedTarget) setTargetWeight(savedTarget);
    }, []);

    useEffect(() => {
        localStorage.setItem('raizel_weight_entries', JSON.stringify(entries));
        if (targetWeight) localStorage.setItem('raizel_target_weight', targetWeight);
    }, [entries, targetWeight]);

    const addEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWeight) return;

        const entry: WeightEntry = {
            id: Math.random().toString(36).substr(2, 9),
            weight: parseFloat(newWeight),
            date: new Date().toISOString().split('T')[0],
            note: newNote
        };

        setEntries([entry, ...entries]);
        setNewWeight('');
        setNewNote('');
    };

    const deleteEntry = (id: string) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const getWeightChange = () => {
        if (entries.length < 2) return 0;
        return entries[0].weight - entries[1].weight;
    };

    const change = getWeightChange();

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in font-sans">
                <Link href="/" className="inline-flex items-center text-gray-900 hover:text-blue-600 font-bold mb-8 transition-all hover:-translate-x-1 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-blue-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm uppercase tracking-widest leading-none">Volver al Inicio</span>
                </Link>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-3xl mb-6 shadow-xl shadow-blue-100">
                        <Scale size={40} className="text-blue-600" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                        Monitor De <span className="text-blue-600">Bienestar</span>.
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Sigue la evolución de {petName || 'tu mascota'}. Un peso estable es el mejor indicador de una nutrición BARF exitosa.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Dashboard Lateral */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10" />
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-blue-400 mb-6">Peso Actual</h3>
                            <div className="text-6xl font-black mb-2 tracking-tighter">
                                {entries[0]?.weight || '--'}<span className="text-xl font-bold ml-1 text-gray-400">kg</span>
                            </div>
                            <div className="flex items-center text-sm font-bold">
                                {change !== 0 && (
                                    <>
                                        {change > 0 ? <TrendingUp size={16} className="text-red-400 mr-1" /> : <TrendingDown size={16} className="text-green-400 mr-1" />}
                                        <span className={change > 0 ? 'text-red-400' : 'text-green-400'}>
                                            {Math.abs(change).toFixed(1)}kg desde la última vez
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Peso Ideal (Meta)</h3>
                            <div className="flex items-center gap-4">
                                <Target className="text-blue-600" size={24} />
                                <input
                                    type="number"
                                    placeholder="Ej: 15.0"
                                    className="text-3xl font-black text-gray-900 bg-transparent border-none focus:ring-0 w-full placeholder:text-gray-100"
                                    value={targetWeight}
                                    onChange={(e) => setTargetWeight(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-[2.5rem] p-8">
                            <div className="flex items-start gap-4">
                                <Info className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                                <p className="text-sm font-medium text-blue-900 italic">
                                    "En dietas naturales, es normal ver variaciones. Lo ideal es que {petName || 'tu mascota'} mantenga su peso meta con un margen de +/- 0.5kg."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Registro de Pesaje */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-8">Nuevo Registro</h2>
                            <form onSubmit={addEntry} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Peso (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="00.0"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl p-6 text-2xl font-black focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newWeight}
                                        onChange={(e) => setNewWeight(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Nota (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Después de ejercicio"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-6 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="md:col-span-2 bg-blue-600 text-white font-black py-6 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100">
                                    <Plus size={20} />
                                    REGISTRAR PESO HOY
                                </button>
                            </form>
                        </div>

                        {/* Historial */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-4">Historial de Evolución</h3>
                            {entries.length > 0 ? (
                                <div className="space-y-3">
                                    {entries.map((entry) => (
                                        <div key={entry.id} className="bg-white rounded-[2rem] p-6 border border-gray-50 shadow-sm flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600">
                                                    <Calendar size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-2xl font-black text-gray-900">{entry.weight}<span className="text-xs font-bold text-gray-400 ml-1">kg</span></p>
                                                    <p className="text-xs font-bold text-gray-400">{entry.date} {entry.note && `• ${entry.note}`}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => deleteEntry(entry.id)} className="text-gray-200 hover:text-red-500 transition-colors p-2">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3rem]">
                                    <Scale className="mx-auto text-gray-200 mb-4" size={48} />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Sin registros aún</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
