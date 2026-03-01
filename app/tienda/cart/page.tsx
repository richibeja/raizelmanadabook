'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, MessageCircle, MapPin, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalAmount, totalItems, clearCart } = useCart();
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        ciudad: 'Bogotá',
        barrio: '',
        notas: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleWhatsAppCheckout = () => {
        if (!formData.nombre || !formData.telefono || !formData.direccion) {
            alert('Por favor completa los campos obligatorios (*)');
            return;
        }

        setIsSubmitting(true);

        let message = `🐾 *NUEVO PEDIDO RAÍZEL* 🐾\n\n`;
        message += `👤 *Cliente:* ${formData.nombre}\n`;
        message += `📞 *Teléfono:* ${formData.telefono}\n`;
        message += `📍 *Dirección:* ${formData.direccion}\n`;
        message += `🏙️ *Ciudad/Barrio:* ${formData.ciudad}${formData.barrio ? ` - ${formData.barrio}` : ''}\n\n`;

        message += `🛒 *PRODUCTOS:*\n`;
        cart.forEach(item => {
            message += `• ${item.name} (${item.presentation}) x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}\n`;
        });

        message += `\n💰 *TOTAL A PAGAR: $${totalAmount.toLocaleString()} COP*\n`;

        if (formData.notas) {
            message += `\n📝 *Notas:* ${formData.notas}\n`;
        }

        message += `\n--- \n🚚 _Envío a coordinar según zona._\n¡Gracias por elegir nutrición real! 🐕✨`;

        const whatsappUrl = `https://wa.me/573108188723?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        // Opcional: limpiar carrito después de un tiempo
        // setTimeout(() => { clearCart(); window.location.href = '/'; }, 5000);
        setIsSubmitting(false);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag size={64} className="text-gray-200" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Tu carrito está vacío</h1>
                <p className="text-gray-500 max-w-xs mb-10 font-medium leading-relaxed">
                    Parece que aún no has añadido nada para tu mascota.
                </p>
                <Link href="/catalogo-perros" className="bg-green-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-gray-900 transition-all shadow-xl shadow-green-100">
                    IR A LA TIENDA
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Nav Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/catalogo-perros" className="flex items-center gap-3 font-bold text-gray-400 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={20} />
                        VOLVER
                    </Link>
                    <h1 className="font-black text-xl tracking-tighter uppercase">TU PEDIDO</h1>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-12 gap-12">

                    {/* Left: Cart Items */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Resumen de Compra ({totalItems})</h2>
                            <button onClick={clearCart} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">Vaciar</button>
                        </div>

                        {cart.map(item => (
                            <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                                <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl">
                                    {item.name.includes('Pollo') ? '🍗' : item.name.includes('Helado') ? '🍦' : '🍖'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-black text-gray-900 text-lg">{item.name}</h3>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">{item.presentation}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="font-black text-gray-900">${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Right: Checkout Form */}
                    <div className="lg:col-span-5">
                        <div className="bg-gray-900 rounded-[3rem] p-10 text-white sticky top-28 shadow-2xl">
                            <h2 className="text-3xl font-black mb-8 tracking-tighter">Información de Envío</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Nombre completo *</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-green-500 outline-none transition-all font-bold"
                                        placeholder="Ej: Camilo Rodríguez"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Teléfono *</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-green-500 outline-none transition-all font-bold"
                                            placeholder="300..."
                                            value={formData.telefono}
                                            onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Ciudad</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-green-500 outline-none transition-all font-bold appearance-none"
                                            value={formData.ciudad}
                                            onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
                                        >
                                            <option value="Bogotá" className="bg-gray-900">Bogotá</option>
                                            <option value="Subía" className="bg-gray-900">Subía</option>
                                            <option value="Chía/Cota" className="bg-gray-900">Chía/Cota</option>
                                            <option value="Otra" className="bg-gray-900">Otra</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Dirección de entrega *</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-green-500 outline-none transition-all font-bold"
                                        placeholder="Calle 123 #45-67..."
                                        value={formData.direccion}
                                        onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Notas o Referencias</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:bg-white/10 focus:border-green-500 outline-none transition-all font-bold h-24 resize-none"
                                        placeholder="Torre 2 Apt 501, dejar en portería..."
                                        value={formData.notas}
                                        onChange={e => setFormData({ ...formData, notas: e.target.value })}
                                    />
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <div className="flex justify-between items-end mb-8">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total del Pedido</span>
                                        <span className="text-4xl font-black text-green-500">${totalAmount.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={handleWhatsAppCheckout}
                                        disabled={isSubmitting}
                                        className="w-full bg-green-600 text-white font-black py-6 rounded-2xl hover:bg-green-500 transition-all flex items-center justify-center gap-4 text-xl shadow-2xl shadow-green-900/20 active:scale-95 disabled:opacity-50"
                                    >
                                        <MessageCircle size={24} />
                                        <span>PEDIR POR WHATSAPP</span>
                                    </button>

                                    <div className="mt-6 flex items-center justify-center gap-6 opacity-30">
                                        <ShieldCheck size={20} />
                                        <Truck size={20} />
                                        <MapPin size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
