'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Thermometer, ChefHat, Heart, Star, Search, Flame, Snowflake, Info, MessageCircle, Plus, CheckCircle2 } from 'lucide-react';

interface Recipe {
    id: string;
    name: string;
    description: string;
    difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
    time: string;
    type: 'BARF' | 'Postre' | 'Snack' | 'Especial';
    temp: '❄️ Frío' | '🔥 Tibio' | '🩸 Crudo';
    ingredients: string[];
    instructions: string[];
    benefits: string[];
}

const MASTER_RECIPES: Recipe[] = [
    {
        id: 'h1',
        name: 'Helado de Pollo y Zanahoria',
        description: 'Delicioso helado refrescante con pollo desmenuzado y zanahoria, perfecto para días calurosos.',
        difficulty: 'Fácil',
        time: '15 min',
        type: 'Postre',
        temp: '❄️ Frío',
        ingredients: ['200g Pollo cocido', '1 Zanahoria rallada', '1 taza Caldo natural', 'Yogur natural'],
        instructions: ['Mezclar ingredientes', 'Licuar si se desea suavidad', 'Congelar por 3 horas'],
        benefits: ['Hidratación extra', 'Proteína magra', 'Efecto refrescante']
    },
    {
        id: 'r1',
        name: 'BARF de Cordero Premium',
        description: 'Receta base de cordero con vegetales y suplementos naturales para una salud de hierro.',
        difficulty: 'Intermedio',
        time: '25 min',
        type: 'BARF',
        temp: '🩸 Crudo',
        ingredients: ['300g Cordero molido', '150g Vísceras', '1 taza Coliflor', 'Semillas de Linaza'],
        instructions: ['Picar vegetales finamente', 'Mezclar con la carne y vísceras', 'Añadir aceites y suplementos'],
        benefits: ['Pelo brillante', 'Dientes limpios', 'Heces pequeñas']
    },
    {
        id: 'h2',
        name: 'Sorbet de Arándanos Antioxidante',
        description: 'Potente antiinflamatorio natural en formato refrescante para mascotas senior o deportistas.',
        difficulty: 'Fácil',
        time: '10 min',
        type: 'Postre',
        temp: '❄️ Frío',
        ingredients: ['1/2 taza Arándanos', '1 Plátano maduro', '1 cucharada Aceite de coco', 'Agua de coco'],
        instructions: ['Aplastar el plátano', 'Mezclar con arándanos y aceites', 'Congelar en moldes pequeños'],
        benefits: ['Protección celular', 'Energía natural', 'Delicioso sabor']
    },
    {
        id: 'h3',
        name: 'Chupitos de Hígado Gourmet',
        description: 'Snacks congelados de alto valor biológico para entrenamiento o premios especiales.',
        difficulty: 'Fácil',
        time: '20 min',
        type: 'Snack',
        temp: '❄️ Frío',
        ingredients: ['100g Hígado de res', '1/2 taza Agua', 'Pizca de sal marina'],
        instructions: ['Hervir el hígado 5 min', 'Licuar con el agua de cocción', 'Congelar en cubeteras'],
        benefits: ['Alto en Hierro', 'Vitaminas grupo B', 'Gran palatabilidad']
    },
    {
        id: 'r2',
        name: 'Hígado Cocido con Arroz',
        description: 'Ideal para mascotas con estómagos sensibles o en etapa de transición a dieta natural.',
        difficulty: 'Fácil',
        time: '20 min',
        type: 'Especial',
        temp: '🔥 Tibio',
        ingredients: ['200g Hígado cocido', '1 taza Arroz integral', '1 Zanahoria cocida'],
        instructions: ['Hervir el hígado 10 min', 'Mezclar con arroz y vegetales', 'Servir a temperatura ambiente'],
        benefits: ['Fácil digestión', 'Aporte de fibra', 'Sabor suave']
    },
    {
        id: 'r3',
        name: 'BARF Gatos: Festín de Cordero',
        description: 'Equilibrio perfecto de taurina y proteína magra diseñado específicamente para felinos exigentes.',
        difficulty: 'Intermedio',
        time: '20 min',
        type: 'Especial',
        temp: '🩸 Crudo',
        ingredients: ['250g Cordero picado', '100g Corazón de res', '1/2 cucharadita Aceite de salmón'],
        instructions: ['Picar la carne en trozos muy pequeños', 'Añadir aceites esenciales', 'Servir inmediatamente'],
        benefits: ['Salud ocular', 'Corazón fuerte', 'Energía felina']
    }
];

export default function CocinaRaizel() {
    const [filter, setFilter] = useState('Todos');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Recipe | null>(null);

    const filtered = MASTER_RECIPES.filter(r =>
        (filter === 'Todos' || r.type === filter) &&
        (r.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in font-sans">
                <Link href="/" className="inline-flex items-center text-gray-900 hover:text-orange-500 font-bold mb-12 transition-all hover:-translate-x-1 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-orange-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm uppercase tracking-widest leading-none">Volver al Inicio</span>
                </Link>

                <div className="text-center mb-16">
                    <h1 className="text-7xl font-black text-gray-900 mb-6 tracking-tighter">
                        Cocina <span className="text-orange-500">Natural</span>.
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Recetas exclusivas para transformar la alimentación de tu mascota en una experiencia gourmet 100% real.
                    </p>
                </div>

                {/* Buscador y Filtros */}
                <div className="flex flex-col md:flex-row gap-6 mb-16">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar receta (ej: Helado, Cordero...)"
                            className="w-full pl-14 pr-8 py-5 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-[2rem] text-lg font-bold transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['Todos', 'BARF', 'Postre', 'Snack'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-8 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all ${filter === f ? 'bg-orange-600 text-white shadow-xl shadow-orange-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid de Recetas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(recipe => (
                        <div key={recipe.id} className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                {recipe.temp.includes('❄️') ? <Snowflake size={80} /> : <Flame size={80} />}
                            </div>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    {recipe.type}
                                </span>
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                    {recipe.difficulty}
                                </span>
                            </div>

                            <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition-colors leading-tight">
                                {recipe.name}
                            </h3>
                            <p className="text-gray-500 font-medium mb-8 line-clamp-2">
                                {recipe.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-4 text-xs font-black text-gray-400">
                                    <span className="flex items-center"><Clock size={14} className="mr-1" /> {recipe.time}</span>
                                    <span>{recipe.temp}</span>
                                </div>
                                <button
                                    onClick={() => setSelected(recipe)}
                                    className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Detalle Premium */}
                {selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white w-full max-w-4xl rounded-[4rem] p-10 md:p-16 relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-8 right-8 w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-black"
                            >
                                ✕
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <div className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">RECETA EXCLUSIVA</div>
                                    <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">{selected.name}</h2>
                                    <p className="text-xl text-gray-500 font-medium mb-10 leading-relaxed italic">&quot;{selected.description}&quot;</p>

                                    <div className="space-y-6">
                                        <h4 className="font-black uppercase tracking-widest text-gray-400 text-xs">Beneficios Clave</h4>
                                        <ul className="space-y-4">
                                            {selected.benefits.map((b, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-900 font-bold bg-green-50 p-4 rounded-2xl">
                                                    <CheckCircle2 className="text-green-500" size={18} />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="bg-gray-50 rounded-[3rem] p-10">
                                        <h4 className="font-black uppercase tracking-widest text-gray-400 text-xs mb-6">Ingredientes Reales</h4>
                                        <ul className="space-y-3">
                                            {selected.ingredients.map((ing, i) => (
                                                <li key={i} className="text-lg font-black text-gray-800 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                                    {ing}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-gray-900 rounded-[3rem] p-10 text-white">
                                        <h4 className="font-black uppercase tracking-widest text-orange-500 text-xs mb-6">Preparación Step-by-Step</h4>
                                        <ol className="space-y-6">
                                            {selected.instructions.map((step, i) => (
                                                <li key={i} className="flex gap-4">
                                                    <span className="text-orange-500 font-black text-xl leading-none">0{i + 1}.</span>
                                                    <p className="text-gray-300 font-medium">{step}</p>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de Contacto Final */}
                            <div className="mt-16 text-center">
                                <p className="text-gray-400 mb-6 font-bold uppercase tracking-widest text-xs">¿Necesitas los ingredientes premium?</p>
                                <a
                                    href={`https://wa.me/573108188723?text=Hola! Quiero preparar la receta: ${selected.name}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-green-100"
                                >
                                    <MessageCircle size={24} />
                                    PEDIR INGREDIENTES RAÍZEL
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
