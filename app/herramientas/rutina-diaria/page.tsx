'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Utensils, Droplets, Footprints, Heart, Camera, Plus, CheckCircle2, Trophy, Bell, Settings, Trash2, Edit2 } from 'lucide-react';

interface RoutineTask {
    id: string;
    name: string;
    time: string;
    completed: boolean;
    type: 'food' | 'water' | 'walk' | 'play' | 'meds' | 'clean';
}

export default function RutinaDiaria() {
    const [petName, setPetName] = useState('');
    const [tasks, setTasks] = useState<RoutineTask[]>([]);
    const [careScore, setCareScore] = useState(0);
    const [petImage, setPetImage] = useState<string | null>(null);

    useEffect(() => {
        const savedName = localStorage.getItem('raizel_pet_name');
        const savedImage = localStorage.getItem('raizel_pet_image');
        const savedTasks = localStorage.getItem('raizel_daily_tasks');
        const lastAccess = localStorage.getItem('raizel_last_routine_access');

        if (savedName) setPetName(savedName);
        if (savedImage) setPetImage(savedImage);

        const today = new Date().toISOString().split('T')[0];

        if (savedTasks && lastAccess === today) {
            setTasks(JSON.parse(savedTasks));
        } else {
            // Rutina inicial sugerida
            const defaultTasks: RoutineTask[] = [
                { id: '1', name: 'Alimentación Mañana', time: '08:00', completed: false, type: 'food' },
                { id: '2', name: 'Refrescar Agua', time: '09:00', completed: false, type: 'water' },
                { id: '3', name: 'Paseo Largo', time: '10:00', completed: false, type: 'walk' },
                { id: '4', name: 'Sesión de Juego', time: '14:00', completed: false, type: 'play' },
                { id: '5', name: 'Alimentación Tarde', time: '18:00', completed: false, type: 'food' },
                { id: '6', name: 'Paseo Nocturno', time: '21:00', completed: false, type: 'walk' },
            ];
            setTasks(defaultTasks);
            localStorage.setItem('raizel_daily_tasks', JSON.stringify(defaultTasks));
            localStorage.setItem('raizel_last_routine_access', today);
        }
    }, []);

    useEffect(() => {
        const completed = tasks.filter(t => t.completed).length;
        const score = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
        setCareScore(score);
        localStorage.setItem('raizel_daily_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPetImage(base64String);
                localStorage.setItem('raizel_pet_image', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-20">
            <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in font-sans">
                <Link href="/" className="inline-flex items-center text-gray-900 hover:text-indigo-600 font-bold mb-10 transition-all hover:-translate-x-1 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm uppercase tracking-widest leading-none">Volver al Inicio</span>
                </Link>

                {/* Pet Profile Header */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60" />

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl">
                                {petImage ? (
                                    <img src={petImage} alt="Mascota" className="w-full h-full object-cover" />
                                ) : (
                                    <Heart size={60} className="text-indigo-300" />
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera size={24} className="text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                <input
                                    type="text"
                                    placeholder="Nombre de tu mascota"
                                    className="text-4xl md:text-5xl font-black text-gray-900 bg-transparent border-none p-0 focus:ring-0 placeholder:text-gray-100"
                                    value={petName}
                                    onChange={(e) => {
                                        setPetName(e.target.value);
                                        localStorage.setItem('raizel_pet_name', e.target.value);
                                    }}
                                />
                            </div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">Asistente de Cuidado Diario</p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl">
                                    <Trophy size={16} className="text-indigo-600" />
                                    <span className="text-sm font-black text-indigo-900">{careScore}% Cuidado Hoy</span>
                                </div>
                                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-2xl text-green-600 font-black text-sm">
                                    <CheckCircle2 size={16} /> Completando Desafíos
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">Misión del Día</h3>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-6xl font-black">{tasks.filter(t => t.completed).length}</span>
                            <span className="text-2xl font-bold text-gray-500 mb-2">/ {tasks.length}</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-500 transition-all duration-1000"
                                style={{ width: `${careScore}%` }}
                            />
                        </div>
                        <p className="mt-6 text-sm text-gray-400 font-medium">
                            {careScore === 100 ? '¡Tu mascota está viviendo su mejor vida! 🌟' : 'Faltan detalles para un día perfecto.'}
                        </p>
                    </div>

                    <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl">
                        <div>
                            <Bell size={32} className="mb-6 opacity-80" />
                            <h3 className="text-2xl font-black mb-2 leading-tight">Activa tus Alertas</h3>
                            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                                Configura las horas ideales para que {petName || 'tu mascota'} nunca espere por su agua, comida o paseo.
                            </p>
                        </div>
                        <button className="bg-white text-indigo-600 font-black py-4 rounded-2xl w-full mt-8 hover:bg-indigo-50 transition-all">
                            CONFIGURAR TIEMPOS
                        </button>
                    </div>
                </div>

                {/* Checklist Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Lista de Atención</h2>
                        <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                            <Clock size={14} /> HOY, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className={`group cursor-pointer bg-white border rounded-[2rem] p-6 flex items-center justify-between transition-all duration-300
                            ${task.completed ? 'border-indigo-100 bg-indigo-50/30' : 'border-gray-50 hover:border-indigo-200 shadow-sm hover:shadow-xl'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500
                                ${task.completed ? 'bg-indigo-600 text-white rotate-[360deg]' : 'bg-gray-50 text-gray-400'}`}>
                                        {task.type === 'food' && <Utensils size={24} />}
                                        {task.type === 'water' && <Droplets size={24} />}
                                        {task.type === 'walk' && <Footprints size={24} />}
                                        {task.type === 'play' && <Heart size={24} />}
                                    </div>
                                    <div>
                                        <h4 className={`text-xl font-black transition-all ${task.completed ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                                            {task.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                            <Clock size={12} /> {task.time}
                                        </div>
                                    </div>
                                </div>

                                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
                            ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-100 group-hover:border-indigo-300'}`}>
                                    {task.completed && <CheckCircle2 size={24} />}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-6 mt-8 border-4 border-dashed border-gray-100 rounded-[2.5rem] text-gray-300 flex items-center justify-center gap-3 hover:border-indigo-200 hover:text-indigo-300 transition-all font-black text-sm uppercase tracking-widest">
                        <Plus size={20} /> Añadir Actividad Personalizada
                    </button>
                </div>

                {/* Motivational Tip */}
                <div className="mt-20 p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 flex items-start gap-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-lg shadow-indigo-100">
                        <Heart size={32} />
                    </div>
                    <div>
                        <h5 className="text-xl font-black text-indigo-900 mb-2">¿Sabías que la rutina reduce el estrés?</h5>
                        <p className="text-indigo-600 font-medium leading-relaxed">
                            Las mascotas aman la predictibilidad. Si {petName || 'tu mascota'} sabe cuándo va a comer, jugar y salir, sus niveles de ansiedad bajarán y su comportamiento mejorará drásticamente. ¡Eres el mejor líder de manada!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
