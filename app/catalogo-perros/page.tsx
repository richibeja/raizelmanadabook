'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Star, MessageCircle, Plus, Info, ChevronRight, Filter } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { PRODUCTS, Product } from '../../lib/products';

export default function TiendaPage() {
  const { cart, addToCart, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const categories = ['Todos', 'BARF', 'Albóndigas', 'Chorizos', 'Helados', 'Vísceras', 'Accesorios'];

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleAddToCart = (product: Product, presentationIndex: number) => {
    const presentation = product.presentaciones[presentationIndex];
    addToCart({
      id: `${product.id}-${presentation.peso}`,
      productId: product.id,
      name: product.name,
      presentation: presentation.peso,
      price: presentation.precio,
      quantity: 1
    });
    // Feedback visual o alerta
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const [selectedPres, setSelectedPres] = useState(0);

    return (
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
        {/* Visual Area */}
        <div className="relative h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Placeholder for real images */}
          <div className="text-8xl transform group-hover:scale-110 transition-transform duration-700">
            {product.category === 'BARF' ? '🥩' :
              product.category === 'Helados' ? '🍦' :
                product.category === 'accesorios' ? '🎾' : '🍖'}
          </div>

          <button className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
            <Heart size={20} />
          </button>

          <div className="absolute bottom-6 left-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white bg-green-600 px-3 py-1.5 rounded-full shadow-lg">
              100% Natural
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-lg">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-xs font-black text-gray-900">5.0</span>
            </div>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">
            {product.description}
          </p>

          {/* Presentations Selector */}
          <div className="mb-6 space-y-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Presentación</span>
            <div className="flex flex-wrap gap-2">
              {product.presentaciones.map((pres, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPres(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedPres === idx
                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                    }`}
                >
                  {pres.peso}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Precio</span>
              <span className="text-2xl font-black text-gray-900">
                ${product.presentaciones[selectedPres].precio.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => handleAddToCart(product, selectedPres)}
              className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center hover:bg-gray-900 transition-all shadow-xl shadow-green-100 hover:shadow-gray-200"
            >
              <Plus size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tighter">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs">R</div>
            RAÍZEL <span className="text-green-600">STORE</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/tienda/cart" className="relative p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <ShoppingCart size={22} className="text-gray-900" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Intro */}
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-green-600 font-bold mb-8 transition-all hover:-translate-x-1 group">
            <ArrowLeft size={18} className="mr-2" />
            <span className="text-xs uppercase tracking-widest">Panel Principal</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
                Nutrición de <span className="text-green-600">Verdad</span>.
              </h1>
              <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
                Alimentación funcional 100% natural, sin procesados químicos. Diseñada para despertar el instinto de tu mascota.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Scrollable */}
        <div className="mb-12 flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="p-3 bg-white border border-gray-100 rounded-2xl flex-shrink-0">
            <Filter size={20} className="text-gray-400" />
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex-shrink-0 ${selectedCategory === cat
                ? 'bg-green-600 text-white shadow-xl shadow-green-100'
                : 'bg-white text-gray-400 border border-gray-50 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-10 -mr-20 -mt-20" />
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6 tracking-tight">¿Dudas con la dieta? 🐾</h2>
              <p className="text-gray-400 text-lg mb-8 font-medium">
                Agenda una consulta rápida por WhatsApp para encontrar el plan BARF ideal según el peso y salud de tu mascota.
              </p>
              <button className="bg-green-600 text-white font-black px-8 py-5 rounded-2xl hover:bg-green-50 transition-all flex items-center gap-3">
                <MessageCircle size={20} />
                HABLAR CON NUTRICIONISTA
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                <div className="text-3xl mb-4">🏠</div>
                <h4 className="font-black mb-1">Bogotá & Sabana</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Envíos directos</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/10">
                <div className="text-3xl mb-4">💨</div>
                <h4 className="font-black mb-1">Express</h4>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Entrega 24-48h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button (Mobile) */}
      {totalItems > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce-slow">
          <Link href="/tienda/cart" className="bg-gray-900 text-white px-8 py-5 rounded-full shadow-2xl flex items-center gap-4 border-2 border-green-600">
            <ShoppingCart size={20} />
            <span className="font-black">VER MI PEDIDO (${totalItems})</span>
            <ChevronRight size={20} />
          </Link>
        </div>
      )}
    </div>
  );
}
