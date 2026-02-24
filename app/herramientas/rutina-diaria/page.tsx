'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Utensils, Droplets, Footprints, Heart, Camera, Plus, CheckCircle2, Trophy, Bell, Trash2, X, Star, ChevronRight, UserPlus } from 'lucide-react';

interface RoutineTask {
    id: string;
    name: string;
    time: string;
    completed: boolean;
    type: 'food' | 'water' | 'walk' | 'play' | 'meds' | 'clean';
}

interface PetProfile {
    id: string;
    name: string;
    image: string | null;
    tasks: RoutineTask[];
}

export default function RutinaDiaria() {
    const [pets, setPets] = useState<PetProfile[]>([]);
    const [activePetId, setActivePetId] = useState<string | null>(null);
    const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    // Form states
    const [newPetName, setNewPetName] = useState('');
    const [newTask, setNewTask] = useState({ name: '', time: '', type: 'food' as RoutineTask['type'] });

    useEffect(() => {
        const savedPets = localStorage.getItem('raizel_pets_data');
        const lastAccess = localStorage.getItem('raizel_last_routine_access');
        const today = new Date().toISOString().split('T')[0];

        if (savedPets) {
            let parsedPets: PetProfile[] = JSON.parse(savedPets);

            // Si es un día nuevo, resetear las tareas de todas las mascotas
            if (lastAccess !== today) {
                parsedPets = parsedPets.map(pet => ({
                    ...pet,
                    tasks: pet.tasks.map(t => ({ ...t, completed: false }))
                }));
                localStorage.setItem('raizel_pets_data', JSON.stringify(parsedPets));
                localStorage.setItem('raizel_last_routine_access', today);
            }

            setPets(parsedPets);
            if (parsedPets.length > 0) setActivePetId(parsedPets[0].id);
        } else {
            // Intentar migrar datos antiguos de mascota única
            const oldName = localStorage.getItem('raizel_pet_name');
            const oldImage = localStorage.getItem('raizel_pet_image');
            const oldTasks = localStorage.getItem('raizel_daily_tasks');

            if (oldName || oldTasks) {
                const initialPet: PetProfile = {
                    id: 'default',
                    name: oldName || 'Mi Mascota',
                    image: oldImage || null,
                    tasks: oldTasks ? JSON.parse(oldTasks) : []
                };
                setPets([initialPet]);
                setActivePetId(initialPet.id);
                localStorage.setItem('raizel_pets_data', JSON.stringify([initialPet]));
            }
        }
    }, []);

    // Save pets on any change
    useEffect(() => {
        if (pets.length > 0) {
            localStorage.setItem('raizel_pets_data', JSON.stringify(pets));
        }
    }, [pets]);

    const activePet = pets.find(p => p.id === activePetId) || null;
    const careScore = activePet ? (activePet.tasks.length > 0 ? Math.round((activePet.tasks.filter(t => t.completed).length / activePet.tasks.length) * 100) : 0) : 0;

    const handleAddPet = () => {
        if (!newPetName) return;
        const newPet: PetProfile = {
            id: Math.random().toString(36).substr(2, 9),
            name: newPetName,
            image: null,
            tasks: [
                { id: '1', name: 'Alimentación Mañana', time: '08:00', completed: false, type: 'food' },
                { id: '2', name: 'Refrescar Agua', time: '09:00', completed: false, type: 'water' },
                { id: '3', name: 'Paseo Largo', time: '10:00', completed: false, type: 'walk' },
            ]
        };
        setPets([...pets, newPet]);
        setActivePetId(newPet.id);
        setNewPetName('');
        setIsAddPetModalOpen(false);
    };

    const handleDeletePet = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const filtered = pets.filter(p => p.id !== id);
        setPets(filtered);
        if (activePetId === id) setActivePetId(filtered.length > 0 ? filtered[0].id : null);
    };

    const handleAddTask = () => {
        if (!newTask.name || !newTask.time || !activePetId) return;
        const task: RoutineTask = {
            id: Math.random().toString(36).substr(2, 9),
            name: newTask.name,
            time: newTask.time,
            type: newTask.type,
            completed: false
        };
        setPets(pets.map(p => p.id === activePetId ? { ...p, tasks: [...p.tasks, task].sort((a, b) => a.time.localeCompare(b.time)) } : p));
        setIsAddTaskModalOpen(false);
        setNewTask({ name: '', time: '', type: 'food' });
    };

    const toggleTask = (taskId: string) => {
        setPets(pets.map(p => p.id === activePetId ? {
            ...p,
            tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        } : p));
    };

    const deleteTask = (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPets(pets.map(p => p.id === activePetId ? {
            ...p,
            tasks: p.tasks.filter(t => t.id !== taskId)
        } : p));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activePetId) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPets(pets.map(p => p.id === activePetId ? { ...p, image: base64String } : p));
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
        <div className="min-h-screen bg-[#fafafa] pb-32 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
                <Link href="/" className="inline-flex items-center text-gray-900 hover:text-indigo-600 font-bold mb-10 transition-all hover:-translate-x-1 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm uppercase tracking-widest leading-none">Volver al Inicio</span>
                </Link>

                {/* Pet Selector Tabs */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
                    {pets.map(pet => (
                        <button
                            key={pet.id}
                            onClick={() => setActivePetId(pet.id)}
                            className={`flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-[2rem] transition-all border
                                ${activePetId === pet.id ? 'bg-indigo-600 border-transparent text-white shadow-xl shadow-indigo-200' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200'}`}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-white/20">
                                {pet.image ? <img src={pet.image} className="w-full h-full object-cover" /> : <Heart size={14} className="m-auto" />}
                            </div>
                            <span className="font-black text-xs uppercase tracking-widest">{pet.name}</span>
                            {pets.length > 1 && (
                                <X size={14} className="hover:text-red-300" onClick={(e) => handleDeletePet(pet.id, e)} />
                            )}
                        </button>
                    ))}
                    <button
                        onClick={() => setIsAddPetModalOpen(true)}
                        className="flex-shrink-0 w-14 h-14 bg-white border border-dashed border-gray-200 rounded-full flex items-center justify-center text-gray-300 hover:border-indigo-500 hover:text-indigo-500 transition-all"
                    >
                        <UserPlus size={24} />
                    </button>
                </div>

                {!activePet ? (
                    <div className="bg-white rounded-[4rem] p-20 text-center border-2 border-dashed border-gray-100">
                        <UserPlus size={48} className="mx-auto text-gray-200 mb-6" />
                        <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">¿No hay mascotas?</h2>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Regístralas para empezar a gestionar su rutina diaria de forma profesional.</p>
                        <button onClick={() => setIsAddPetModalOpen(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-xl">Añadir Primera Mascota</button>
                    </div>
                ) : (
                    <>
                        {/* Profile Header */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 mb-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-40" />

                            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                                <div className="relative group">
                                    <div className="w-44 h-44 rounded-[3rem] bg-indigo-50 border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center transition-transform hover:scale-105">
                                        {activePet.image ? (
                                            <img src={activePet.image} alt={activePet.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Heart size={64} className="text-indigo-200" />
                                        )}
                                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-black uppercase tracking-widest text-center px-4">
                                            <Camera size={20} className="mb-2 mx-auto" /><br />Actualizar Foto
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-4 italic uppercase">{activePet.name}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-4">
                                        <div className="bg-indigo-600 text-white px-6 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-200">
                                            <Trophy size={18} />
                                            <span className="font-black text-[10px] uppercase tracking-widest">{careScore}% Cuidado Hoy</span>
                                        </div>
                                        <div className="bg-gray-100 text-gray-500 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                            {activePet.tasks.length} Tareas Activas
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl h-64 border border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16" />
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4 font-mono">Status_Update</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-black tracking-tighter">{activePet.tasks.filter(t => t.completed).length}</span>
                                        <span className="text-2xl font-bold text-gray-600">/ {activePet.tasks.length}</span>
                                    </div>
                                </div>
                                <div className="space-y-4 text-left">
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" style={{ width: `${careScore}%` }} />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{careScore === 100 ? 'Level: Pack Leader' : 'Sigue así, el bienestar es diario.'}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 h-64">
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <Bell size={28} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">Recordatorio</span>
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">Multi-Mascota</h3>
                                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                        Gestiona a toda tu manada desde el selector superior. Cada una tiene su propio progreso.
                                    </p>
                                </div>
                                <button onClick={() => setIsAddTaskModalOpen(true)} className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest group">
                                    Nueva actividad para {activePet.name} <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-6">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Agenda Diaria</h2>
                                <button
                                    onClick={() => setIsAddTaskModalOpen(true)}
                                    className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-indigo-100"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {activePet.tasks.map(task => (
                                    <div
                                        key={task.id}
                                        onClick={() => toggleTask(task.id)}
                                        className={`group bg-white rounded-[2.5rem] p-6 border transition-all duration-400 flex items-center justify-between shadow-sm cursor-pointer
                                            ${task.completed ? 'border-indigo-100 bg-indigo-50/20 shadow-none' : 'border-gray-100 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1'}`}
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500
                                                ${task.completed ? 'bg-indigo-600 text-white scale-90' : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                                                {getIcon(task.type)}
                                            </div>
                                            <div className="text-left">
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
                                                onClick={(e) => deleteTask(task.id, e)}
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
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal: Add Pet */}
            {isAddPetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">NUEVO INTEGRANTE</h3>
                            <button onClick={() => setIsAddPetModalOpen(false)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3 block text-left">Nombre de la Mascota</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Max, Luna, Toby..."
                                    className="w-full bg-gray-50 border-none rounded-3xl p-6 font-black text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    value={newPetName}
                                    onChange={e => setNewPetName(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleAddPet}
                                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                            >
                                AGREGAR A LA MANADA
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Add Task */}
            {isAddTaskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">NUEVA ACTIVIDAD</h3>
                            <button onClick={() => setIsAddTaskModalOpen(false)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3 block text-left">Nombre de la Tarea</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Dar medicina, Cepillar..."
                                    className="w-full bg-gray-50 border-none rounded-3xl p-6 font-black text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    value={newTask.name}
                                    onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3 block text-left">Hora</label>
                                    <input
                                        type="time"
                                        className="w-full bg-gray-50 border-none rounded-3xl p-6 font-black text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                        value={newTask.time}
                                        onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-3 block text-left">Tipo</label>
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
                                className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all"
                            >
                                GUARDAR TAREA
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
