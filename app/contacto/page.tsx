'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MessageCircle, MapPin, Send, Clock, Zap, MessageSquare, ShieldCheck, Headphones } from 'lucide-react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    tipoConsulta: 'nutricion',
    mensaje: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola! Soy ${formData.nombre}. Tengo una consulta sobre ${formData.tipoConsulta}: ${formData.mensaje}`;
    window.open(`https://wa.me/573108188723?text=${encodeURIComponent(text)}`, '_blank');
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 overflow-x-hidden font-sans">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <Link href="/" className="inline-flex items-center text-purple-400 hover:text-white font-bold mb-12 transition-all hover:-translate-x-1 group">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 group-hover:bg-purple-500 transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </div>
          <span className="text-xs uppercase tracking-[0.2em]">Cerrar Soporte</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column: Context */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-widest mb-8">
              <Headphones size={14} className="animate-pulse" /> Expert Support v2.0
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none italic">
              SOPORTE<br />
              <span className="text-purple-500 italic-none">EXPERTO.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-md font-medium leading-relaxed mb-12">
              Resuelve tus dudas sobre nutrición avanzada, pedidos o salud con nuestro equipo de especialistas.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-all">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest text-gray-200">WhatsApp Directo</h4>
                  <p className="text-gray-500 text-xs font-bold font-mono">Respuesta en <span className="text-purple-400">&lt; 15 min</span></p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-all">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest text-gray-200">Email Corporativo</h4>
                  <p className="text-gray-500 text-xs font-bold font-mono">Atención Administrativa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white/5 border border-white/10 rounded-[4rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Zap size={100} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-4 block">Nombre Completo</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#0a0a0a] border-none rounded-3xl p-6 font-black text-white focus:ring-2 focus:ring-purple-600 outline-none placeholder:text-gray-800"
                  placeholder="Ej: Juan Pérez"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-4 block">Tipo de Consulta</label>
                <div className="grid grid-cols-2 gap-4">
                  {['nutricion', 'pedido', 'salud', 'otro'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, tipoConsulta: type })}
                      className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border
                                                ${formData.tipoConsulta === type ? 'bg-purple-600 border-transparent text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-purple-500'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 mb-4 block">¿Cómo podemos ayudarte?</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-[#0a0a0a] border-none rounded-3xl p-6 font-medium text-white focus:ring-2 focus:ring-purple-600 outline-none placeholder:text-gray-800 resize-none"
                  placeholder="Describe tu consulta..."
                  value={formData.mensaje}
                  onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-purple-600 hover:text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <MessageCircle size={18} /> INICIAR CHAT DE SOPORTE
              </button>
            </form>
          </div>
        </div>

        {/* Trust Banner */}
        <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all border-t border-white/5 pt-12">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Atención Certificada</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Respuesta Prioritaria</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Soporte 24/7 VIP</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={20} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">Envíos Colombia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
