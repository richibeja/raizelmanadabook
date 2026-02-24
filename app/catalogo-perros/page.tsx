'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Star, MessageCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  ingredients: string[];
  benefits: string[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Vital BARF - Pollo',
    description: 'Alimento crudo biológicamente apropiado con vísceras y carne de pollo, coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
    image: '/images/producto-pollo.jpg',
    category: 'BARF',
    ingredients: ['Vísceras de pollo', 'Carne de pollo', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Alimento crudo natural', 'Mejora digestión', 'Pelo brillante', 'Energía natural', 'Huesos fuertes']
  },
  {
    id: '2',
    name: 'Vital BARF - Res',
    description: 'Vísceras de res, coliflor, zanahoria, linaza, aceites naturales, sal marina, calcio y plantas digestivas.',
    image: '/images/producto-res.jpg',
    category: 'BARF',
    ingredients: ['Vísceras de res', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio', 'Plantas digestivas'],
    benefits: ['Proteína de alta calidad', 'Digestión mejorada', 'Sistema inmune fuerte', 'Peso saludable', 'Minerales esenciales']
  },
  {
    id: '3',
    name: 'Vital BARF - Cordero',
    description: 'Alimento crudo con carne y vísceras de cordero, coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
    image: '/images/producto-cordero.jpg',
    category: 'BARF',
    ingredients: ['Carne de cordero', 'Vísceras de cordero', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Proteína de cordero', 'Fácil digestión', 'Rico en hierro', 'Ideal para perros sensibles', 'Sabor suave']
  },
  {
    id: 'oat-meatballs',
    name: 'Albóndigas Raízel - Receta Oat-Crusted',
    description: 'Nuestra especialidad premium: albóndigas de carne seleccionada con una capa crujiente de avena orgánica. Perfectas para una digestión lenta y energía constante.',
    image: '/images/ALBONDIGAS_AVENA_2.png',
    category: 'Albóndigas',
    ingredients: ['Carne de res seleccionada', 'Avena orgánica en hojuelas', 'Zanahoria', 'Corazón de res', 'Aceite de coco'],
    benefits: ['Textura gourmet única', 'Rico en fibra natural', 'Energía de larga duración', 'Pelo más fuerte', 'Altamente palatable']
  },
  {
    id: '4',
    name: 'Vital Pellets Naturales',
    description: 'Pellets deshidratados de vísceras con plantas medicinales y granos funcionales. Prácticos y de larga duración.',
    image: '/images/pellets.jpg',
    category: 'Pellets',
    ingredients: ['Vísceras deshidratadas', 'Plantas medicinales', 'Granos funcionales', 'Vitaminas naturales'],
    benefits: ['Fácil almacenamiento', 'Nutrición completa', 'Larga duración', 'Conveniente']
  },
  {
    id: '5',
    name: 'Bandeja Hígado de Res - Solo',
    description: 'Vísceras crudas de hígado de res en tajadas. Se puede dar crudo o preparar en recetas. Rico en hierro y vitaminas.',
    image: '/images/bandeja-higado-solo.jpg',
    category: 'Vísceras Crudas',
    ingredients: ['Hígado de res fresco', 'Cortado en tajadas'],
    benefits: ['Rico en hierro', 'Vitaminas del grupo B', 'Se puede dar crudo', 'Ideal para recetas', 'Alto valor nutricional']
  },
  {
    id: '6',
    name: 'Bandeja Vísceras Mixtas',
    description: 'Bandeja con hígado, pulmón, corazón y lengua de res en tajadas. Mezcla completa de vísceras para nutrición óptima.',
    image: '/images/bandeja-viceras-mixtas.jpg',
    category: 'Vísceras Crudas',
    ingredients: ['Hígado de res', 'Pulmón de res', 'Corazón de res', 'Lengua de res', 'Cortado en tajadas'],
    benefits: ['Nutrición completa', 'Variedad de vísceras', 'Se puede dar crudo', 'Ideal para recetas', 'Proteína de alta calidad']
  },
  {
    id: '7',
    name: 'Chorizos BARF',
    description: 'Elaborados con vísceras frescas, coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
    image: '/images/chorizos.jpg',
    category: 'Chorizos',
    ingredients: ['Vísceras frescas', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Formato práctico', 'Digestión mejorada', 'Nutrición concentrada', 'Fácil de servir', 'Ingredientes naturales']
  },
  {
    id: '9',
    name: 'Helados Naturales',
    description: 'Con base de vísceras, coliflor, zanahoria, linaza, aceites naturales, sal marina, calcio + frutas naturales (plátano, arándanos, manzana). Refrescantes, digestivos y sin químicos.',
    image: '/images/helados.jpg',
    category: 'Helados',
    ingredients: ['Vísceras', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio', 'Plátano', 'Arándanos', 'Manzana', 'Agua natural'],
    benefits: ['Refrescante', 'Sin químicos', 'Digestivo', 'Premio saludable', 'Ingredientes completos']
  }
];

export default function CatalogoPerrosPage() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const handleAddToFavorites = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleBuyNow = (productName: string) => {
    // Redirigir a la tienda Tiendanube
    window.open('https://raizel4.mitiendanube.com', '_blank');
  };

  const handleContactWhatsApp = (productName: string) => {
    const message = `Hola! Vengo desde la App de Raízel. Me interesa el producto: ${productName}. ¿Podrían darme más información?`;
    const whatsappUrl = `https://wa.me/573108188723?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
      <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-2 group">
        {/* Imagen del producto con efecto de zoom */}
        <div className="h-64 bg-gray-50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Simulación de imagen con Next.js Image handling o fallback */}
          <div className="text-7xl z-0 transform transition-transform duration-700 group-hover:scale-125">
            {product.category === 'BARF' ? '🥩' : product.category === 'Helados' ? '🍦' : '🍖'}
          </div>

          {/* Badge de calidad */}
          <div className="absolute top-4 left-4 z-20">
            <span className="text-[10px] tracking-widest uppercase font-black text-white bg-green-600 px-3 py-1.5 rounded-full shadow-lg">
              100% Natural
            </span>
          </div>
        </div>

        {/* Contenido con jerarquía visual clara */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-lg">
              {product.category}
            </span>
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="text-xs font-bold text-yellow-700">5.0</span>
            </div>
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-green-600 transition-colors">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2 font-medium">{product.description}</p>

          {/* Ingredientes destacados */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {product.ingredients.slice(0, 3).map((ingredient, index) => (
                <span key={index} className="text-[10px] font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-tighter">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Acciones Premium */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleBuyNow(product.name)}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-green-600 transition-all duration-300 shadow-xl hover:shadow-green-200 flex items-center justify-center space-x-3 group/btn"
            >
              <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
              <span>Pedir a Domicilio</span>
            </button>
            <button
              onClick={() => handleContactWhatsApp(product.name)}
              className="w-full bg-white text-gray-900 font-bold py-3 rounded-2xl border-2 border-gray-100 hover:border-green-600 hover:text-green-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <MessageCircle size={18} />
              <span>Consultar Dieta</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
        {/* Header Minimalista y Premium */}
        <div className="mb-16 text-center">
          <Link href="/" className="inline-flex items-center text-gray-900 hover:text-green-600 font-bold mb-8 transition-all hover:-translate-x-1 group">
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-3 group-hover:bg-green-50 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm uppercase tracking-widest">Volver al Inicio</span>
          </Link>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
            Nutrición <span className="text-green-600">Real</span>.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Nuestra línea gourmet está diseñada para satisfacer los instintos naturales de tu mascota con ingredientes de grado humano.
          </p>
        </div>

        {/* Filtros Estilo Apple */}
        <div className="mb-16 flex flex-wrap justify-center gap-3">
          <button className="bg-gray-900 text-white font-bold px-8 py-3 rounded-2xl shadow-2xl transition-all hover:scale-105">Especies</button>
          {['BARF', 'Albóndigas', 'Pellets', 'Helados'].map(cat => (
            <button key={cat} className="bg-white text-gray-500 font-bold px-8 py-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:text-gray-900 transition-all">
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de productos con espaciado amplio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Footer CTA Ultra Premium */}
        <div className="mt-32 relative overflow-hidden bg-gray-900 rounded-[3rem] p-16 md:p-24 text-white">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-green-600 rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20" />

          <div className="relative z-10 max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter leading-none">
              ¿Tu mascota necesita algo especial?
            </h2>
            <p className="text-2xl text-gray-400 mb-12 font-medium leading-relaxed">
              Asesoría personalizada gratuita con nuestros expertos en nutrición funcional.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => handleContactWhatsApp('Asesoría Personalizada')}
                className="bg-green-600 text-white text-xl font-bold px-12 py-5 rounded-2xl hover:bg-green-500 transition-all shadow-2xl shadow-green-900/20 hover:-translate-y-1"
              >
                Chatear con Nutricionista
              </button>
              <Link href="/calculadora" className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-xl font-bold px-12 py-5 rounded-2xl hover:bg-white/20 transition-all hover:-translate-y-1">
                Calcular Ración
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
