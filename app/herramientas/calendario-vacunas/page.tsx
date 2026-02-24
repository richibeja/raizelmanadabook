'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Syringe, Calendar, CheckCircle2, Clock, AlertCircle, Plus, Trash2, Bell, Info } from 'lucide-react';

interface Vaccine {
    id: string;
    name: string;
    date: string;
    nextDate: string;
    type: 'Esencial' | 'Opcional';
    description: string;
}

const DEFAULT_VACCINES = [
    { id: '1', name: 'Rabia', intervalMonths: 12, type: 'Esencial', description: 'Obligatoria por ley. Protege contra el virus de la rabia.' },
    { id: '2', name: 'Pentavalent / Triple Viral', intervalMonths: 12, type: 'Esencial', description: 'Protege contra Moquillo, Parvovirus, Hepatitis, Leptospirosis y Parainfluenza.' },
    { id: '3', name: 'Parvovirus (Refuerzo)', intervalMonths: 12, type: 'Esencial', description: 'Crucial para cachorros y refuerzos anuales.' },
    { id: '4', name: 'Tos de las Perreras (KC)', intervalMonths: 6, type: 'Opcional', description: 'Recomendada si tu perro frecuenta parques o guarderías.' },
];

export default function CalendarioVacunas() {
    const [petName, setPetName] = useState('');
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [isFirstTime, setIsFirstTime] = useState(true);

    // Cargar datos de localStorage al iniciar
    useEffect(() => {
        const savedPet = localStorage.getItem('raizel_pet_name');
        const savedVaccines = localStorage.getItem('raizel_vaccines');
        if (savedPet) setPetName(savedPet);
        if (savedVaccines) {
            setVaccines(JSON.parse(savedVaccines));
            setIsFirstTime(false);
        }
    }, []);

    // Guardar datos en localStorage
    useEffect(() => {
        if (petName) localStorage.setItem('raizel_pet_name', petName);
        if (vaccines.length > 0) localStorage.setItem('raizel_vaccines', JSON.stringify(vaccines));
    }, [petName, vaccines]);

    const addVaccineRecord = (v: typeof DEFAULT_VACCINES[0], date: string) => {
        const lastDate = new Date(date);
        const nextDate = new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth() + v.intervalMonths);

        const newRecord: Vaccine = {
            id: Math.random().toString(36).substr(2, 9),
            name: v.name,
            date: date,
            nextDate: nextDate.toISOString().split('T')[0],
            type: v.type as 'Esencial' | 'Opcional',
            description: v.description
        };

        setVaccines(prev => [...prev, newRecord]);
        setIsFirstTime(false);
    };

    const deleteRecord = (id: string) => {
        setVaccines(prev => prev.filter(v => v.id !== id));
    };

    const getDaysUntil = (dateStr: string) => {
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in font-sans">
                <Link href="/" className="inline-flex items-center text-gray-900 hover:text-green-600 font-bold mb-8 transition-all hover:-translate-x-1 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-green-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm uppercase tracking-widest leading-none">Volver al Inicio</span>
                </Link>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl mb-6 shadow-xl shadow-green-100">
                        <Syringe size={40} className="text-green-600" />
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                        Pasaporte De <span className="text-green-600">Salud</span>.
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Digitaliza el carnet de tu mascota. Nunca más olvides una vacuna y mantén a tu mejor amigo protegido siempre.
                    </p>
                </div>

                {/* Input de Nombre de Mascota */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">🐾</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nombre de tu Mascota</h3>
                        <input
                            type="text"
                            placeholder="Ej: Max, Luna..."
                            className="text-3xl font-black text-gray-900 bg-transparent border-none focus:ring-0 w-full placeholder:text-gray-200 outline-none"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Listado de Vacunas Pendientes / Agregadas */}
                    <div className="lg:col-span-12 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Vacunas Registradas</h2>
                            <Bell className="text-green-600 animate-bounce" size={24} />
                        </div>

                        {vaccines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {vaccines.map((v) => {
                                    const daysLeft = getDaysUntil(v.nextDate);
                                    const isUrgent = daysLeft < 15;
                                    return (
                                        <div key={v.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`p-4 rounded-2xl ${isUrgent ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                    <Calendar size={28} />
                                                </div>
                                                <button onClick={() => deleteRecord(v.id)} className="text-gray-300 hover:text-red-500 p-2 transition-colors">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <h3 className="text-2xl font-black text-gray-900 mb-2 truncate">{v.name}</h3>
                                            <p className="text-sm font-medium text-gray-400 mb-6">{v.type}</p>

                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Última Dosis:</span>
                                                    <span className="text-gray-900 font-black">{v.date}</span>
                                                </div>
                                                <div className="flex justify-between text-sm items-center">
                                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Próxima Dosis:</span>
                                                    <div className={`px-4 py-2 rounded-xl font-black ${isUrgent ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'}`}>
                                                        {v.nextDate}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <Clock size={16} className="text-gray-300 mr-2" />
                                                    <span className={`text-sm font-black ${isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
                                                        {daysLeft < 0 ? '¡Vencida!' : `En ${daysLeft} días`}
                                                    </span>
                                                </div>
                                                <CheckCircle2 className="text-green-500" size={24} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-[3rem] p-16 text-center border-4 border-dashed border-gray-200">
                                <Clock className="mx-auto text-gray-300 mb-6" size={60} />
                                <h3 className="text-2xl font-black text-gray-400 mb-2 tracking-tighter uppercase">Sin Registros</h3>
                                <p className="text-gray-400 font-medium max-w-xs mx-auto">Selecciona una vacuna abajo para empezar a digitalizar el carnet de {petName || 'tu mascota'}.</p>
                            </div>
                        )}
                    </div>

                    {/* Selector de Nueva Vacuna */}
                    <div className="lg:col-span-12 mt-12">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-8">Digitalizar Vacuna</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {DEFAULT_VACCINES.map((v) => (
                                <div key={v.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-green-300 transition-all shadow-sm group">
                                    <h4 className="font-black text-gray-900 mb-2 truncate text-lg uppercase tracking-tight">{v.name}</h4>
                                    <p className="text-xs text-gray-400 mb-6 leading-relaxed font-medium line-clamp-2">{v.description}</p>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">¿Cuándo fue la última?</label>
                                        <input
                                            type="date"
                                            className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-green-500 outline-none"
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    addVaccineRecord(v, e.target.value);
                                                    e.target.value = ''; // Reset
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mt-20 p-8 bg-black rounded-[2.5rem] text-white flex items-center space-x-8 shadow-2xl">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Info className="text-green-500" size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-1 tracking-tight">Consejo Profesional 🩺</h4>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Las vacunas son la barrera #1 contra enfermedades mortales. Mantener el registro digital en la App de Raízel te ayuda a estar un paso adelante. ¡Una mascota sana es una mascota feliz!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
