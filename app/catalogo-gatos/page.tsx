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
    name: 'Vital BARF - Pollo para Gatos',
    description: 'Pollo → vísceras y carne de pollo + coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
    image: '/images/gato-pollo.jpg',
    category: 'BARF',
    ingredients: ['Vísceras de pollo', 'Carne de pollo', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Alimento crudo natural', 'Mejora digestión', 'Pelo brillante', 'Energía natural', 'Huesos fuertes']
  },
  {
    id: '2',
    name: 'Vital BARF - Res para Gatos',
    description: 'Res → vísceras y carne de res + coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
    image: '/images/gato-res.jpg',
    category: 'BARF',
    ingredients: ['Vísceras de res', 'Carne de res', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Proteína de alta calidad', 'Digestión mejorada', 'Sistema inmune fuerte', 'Peso saludable', 'Minerales esenciales']
  },
  {
    id: '3',
    name: 'Vital BARF - Cordero para Gatos',
    description: 'Cordero → vísceras y carne de cordero + coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio. Ideal para gatos sensibles.',
    image: '/images/gato-cordero.jpg',
    category: 'BARF',
    ingredients: ['Vísceras de cordero', 'Carne de cordero', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Proteína de cordero', 'Fácil digestión', 'Rico en hierro', 'Ideal para gatos sensibles', 'Sabor suave']
  },
  {
    id: '4',
    name: 'Vital Pellets Naturales para Gatos',
    description: 'Formato adaptado a gatos: vísceras con coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
    image: '/images/gato-pellets.jpg',
    category: 'Pellets',
    ingredients: ['Vísceras deshidratadas', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Fácil almacenamiento', 'Nutrición completa', 'Larga duración', 'Conveniente', 'Ingredientes completos']
  },
  {
    id: '5',
    name: 'Bocaditos Naturales para Gatos',
    description: 'Mini porciones de vísceras con coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio. Especiales para premiar o complementar la dieta.',
    image: '/images/gato-bocaditos.jpg',
    category: 'Bocaditos',
    ingredients: ['Vísceras', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Formato pequeño', 'Digestión mejorada', 'Nutrición concentrada', 'Fácil de servir', 'Ingredientes naturales']
  },
  {
    id: '6',
    name: 'Bandeja Hígado de Res para Gatos',
    description: 'Vísceras crudas de hígado de res en tajadas pequeñas. Se puede dar crudo o preparar en recetas. Rico en hierro y vitaminas.',
    image: '/images/gato-higado.jpg',
    category: 'Vísceras Crudas',
    ingredients: ['Hígado de res fresco', 'Cortado en tajadas pequeñas'],
    benefits: ['Rico en hierro', 'Vitaminas del grupo B', 'Se puede dar crudo', 'Ideal para recetas', 'Alto valor nutricional']
  }
];

export default function CatalogoGatosPage() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const handleAddToFavorites = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        alert('Producto removido de favoritos');
      } else {
        newFavorites.add(productId);
        alert('Producto agregado a favoritos');
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (productId: string) => {
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(productId)) {
        alert('Este producto ya está en tu carrito');
      } else {
        newCart.add(productId);
        alert('Producto agregado al carrito');
      }
      return newCart;
    });
  };

  const handleContactWhatsApp = (productName: string) => {
    const message = `Hola! Me interesa el producto: ${productName}. ¿Podrían darme más información sobre disponibilidad y cómo puedo adquirirlo?`;
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagen del producto */}
      <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-6xl">🐱</div>
      </div>
      
      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.9</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
        
        {/* Ingredientes */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes principales:</h4>
          <div className="flex flex-wrap gap-1">
            {product.ingredients.slice(0, 3).map((ingredient, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {ingredient}
              </span>
            ))}
          </div>
        </div>
        
        {/* Beneficios */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Beneficios:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {product.benefits.slice(0, 2).map((benefit, index) => (
              <li key={index} className="flex items-center">
                <span className="w-1 h-1 bg-purple-500 rounded-full mr-2"></span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Precio y acciones */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-green-600">Consultar precio</span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleAddToFavorites(product.id)}
              className={`p-2 transition-colors ${
                favorites.has(product.id) 
                  ? 'text-red-500' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={() => handleContactWhatsApp(product.name)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-1"
            >
              <ShoppingCart size={16} />
              <span>Consultar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Raízel
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Productos para Gatos</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Recetas BARF, pellets adaptados y bocaditos naturales diseñados específicamente para gatos. 
            Nutrición natural que respeta las necesidades felinas.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">Todos</button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">BARF</button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">Pellets</button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">Bocaditos</button>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">¿Por qué BARF para gatos?</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Alimento crudo biológicamente apropiado</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Mejora la digestión y absorción de nutrientes</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Pelo más brillante y saludable</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Reduce problemas digestivos</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Transición gradual</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <span className="font-medium text-purple-600">Semana 1:</span> 25% BARF + 75% alimento actual
              </div>
              <div>
                <span className="font-medium text-purple-600">Semana 2:</span> 50% BARF + 50% alimento actual
              </div>
              <div>
                <span className="font-medium text-purple-600">Semana 3:</span> 75% BARF + 25% alimento actual
              </div>
              <div>
                <span className="font-medium text-purple-600">Semana 4:</span> 100% BARF
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              * Consulta con tu veterinario antes de cambiar la dieta de tu gato
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ¿Necesitas asesoría para tu gato?
          </h2>
          <p className="text-gray-600 mb-6">
            Contáctanos para consultas sobre la dieta BARF o productos personalizados para tu felino.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Contactar
            </Link>
            <Link href="/calculadora" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Calculadora de Porciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
