'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Syringe, Calendar, CheckCircle2, Clock, AlertCircle, Plus, Trash2, Bell, Info, Share2, Download, Printer, ShieldCheck, QrCode, Heart as HeartIcon } from 'lucide-react';

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
    const [petBreed, setPetBreed] = useState('');
    const [petSpecies, setPetSpecies] = useState<'perro' | 'gato'>('perro');
    const [petBirthDate, setPetBirthDate] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [petID, setPetID] = useState('');
    const [petPhoto, setPetPhoto] = useState<string | null>(null);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [showIDCard, setShowIDCard] = useState(false);

    // Cargar datos de localStorage al iniciar
    useEffect(() => {
        const savedPet = localStorage.getItem('raizel_pet_name');
        const savedBreed = localStorage.getItem('raizel_pet_breed');
        const savedSpecies = localStorage.getItem('raizel_pet_species');
        const savedBirth = localStorage.getItem('raizel_pet_birth');
        const savedOwner = localStorage.getItem('raizel_owner_name');
        const savedID = localStorage.getItem('raizel_pet_id');
        const savedPhoto = localStorage.getItem('raizel_pet_photo');
        const savedVaccines = localStorage.getItem('raizel_vaccines');

        if (savedPet) setPetName(savedPet);
        if (savedBreed) setPetBreed(savedBreed);
        if (savedSpecies) setPetSpecies(savedSpecies as 'perro' | 'gato');
        if (savedBirth) setPetBirthDate(savedBirth);
        if (savedOwner) setOwnerName(savedOwner);
        if (savedID) setPetID(savedID);
        else {
            const newID = `RZ-26-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
            setPetID(newID);
        }
        if (savedPhoto) setPetPhoto(savedPhoto);
        if (savedVaccines) {
            setVaccines(JSON.parse(savedVaccines));
            setIsFirstTime(false);
        }
    }, []);

    // Guardar datos en localStorage
    useEffect(() => {
        if (petName) localStorage.setItem('raizel_pet_name', petName);
        if (petBreed) localStorage.setItem('raizel_pet_breed', petBreed);
        if (petSpecies) localStorage.setItem('raizel_pet_species', petSpecies);
        if (petBirthDate) localStorage.setItem('raizel_pet_birth', petBirthDate);
        if (ownerName) localStorage.setItem('raizel_owner_name', ownerName);
        if (petID) localStorage.setItem('raizel_pet_id', petID);
        if (petPhoto) localStorage.setItem('raizel_pet_photo', petPhoto);
        if (vaccines.length > 0) localStorage.setItem('raizel_vaccines', JSON.stringify(vaccines));
    }, [petName, petBreed, petSpecies, petBirthDate, ownerName, petID, petPhoto, vaccines]);

    // Cálculo automático de edad perruna/gatuna (humana)
    const calculatePetAge = (birthDate: string, species: 'perro' | 'gato') => {
        if (!birthDate) return { chronological: 'PDTE', human: '--' };
        const birth = new Date(birthDate);
        const now = new Date();
        let ageInYears = now.getFullYear() - birth.getFullYear();
        const monthDiff = now.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
            ageInYears--;
        }

        if (ageInYears < 0) return { chronological: 'Bebé', human: '0' };

        let humanAge = 0;
        if (ageInYears === 0) {
            const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + now.getMonth() - birth.getMonth();
            // Los gatos maduran un poco más lento al inicio (15 años al primer año)
            const multiplier = species === 'gato' ? 1.25 : 1.5;
            humanAge = Math.max(1, Math.round(totalMonths * multiplier));
            return { chronological: `${totalMonths} meses`, human: humanAge.toString() };
        } else if (ageInYears === 1) humanAge = 15;
        else if (ageInYears === 2) humanAge = 24;
        else {
            // Regla general: +4 por año para la mayoría de perros y gatos después de los 2 años
            humanAge = 24 + (ageInYears - 2) * 4;
        }

        return { chronological: `${ageInYears} años`, human: humanAge.toString() };
    };

    // Logo estilizado con la "i" como raíz
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

    const handleTakePhoto = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPetPhoto(reader.result as string);
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Carnet Digital de ${petName} - Raízel`,
                    text: `¡Mira el carnet oficial de mi mascota! Generado en la app de Raízel. Nutrición y bienestar natural.`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

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
        <div className="min-h-screen bg-[#fafafa] print:bg-white">
            <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in font-sans print:p-0">
                <Link href="/" className="inline-flex items-center text-gray-900 hover:text-green-600 font-bold mb-8 transition-all hover:-translate-x-1 group print:hidden">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-green-50 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm uppercase tracking-widest leading-none">Volver al Inicio</span>
                </Link>

                <div className="text-center mb-16 print:hidden">
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

                {/* Input de Nombre de Mascota y Foto */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-center gap-8 group/card transition-all hover:shadow-xl">
                    <button
                        onClick={handleTakePhoto}
                        className="relative w-32 h-32 flex-shrink-0 group/photo"
                    >
                        {petPhoto ? (
                            <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-white shadow-lg relative">
                                <img src={petPhoto} alt="Mascota" className="w-full h-full object-cover transition-transform group-hover/photo:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                                    <Plus className="text-white" size={32} />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-green-300 hover:text-green-500 transition-all hover:bg-green-50">
                                <Plus size={32} className="mb-1" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Foto</span>
                            </div>
                        )}
                        <div className="absolute -bottom-2 -right-2 bg-green-600 text-white p-2 rounded-xl shadow-lg transform group-hover/photo:scale-110 transition-transform">
                            <Plus size={16} />
                        </div>
                    </button>

                    <div className="flex-1 w-full text-center md:text-left space-y-4">
                        <div className="flex flex-col md:flex-row md:items-end gap-4">
                            <div className="flex-1">
                                <h3 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-2">
                                    <Plus size={12} className="text-green-500" /> Identificación
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Nombre de tu Mascota..."
                                    className="text-3xl md:text-4xl font-black text-gray-900 bg-transparent border-b-2 border-transparent focus:border-green-500 focus:ring-0 w-full placeholder:text-gray-300 transition-all outline-none tracking-tighter py-1"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => setPetSpecies('perro')}
                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${petSpecies === 'perro' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                    >
                                        Perro
                                    </button>
                                    <button
                                        onClick={() => setPetSpecies('gato')}
                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${petSpecies === 'gato' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                    >
                                        Gato
                                    </button>
                                </div>
                            </div>
                            {petPhoto && petName && (
                                <button
                                    onClick={() => setShowIDCard(true)}
                                    className="flex-shrink-0 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-600 transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 mb-2"
                                >
                                    <QrCode size={14} /> Generar Carnet
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-50 pt-4">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Raza</h4>
                                <input
                                    type="text"
                                    placeholder="Ej: Golden Ret..."
                                    className="text-sm font-bold text-gray-800 bg-transparent border-none focus:ring-0 w-full p-0 placeholder:text-gray-400 outline-none"
                                    value={petBreed}
                                    onChange={(e) => setPetBreed(e.target.value)}
                                />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Fecha de Nacimiento</h4>
                                <input
                                    type="date"
                                    className="text-sm font-bold text-gray-800 bg-transparent border-none focus:ring-0 w-full p-0 placeholder:text-gray-200 outline-none"
                                    value={petBirthDate}
                                    onChange={(e) => setPetBirthDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Tutor / Humano</h4>
                                <input
                                    type="text"
                                    placeholder="Tu nombre..."
                                    className="text-sm font-bold text-gray-800 bg-transparent border-none focus:ring-0 w-full p-0 placeholder:text-gray-400 outline-none"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL CARNET OFICIAL */}
                {showIDCard && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in print:relative print:p-0 print:bg-white print:backdrop-blur-none">
                        <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden print:shadow-none print:p-4">
                            {/* Close button - hidden on print */}
                            <button
                                onClick={() => setShowIDCard(false)}
                                className="absolute top-6 right-6 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-black print:hidden"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-10 print:hidden">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Carnet Personal</h2>
                                <p className="text-gray-400 text-sm font-medium">Este documento certifica a {petName} como parte oficial de nuestra manada.</p>
                            </div>

                            {/* THE ID CARD DESIGN */}
                            <div className="relative aspect-[1.6/1] w-full max-w-xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 p-8 text-white group print:border-gray-900 print:text-black print:bg-white print:from-white print:to-white">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-16 -mt-16 print:hidden" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 print:hidden" />

                                <div className="relative h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start border-b border-white/10 pb-4 print:border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <ShieldCheck size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <RaizelLogo className="text-[14px]" />
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Certificado de Bienestar</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-lg overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://raizel.vercel.app`}
                                                    alt="QR"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <span className="text-[6px] font-black text-gray-500 uppercase tracking-tighter tabular-nums">{petID}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 md:gap-10 items-center flex-1 py-4">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white/10 shadow-xl flex-shrink-0 print:border-gray-200">
                                            {petPhoto ? <img src={petPhoto} alt={petName} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-700 flex items-center justify-center"><HeartIcon size={40} /></div>}
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <div>
                                                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Mascota</span>
                                                <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none truncate">{petName}</h3>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                                <div>
                                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Raza</span>
                                                    <p className="text-[10px] md:text-sm font-bold text-white print:text-black uppercase truncate">{petBreed || 'N/A'}</p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">
                                                        {petSpecies === 'perro' ? 'Edad Perruna' : 'Edad Felina'}
                                                    </span>
                                                    <p className="text-[10px] md:text-sm font-bold text-white print:text-black uppercase truncate">
                                                        {calculatePetAge(petBirthDate, petSpecies).chronological}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] font-black text-green-500 uppercase tracking-widest">Equiv. Humana</span>
                                                    <p className="text-[10px] md:text-sm font-black text-white print:text-black uppercase truncate italic">
                                                        {calculatePetAge(petBirthDate, petSpecies).human} años
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Tutor Responsable</span>
                                                    <p className="text-[10px] md:text-sm font-black text-green-500 print:text-black uppercase truncate underline decoration-gray-700">{ownerName || 'Familia Raízel'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center bg-white/5 rounded-xl p-3 border border-white/5 print:bg-gray-50 print:border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-green-950 rounded-md flex items-center justify-center print:bg-gray-200">
                                                <HeartIcon size={12} className="text-green-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Estatus: Protegido por Raízel</span>
                                                <span className="text-[5px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 opacity-60">Gratuito por Raízel Book • Prohibida su venta</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 h-3">
                                            <div className="w-1 h-full bg-green-500 rounded-full" />
                                            <div className="w-1 h-full bg-indigo-500 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons - hidden on print */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 print:hidden">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                                >
                                    <Share2 size={18} /> Compartir en Redes
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl"
                                >
                                    <Printer size={18} /> Descargar / Imprimir
                                </button>
                            </div>

                            <p className="mt-8 text-center text-xs text-gray-400 font-medium italic print:hidden">
                                &quot;La identificación es el primer paso para una tenencia responsable.&quot; 🐾
                            </p>
                        </div>
                    </div>
                )}

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
