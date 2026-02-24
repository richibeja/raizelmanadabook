'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Utensils, Droplets, Footprints, Heart, Camera, Plus, CheckCircle2, Trophy, Bell, Trash2, X, Star } from 'lucide-react';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);

    // New task form state
    const [newTask, setNewTask] = useState({
        name: '',
        time: '',
        type: 'food' as RoutineTask['type']
    });

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
        } else if (savedTasks) {
            // It's a new day, reset completion status
            const resetTasks = JSON.parse(savedTasks).map((t: RoutineTask) => ({ ...t, completed: false }));
            setTasks(resetTasks);
            localStorage.setItem('raizel_daily_tasks', JSON.stringify(resetTasks));
            localStorage.setItem('raizel_last_routine_access', today);
        } else {
            // Initial default tasks
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

    const toggleTask = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleAddTask = () => {
        if (!newTask.name || !newTask.time) return;
        const task: RoutineTask = {
            id: Math.random().toString(36).substr(2, 9),
            name: newTask.name,
            time: newTask.time,
            type: newTask.type,
            completed: false
        };
        setTasks([...tasks, task].sort((a, b) => a.time.localeCompare(b.time)));
        setIsModalOpen(false);
        setNewTask({ name: '', time: '', type: 'food' });
    };

    const handleDeleteTask = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setTasks(tasks.filter(t => t.id !== id));
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

    const getIcon = (type: RoutineTask['type']) => {
        switch (type) {
            case 'food': return <Utensils size={24} />;
            case 'water': return <Droplets size={24} />;
            case 'walk': return <Footprints size={24} />;
            case 'play': return <Star size={24} />;
            case 'meds': return <CheckCircle2 size={24} />;
            case 'clean': return <Trash2 size={24} />;
            default: return <Heart size={24} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
                <Link href="/" className="inline-flex items-center text-gray-900 hover:text-indigo-600 font-bold mb-10 transition-all hover:-translate-x-1 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm uppercase tracking-widest leading-none">Volver al Inicio</span>
                </Link>

                {/* Header Section */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-40" />

                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="relative group">
                            <div className="w-44 h-44 rounded-[3rem] bg-indigo-50 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center transition-transform hover:scale-105">
                                {petImage ? (
                                    <img src={petImage} alt="Mascota" className="w-full h-full object-cover" />
                                ) : (
                                    <Heart size={64} className="text-indigo-200" />
                                )}
                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-black uppercase tracking-widest">
                                    <Camera size={20} className="mr-2" /> Cambiar
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <input
                                type="text"
                                placeholder="Nombre de tu mascota"
                                className="text-4xl md:text-6xl font-black text-gray-900 bg-transparent border-none p-0 focus:ring-0 placeholder:text-gray-200 w-full mb-2"
                                value={petName}
                                onChange={(e) => {
                                    setPetName(e.target.value);
                                    localStorage.setItem('raizel_pet_name', e.target.value);
                                }}
                            />
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                                <div className="bg-indigo-600 text-white px-6 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-200">
                                    <Trophy size={18} />
                                    <span className="font-black text-sm uppercase tracking-widest">{careScore}% Care Today</span>
                                </div>
                                <button onClick={() => setIsModalOpen(true)} className="bg-gray-900 text-white p-2 rounded-2xl hover:bg-black transition-all">
                                    <Plus size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl h-64 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16" />
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-tighter text-indigo-400 mb-4 font-mono">Status_Update</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black tracking-tighter">{tasks.filter(t => t.completed).length}</span>
                                <span className="text-2xl font-bold text-gray-600">/ {tasks.length}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${careScore}%` }} />
                            </div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">{careScore === 100 ? 'Level: Pack Leader' : 'Level: Daily Care'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 h-64">
                        <div className="flex justify-between items-start">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Bell size={28} />
                            </div>
                            <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">Automático</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Mental Health</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                {petName || 'Tu mascota'} necesita estimulación. Los paseos y juegos reducen la ansiedad un 40%.
                            </p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest group">
                            Agendar actividad <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* List Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-6">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Diario de Atención</h2>
                        <div className="text-xs font-black text-gray-400 bg-gray-100 px-4 py-2 rounded-full flex items-center gap-2">
                            <Clock size={12} /> HOY
                        </div>
                    </div>

                    <div className="space-y-4">
                        {tasks.length > 0 ? tasks.map(task => (
                            <div
                                key={task.id}
                                onClick={(e) => toggleTask(task.id, e)}
                                className={`group bg-white rounded-[2.5rem] p-6 border transition-all duration-400 flex items-center justify-between shadow-sm cursor-pointer
                                    ${task.completed ? 'border-indigo-100 bg-indigo-50/20' : 'border-gray-100 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1'}`}
                            >
                                <div className="flex items-center gap-8">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500
                                        ${task.completed ? 'bg-indigo-600 text-white scale-90' : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                                        {getIcon(task.type)}
                                    </div>
                                    <div>
                                        <h4 className={`text-xl font-black transition-all ${task.completed ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                                            {task.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                            <Clock size={12} /> {task.time}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={(e) => handleDeleteTask(task.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 hover:text-red-500 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                                        ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'border-gray-100 group-hover:border-indigo-500'}`}>
                                        {task.completed && <CheckCircle2 size={24} />}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-20 text-center border-4 border-dashed border-gray-100 rounded-[4rem]">
                                <Heart size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Crea tu primera rutina diaria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal - Not a Mockup anymore */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Nueva Actividad</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3 block">Nombre de la Tarea</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Jugar con pelota"
                                    className="w-full bg-gray-50 border-none rounded-3xl p-6 font-black text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    value={newTask.name}
                                    onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3 block">Hora</label>
                                    <input
                                        type="time"
                                        className="w-full bg-gray-50 border-none rounded-3xl p-6 font-black text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                        value={newTask.time}
                                        onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3 block">Tipo</label>
                                    <select
                                        className="w-full bg-gray-50 border-none rounded-3xl p-6 font-black text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none appearance-none"
                                        value={newTask.type}
                                        onChange={e => setNewTask({ ...newTask, type: e.target.value as RoutineTask['type'] })}
                                    >
                                        <option value="food">Comida</option>
                                        <option value="water">Agua</option>
                                        <option value="walk">Paseo</option>
                                        <option value="play">Juego</option>
                                        <option value="meds">Medicina</option>
                                        <option value="clean">Limpieza</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleAddTask}
                                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-black transition-all hover:scale-[1.02]"
                            >
                                GUARDAR EN LA AGENDA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
