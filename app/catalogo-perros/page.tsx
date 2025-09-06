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
    id: '8',
    name: 'Albóndigas Funcionales',
    description: 'Hechas con vísceras, coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio. Formato práctico para porciones diarias.',
    image: '/images/albondegas.jpg',
    category: 'Albóndigas',
    ingredients: ['Vísceras', 'Coliflor', 'Zanahoria', 'Linaza', 'Aceites naturales', 'Sal marina', 'Calcio'],
    benefits: ['Porciones controladas', 'Nutrición balanceada', 'Fácil de medir', 'Ideal para dietas', 'Ingredientes completos']
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
      <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <div className="text-6xl">🐕</div>
      </div>
      
      {/* Contenido */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
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
                <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
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
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Raízel
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Productos para Perros</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Alimentos naturales y funcionales diseñados específicamente para el bienestar de tu perro. 
            Todos nuestros productos están libres de conservantes y químicos artificiales.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Todos</button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">BARF</button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">Pellets</button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">Chorizos</button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">Albóndigas</button>
          <button className="bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50">Helados</button>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-gray-600 mb-6">
            Contáctanos para productos personalizados o consultas sobre la dieta de tu perro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
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
