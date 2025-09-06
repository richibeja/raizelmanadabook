'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Heart, Star, MessageCircle, Clock, Users, Thermometer } from 'lucide-react';

interface HeladoRecipe {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
  time: string;
  servings: string;
  temperature: string;
  ingredients: string[];
  instructions: string[];
  benefits: string[];
  tips: string[];
}

const heladoRecipes: HeladoRecipe[] = [
  {
    id: '1',
    name: 'Helado de Pollo y Zanahoria',
    description: 'Delicioso helado refrescante con pollo desmenuzado y zanahoria, perfecto para días calurosos.',
    image: '/images/helado-pollo-zanahoria.jpg',
    difficulty: 'Fácil',
    time: '15 min',
    servings: '4 porciones',
    temperature: 'Congelado',
    ingredients: [
      '200g de pollo cocido desmenuzado',
      '1 zanahoria mediana rallada',
      '1 taza de caldo de pollo natural',
      '1/2 taza de yogur natural sin azúcar',
      '1 cucharada de miel de abeja',
      '1 cucharadita de cúrcuma',
      'Hielo picado'
    ],
    instructions: [
      'Mezcla el pollo desmenuzado con la zanahoria rallada',
      'Agrega el caldo de pollo y el yogur natural',
      'Añade la miel y la cúrcuma, mezcla bien',
      'Coloca en moldes para helados o vasos pequeños',
      'Congela por 2-3 horas hasta que esté firme',
      'Sirve inmediatamente para mantener la textura cremosa'
    ],
    benefits: [
      'Refrescante en días calurosos',
      'Rico en proteínas',
      'Fácil digestión',
      'Hidratación natural'
    ],
    tips: [
      'Usa pollo sin condimentos',
      'La zanahoria debe estar bien rallada',
      'No congeles por más de 4 horas',
      'Sirve a temperatura ambiente por 5 minutos antes de dar'
    ]
  },
  {
    id: '2',
    name: 'Helado de Hígado y Espinacas',
    description: 'Helado nutritivo con hígado de res y espinacas, ideal para perros con anemia o debilidad.',
    image: '/images/helado-higado-espinacas.jpg',
    difficulty: 'Intermedio',
    time: '20 min',
    servings: '6 porciones',
    temperature: 'Congelado',
    ingredients: [
      '150g de hígado de res cocido',
      '1 taza de espinacas frescas',
      '1/2 taza de caldo de res natural',
      '1/4 taza de queso cottage bajo en sodio',
      '1 cucharada de aceite de coco',
      '1 cucharadita de levadura nutricional',
      'Hielo picado'
    ],
    instructions: [
      'Cocina el hígado hasta que esté bien hecho',
      'Licúa las espinacas con el caldo de res',
      'Mezcla el hígado desmenuzado con la mezcla de espinacas',
      'Agrega el queso cottage y el aceite de coco',
      'Añade la levadura nutricional y mezcla bien',
      'Vierte en moldes y congela por 3-4 horas'
    ],
    benefits: [
      'Alto contenido de hierro',
      'Rico en vitaminas del grupo B',
      'Fortalece el sistema inmunológico',
      'Ideal para perros anémicos'
    ],
    tips: [
      'El hígado debe estar bien cocido',
      'Las espinacas deben estar frescas',
      'No agregues sal',
      'Sirve en porciones pequeñas'
    ]
  },
  {
    id: '3',
    name: 'Helado de Salmón y Camote',
    description: 'Helado cremoso con salmón y camote, perfecto para perros con problemas de piel o alergias.',
    image: '/images/helado-salmon-camote.jpg',
    difficulty: 'Fácil',
    time: '18 min',
    servings: '5 porciones',
    temperature: 'Congelado',
    ingredients: [
      '200g de salmón cocido sin piel',
      '1 camote mediano cocido',
      '1/2 taza de caldo de pescado natural',
      '1/4 taza de aceite de salmón',
      '1 cucharada de perejil fresco',
      '1 cucharadita de jengibre rallado',
      'Hielo picado'
    ],
    instructions: [
      'Cocina el salmón y el camote por separado',
      'Mezcla el salmón desmenuzado con el camote machacado',
      'Agrega el caldo de pescado gradualmente',
      'Incorpora el aceite de salmón y el perejil',
      'Añade el jengibre rallado y mezcla bien',
      'Vierte en moldes y congela por 2-3 horas'
    ],
    benefits: [
      'Rico en omega-3',
      'Beneficioso para la piel y pelo',
      'Antiinflamatorio natural',
      'Fácil digestión'
    ],
    tips: [
      'Usa salmón sin espinas',
      'El camote debe estar bien cocido',
      'No uses condimentos',
      'Ideal para perros con alergias'
    ]
  },
  {
    id: '4',
    name: 'Helado de Yogur y Arándanos',
    description: 'Helado refrescante con yogur natural y arándanos, ideal para perros activos en verano.',
    image: '/images/helado-yogur-arandanos.jpg',
    difficulty: 'Fácil',
    time: '12 min',
    servings: '4 porciones',
    temperature: 'Congelado',
    ingredients: [
      '1 taza de yogur natural sin azúcar',
      '1/2 taza de arándanos frescos',
      '1/4 taza de miel de abeja',
      '1 cucharada de aceite de coco',
      '1 cucharadita de canela',
      'Hielo picado'
    ],
    instructions: [
      'Lava y seca los arándanos',
      'Mezcla el yogur con la miel y el aceite de coco',
      'Agrega la canela y mezcla bien',
      'Incorpora los arándanos enteros',
      'Vierte en moldes para helados',
      'Congela por 2-3 horas hasta que esté firme'
    ],
    benefits: [
      'Rico en antioxidantes',
      'Probióticos naturales',
      'Refrescante y hidratante',
      'Bajo en calorías'
    ],
    tips: [
      'Usa arándanos frescos',
      'El yogur debe ser natural',
      'No agregues azúcar',
      'Perfecto para días calurosos'
    ]
  },
  {
    id: '5',
    name: 'Helado de Carne y Calabaza',
    description: 'Helado nutritivo con carne molida y calabaza, perfecto para perros con problemas digestivos.',
    image: '/images/helado-carne-calabaza.jpg',
    difficulty: 'Intermedio',
    time: '25 min',
    servings: '6 porciones',
    temperature: 'Congelado',
    ingredients: [
      '250g de carne molida magra',
      '1 taza de calabaza cocida',
      '1/2 taza de caldo de res natural',
      '1/4 taza de avena cocida',
      '1 cucharada de aceite de oliva',
      '1 cucharadita de comino',
      'Hielo picado'
    ],
    instructions: [
      'Cocina la carne molida hasta que esté bien hecha',
      'Cocina la calabaza hasta que esté tierna',
      'Mezcla la carne con la calabaza machacada',
      'Agrega el caldo de res y la avena cocida',
      'Incorpora el aceite de oliva y el comino',
      'Vierte en moldes y congela por 3-4 horas'
    ],
    benefits: [
      'Fácil digestión',
      'Rico en fibra',
      'Proteína de alta calidad',
      'Ideal para perros con problemas estomacales'
    ],
    tips: [
      'La carne debe estar bien cocida',
      'La calabaza debe estar sin semillas',
      'No agregues condimentos fuertes',
      'Sirve en porciones pequeñas'
    ]
  },
  {
    id: '6',
    name: 'Helado de Pescado y Algas',
    description: 'Helado especial con pescado blanco y algas marinas, ideal para perros con problemas de tiroides.',
    image: '/images/helado-pescado-algas.jpg',
    difficulty: 'Avanzado',
    time: '30 min',
    servings: '8 porciones',
    temperature: 'Congelado',
    ingredients: [
      '300g de pescado blanco cocido',
      '2 cucharadas de algas marinas secas',
      '1 taza de caldo de pescado natural',
      '1/4 taza de aceite de pescado',
      '1 cucharada de espirulina en polvo',
      '1 cucharadita de sal marina',
      'Hielo picado'
    ],
    instructions: [
      'Cocina el pescado hasta que esté bien hecho',
      'Hidrata las algas marinas en agua tibia',
      'Mezcla el pescado desmenuzado con las algas',
      'Agrega el caldo de pescado gradualmente',
      'Incorpora el aceite de pescado y la espirulina',
      'Añade la sal marina y mezcla bien',
      'Vierte en moldes y congela por 4-5 horas'
    ],
    benefits: [
      'Rico en yodo natural',
      'Beneficioso para la tiroides',
      'Alto contenido de minerales',
      'Antiinflamatorio natural'
    ],
    tips: [
      'Usa pescado sin espinas',
      'Las algas deben estar bien hidratadas',
      'No excedas la cantidad de sal',
      'Ideal para perros con problemas de tiroides'
    ]
  }
];

export default function HeladosPage() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<HeladoRecipe | null>(null);

  const handleAddToFavorites = (recipeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
        alert('Receta removida de favoritos');
      } else {
        newFavorites.add(recipeId);
        alert('Receta agregada a favoritos');
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (recipeId: string) => {
    setCart(prev => {
      const newCart = new Set(prev);
      if (newCart.has(recipeId)) {
        alert('Esta receta ya está en tu carrito');
      } else {
        newCart.add(recipeId);
        alert('Receta agregada al carrito');
      }
      return newCart;
    });
  };

  const handleContactWhatsApp = (recipeName: string) => {
    const message = `Hola! Me interesa la receta de helado: ${recipeName}. ¿Podrían darme más información sobre los ingredientes y cómo puedo adquirirlos?`;
    const whatsappUrl = `https://wa.me/573001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const RecipeCard: React.FC<{ recipe: HeladoRecipe }> = ({ recipe }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Imagen del helado */}
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">🍦</div>
          </div>
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Información básica */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800">{recipe.name}</h3>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>

          {/* Información de la receta */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              {recipe.time}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users size={16} className="mr-2" />
              {recipe.servings}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Thermometer size={16} className="mr-2" />
              {recipe.temperature}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star size={16} className="mr-2" />
              {recipe.difficulty}
            </div>
          </div>

          {/* Ingredientes principales */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredientes principales:</h4>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {ingredient}
                </span>
              ))}
              {recipe.ingredients.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{recipe.ingredients.length - 3} más
                </span>
              )}
            </div>
          </div>

          {/* Beneficios */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Beneficios:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {recipe.benefits.slice(0, 2).map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => handleAddToFavorites(recipe.id)}
                className={`p-2 transition-colors ${
                  favorites.has(recipe.id) 
                    ? 'text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
                title="Agregar a favoritos"
              >
                <Heart size={20} fill={favorites.has(recipe.id) ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => handleAddToCart(recipe.id)}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                title="Agregar al carrito"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Ver receta
              </button>
              <button
                onClick={() => handleContactWhatsApp(recipe.name)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <MessageCircle size={16} />
                <span>Consultar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Raízel
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🍦 Recetas de Helados para Mascotas</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Descubre las mejores recetas de helados caseros para refrescar a tu mascota en días calurosos. 
            Ingredientes naturales y nutritivos que mantendrán a tu peludo feliz y saludable.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🍦</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{heladoRecipes.length}</div>
            <div className="text-sm text-gray-600">Recetas disponibles</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">15-30 min</div>
            <div className="text-sm text-gray-600">Tiempo promedio</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">4-8</div>
            <div className="text-sm text-gray-600">Porciones por receta</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">❄️</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">100%</div>
            <div className="text-sm text-gray-600">Natural</div>
          </div>
        </div>

        {/* Grid de recetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {heladoRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {/* Modal de receta completa */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{selectedRecipe.name}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Imagen y info básica */}
                <div>
                  <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl">🍦</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock size={24} className="mx-auto mb-2 text-blue-600" />
                      <div className="font-semibold">{selectedRecipe.time}</div>
                      <div className="text-sm text-gray-600">Tiempo</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Users size={24} className="mx-auto mb-2 text-green-600" />
                      <div className="font-semibold">{selectedRecipe.servings}</div>
                      <div className="text-sm text-gray-600">Porciones</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">{selectedRecipe.description}</p>
                </div>

                {/* Ingredientes e instrucciones */}
                <div className="space-y-6">
                  {/* Ingredientes */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredientes</h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-600">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instrucciones */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Instrucciones</h3>
                    <ol className="space-y-3">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-600">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Beneficios y tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Beneficios</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Tips importantes</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => handleContactWhatsApp(selectedRecipe.name)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <MessageCircle size={20} />
                  <span>Consultar ingredientes</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            ¿Necesitas ingredientes para estas recetas?
          </h2>
          <p className="text-gray-600 mb-6">
            Contáctanos para obtener los ingredientes frescos y de calidad para preparar estos deliciosos helados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleContactWhatsApp('Ingredientes para helados')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>Consultar ingredientes</span>
            </button>
            <Link href="/catalogo-perros" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Ver productos para perros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
