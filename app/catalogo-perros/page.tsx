'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Imagen del producto */}
      <div className="h-56 bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {product.image.startsWith('/images/ALBONDIGAS') ? (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        ) : null}
        <div className="text-6xl z-0">🐕</div>
        {/* En una app real usaríamos next/image con product.image */}
        <div className="absolute bottom-2 left-2 z-20">
             <span className="text-xs font-bold text-white bg-green-600/80 px-2 py-1 rounded-md backdrop-blur-sm">
                RAÍZEL PREMIUM
             </span>
        </div>
      </div>
      
      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">5.0</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{product.description}</p>
        
        {/* Ingredientes */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Ingredientes:</h4>
          <div className="flex flex-wrap gap-1">
            {product.ingredients.slice(0, 4).map((ingredient, index) => (
              <span key={index} className="text-[10px] bg-gray-100 text-gray-700 font-medium px-2 py-1 rounded border border-gray-200">
                {ingredient}
              </span>
            ))}
          </div>
        </div>
        
        {/* Precio y acciones */}
        <div className="flex flex-col space-y-3 pt-2">
            <button 
              onClick={() => handleBuyNow(product.name)}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={18} />
              <span>Comprar en Tiendanube</span>
            </button>
            <button 
              onClick={() => handleContactWhatsApp(product.name)}
              className="w-full bg-white text-green-600 font-bold py-2 rounded-xl border-2 border-green-600 hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle size={18} />
              <span>Consultar WhatsApp</span>
            </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 font-bold mb-6 hover:-translate-x-1 transition-transform">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Raízel
          </Link>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Catálogo Gourmet para Perros
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
            Alimentos biológicamente apropiados (BARF) y snacks funcionales diseñados para una vida larga y saludable.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <button className="bg-green-600 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all hover:scale-105">Todos</button>
          {['BARF', 'Albóndigas', 'Pellets', 'Snacks', 'Helados'].map(cat => (
              <button key={cat} className="bg-white text-gray-700 font-bold px-6 py-2 rounded-full border-2 border-transparent hover:border-green-600 transition-all hover:shadow-md">
                {cat}
              </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-green-600 to-blue-500 rounded-3xl p-12 shadow-2xl text-white">
          <h2 className="text-4xl font-bold mb-4">
            ¿Buscas una dieta personalizada? 🐾
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Nuestro equipo de nutrición animal está listo para diseñar el plan perfecto para tu mascota.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => handleContactWhatsApp('Asesoría Personalizada')}
              className="bg-white text-green-600 text-lg font-bold px-10 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1"
            >
              Hablar con un Experto
            </button>
            <Link href="/calculadora" className="bg-green-400 text-white text-lg font-bold px-10 py-4 rounded-2xl hover:bg-green-300 transition-all shadow-xl hover:-translate-y-1">
              Usar Calculadora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
