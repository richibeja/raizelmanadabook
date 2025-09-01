'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  benefits: string[];
}

const products: Product[] = [
  {
    id: '1',
    name: 'Vital BARF - Pollo',
    description: 'Alimento crudo biológicamente apropiado con vísceras y carne de pollo, verduras, avena, linaza y plantas medicinales.',
    price: 45000,
    image: '/images/producto-pollo.jpg',
    category: 'BARF',
    ingredients: ['Vísceras de pollo', 'Carne de pollo', 'Verduras', 'Avena', 'Linaza', 'Plantas medicinales'],
    benefits: ['Alimento crudo natural', 'Mejora digestión', 'Pelo brillante', 'Energía natural']
  },
  {
    id: '2',
    name: 'Vital BARF - Res',
    description: 'Vísceras de res, zanahoria, calabacín, avena, linaza y plantas digestivas.',
    price: 52000,
    image: '/images/producto-res.jpg',
    category: 'BARF',
    ingredients: ['Vísceras de res', 'Zanahoria', 'Calabacín', 'Avena', 'Linaza', 'Plantas digestivas'],
    benefits: ['Proteína de alta calidad', 'Digestión mejorada', 'Sistema inmune fuerte', 'Peso saludable']
  },
  {
    id: '3',
    name: 'Vital Pellets Naturales',
    description: 'Pellets deshidratados de vísceras con plantas medicinales y granos funcionales. Prácticos y de larga duración.',
    price: 38000,
    image: '/images/pellets.jpg',
    category: 'Pellets',
    ingredients: ['Vísceras deshidratadas', 'Plantas medicinales', 'Granos funcionales', 'Vitaminas naturales'],
    benefits: ['Fácil almacenamiento', 'Nutrición completa', 'Larga duración', 'Conveniente']
  },
  {
    id: '4',
    name: 'Chorizos BARF',
    description: 'Elaborados con vísceras frescas. Recubiertos de avena y linaza para mejor digestión.',
    price: 28000,
    image: '/images/chorizos.jpg',
    category: 'Chorizos',
    ingredients: ['Vísceras frescas', 'Avena', 'Linaza', 'Especias naturales'],
    benefits: ['Formato práctico', 'Digestión mejorada', 'Nutrición concentrada', 'Fácil de servir']
  },
  {
    id: '5',
    name: 'Albóndigas Funcionales',
    description: 'Hechas con vísceras + avena y linaza. Formato práctico para porciones diarias.',
    price: 32000,
    image: '/images/albondegas.jpg',
    category: 'Albóndigas',
    ingredients: ['Vísceras', 'Avena', 'Linaza', 'Verduras', 'Hierbas naturales'],
    benefits: ['Porciones controladas', 'Nutrición balanceada', 'Fácil de medir', 'Ideal para dietas']
  },
  {
    id: '6',
    name: 'Helados Naturales',
    description: 'Con base de vísceras + frutas naturales (plátano, arándanos, manzana). Refrescantes, digestivos y sin químicos.',
    price: 15000,
    image: '/images/helados.jpg',
    category: 'Helados',
    ingredients: ['Vísceras', 'Plátano', 'Arándanos', 'Manzana', 'Agua natural'],
    benefits: ['Refrescante', 'Sin químicos', 'Digestivo', 'Premio saludable']
  }
];

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
            <span className="text-2xl font-bold text-gray-800">${product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-500 ml-1">COP</span>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
              <Heart size={20} />
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1">
              <ShoppingCart size={16} />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CatalogoPerros() {
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
