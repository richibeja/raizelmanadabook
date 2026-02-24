'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Camera, Facebook, MessageCircle, Share2, Heart, Instagram, Zap, Globe, MessageSquare } from 'lucide-react';

export default function ComunidadPage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const FACEBOOK_PAGE = 'https://www.facebook.com/profile.php?id=61577967586361';
  const FACEBOOK_GROUP = 'https://www.facebook.com/share/g/1CSVg7WncY/';
  const INSTAGRAM_URL = 'https://www.instagram.com/somosraizel?igsh=MnduazUycGhneng%3D';
  const TIKTOK_URL = 'https://www.tiktok.com/@raizeloficial?_t=ZS-90SvcHz0z5j&_r=1';

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500 overflow-x-hidden font-sans">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-white font-bold mb-12 transition-all hover:-translate-x-1 group">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:bg-indigo-500 transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.2em]">Cerrar Comunidad</span>
        </Link>

        {/* Hero section */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
            <Zap size={14} className="animate-pulse" /> Raízel Network v1.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none italic">
            MANADA<br />
            <span className="text-indigo-500 italic-none">V.I.P.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
            No somos solo una marca, somos una familia. Únete a miles de dueños responsables y comparte la evolución de tu mascota.
          </p>
        </div>

        {/* Social Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <a href={FACEBOOK_GROUP} target="_blank" className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-indigo-600 hover:border-transparent transition-all group overflow-hidden relative">
            <Facebook size={32} className="mb-6 text-indigo-400 group-hover:text-white transition-colors" />
            <h3 className="text-xl font-black mb-2">Grupo Privado</h3>
            <p className="text-xs text-gray-500 group-hover:text-indigo-100 transition-colors">Debates y consejos exclusivos en Facebook.</p>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/5 rounded-full group-hover:scale-[3] transition-transform duration-500" />
          </a>

          <a href={INSTAGRAM_URL} target="_blank" className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-pink-600 hover:border-transparent transition-all group overflow-hidden relative">
            <Instagram size={32} className="mb-6 text-pink-400 group-hover:text-white transition-colors" />
            <h3 className="text-xl font-black mb-2">Instagram</h3>
            <p className="text-xs text-gray-500 group-hover:text-pink-100 transition-colors">Las mejores fotos de la familia Raízel.</p>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/5 rounded-full group-hover:scale-[3] transition-transform duration-500" />
          </a>

          <a href={TIKTOK_URL} target="_blank" className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-black hover:border-white/20 transition-all group overflow-hidden relative border-b-4 border-b-cyan-500">
            <Globe size={32} className="mb-6 text-white" />
            <h3 className="text-xl font-black mb-2">TikTok</h3>
            <p className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">Educación rápida y videos divertidos.</p>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/5 rounded-full group-hover:scale-[3] transition-transform duration-500" />
          </a>

          <a href={`https://wa.me/573108188723?text=Hola! Quiero unirme a la comunidad VIP de Raízel`} target="_blank" className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-green-600 hover:border-transparent transition-all group overflow-hidden relative">
            <MessageSquare size={32} className="mb-6 text-green-400 group-hover:text-white transition-colors" />
            <h3 className="text-xl font-black mb-2">WhatsApp</h3>
            <p className="text-xs text-gray-500 group-hover:text-green-100 transition-colors">Soporte directo y alertas VIP.</p>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/5 rounded-full group-hover:scale-[3] transition-transform duration-500" />
          </a>
        </div>

        {/* Photo Wall Section */}
        <div className="bg-white/5 border border-white/10 rounded-[4rem] p-10 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-[2]">
            <Camera size={150} />
          </div>

          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter italic">COMPARTE LA<br /><span className="text-indigo-500">EVOLUCIÓN.</span></h2>
            <p className="text-gray-400 text-lg mb-12 font-medium">Tómale una foto a tu mascota disfrutando su vida Raízel y la compartiremos con toda la manada.</p>

            {!photoPreview ? (
              <button
                onClick={handleTakePhoto}
                className="inline-flex items-center gap-4 bg-indigo-600 text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-indigo-500/20"
              >
                <Camera size={28} /> TOMAR FOTO AHORA
              </button>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="relative group max-w-sm">
                  <img src={photoPreview} className="rounded-[2.5rem] w-full aspect-square object-cover border-4 border-white/10" alt="Pet preview" />
                  <button onClick={() => setPhotoPreview(null)} className="absolute top-4 right-4 bg-black/60 p-3 rounded-full hover:bg-red-500 transition-colors">
                    <ArrowLeft className="rotate-45" size={20} />
                  </button>
                </div>
                <div className="flex gap-4">
                  <a
                    href={FACEBOOK_GROUP}
                    target="_blank"
                    className="bg-white text-black px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                  >
                    Subir al Grupo
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Engagement Text */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12 border-t border-white/5 pt-12">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-16 h-16 rounded-full border-4 border-[#050505] bg-gray-800" />)}
            <div className="w-16 h-16 rounded-full border-4 border-[#050505] bg-indigo-600 flex items-center justify-center font-black text-xs">+2k</div>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] text-center md:text-right">
            Más de <span className="text-white">2,400 dueños</span> orgullosos ya forman parte de la red Raízel.
          </p>
        </div>
      </div>
    </div>
  );
}
