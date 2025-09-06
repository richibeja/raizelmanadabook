'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Thermometer, ChefHat, MessageCircle, Heart, ShoppingCart, Star } from 'lucide-react';

interface Recipe {
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
  category: 'BARF' | 'Vísceras Crudas' | 'Cocido' | 'Helados';
}

const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Bandeja de Hígado Crudo con Zanahoria',
    description: 'Receta simple con hígado de res crudo en tajadas y zanahoria rallada. Perfecta para perros activos.',
    image: '/images/receta-higado-crudo.jpg',
    difficulty: 'Fácil',
    time: '5 min',
    servings: '2-3 porciones',
    temperature: 'Crudo',
    category: 'Vísceras Crudas',
    ingredients: [
      '200g de hígado de res en tajadas',
      '1 zanahoria mediana rallada',
      '1 cucharada de aceite de oliva',
      '1 cucharadita de sal marina',
      '1 cucharadita de calcio en polvo'
    ],
    instructions: [
      'Retira las tajadas de hígado del refrigerador 10 minutos antes',
      'Ralla la zanahoria finamente',
      'Mezcla el hígado con la zanahoria rallada',
      'Agrega el aceite de oliva y la sal marina',
      'Espolvorea el calcio en polvo',
      'Sirve inmediatamente'
    ],
    benefits: [
      'Rico en hierro y vitaminas del grupo B',
      'Fácil digestión',
      'Mantiene nutrientes naturales',
      'Ideal para perros activos'
    ],
    tips: [
      'El hígado debe estar fresco',
      'No cocines para mantener nutrientes',
      'Sirve a temperatura ambiente',
      'Ideal para perros adultos'
    ]
  },
  {
    id: '2',
    name: 'Vísceras Mixtas con Coliflor',
    description: 'Mezcla de hígado, pulmón, corazón y lengua con coliflor cocido. Nutrición completa para perros.',
    image: '/images/receta-viceras-mixtas.jpg',
    difficulty: 'Intermedio',
    time: '15 min',
    servings: '4-5 porciones',
    temperature: 'Crudo/Cocido',
    category: 'Vísceras Crudas',
    ingredients: [
      '150g de hígado de res en tajadas',
      '100g de pulmón de res en tajadas',
      '100g de corazón de res en tajadas',
      '100g de lengua de res en tajadas',
      '1 taza de coliflor cocido',
      '2 cucharadas de aceite de coco',
      '1 cucharadita de sal marina',
      '1 cucharadita de calcio en polvo'
    ],
    instructions: [
      'Prepara las vísceras cortándolas en trozos pequeños',
      'Cocina la coliflor hasta que esté tierna',
      'Mezcla todas las vísceras en un bowl',
      'Agrega la coliflor cocida y mezcla bien',
      'Incorpora el aceite de coco y la sal marina',
      'Espolvorea el calcio en polvo',
      'Sirve inmediatamente'
    ],
    benefits: [
      'Nutrición completa con variedad de vísceras',
      'Rico en proteínas y minerales',
      'Fácil digestión',
      'Ideal para perros en crecimiento'
    ],
    tips: [
      'Las vísceras deben estar frescas',
      'La coliflor debe estar bien cocida',
      'Mezcla bien todos los ingredientes',
      'Sirve en porciones adecuadas'
    ]
  },
  {
    id: '3',
    name: 'BARF de Cordero con Verduras',
    description: 'Receta completa BARF con cordero, coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
    image: '/images/receta-cordero-barf.jpg',
    difficulty: 'Intermedio',
    time: '25 min',
    servings: '6-8 porciones',
    temperature: 'Crudo',
    category: 'BARF',
    ingredients: [
      '300g de carne de cordero molida',
      '200g de vísceras de cordero',
      '1 taza de coliflor crudo',
      '1 zanahoria mediana',
      '2 cucharadas de linaza molida',
      '2 cucharadas de aceite de oliva',
      '1 cucharada de aceite de coco',
      '1 cucharadita de sal marina',
      '1 cucharadita de calcio en polvo'
    ],
    instructions: [
      'Pica finamente la coliflor y la zanahoria',
      'Mezcla la carne de cordero con las vísceras',
      'Agrega las verduras picadas y mezcla bien',
      'Incorpora la linaza molida',
      'Añade los aceites y la sal marina',
      'Espolvorea el calcio en polvo',
      'Mezcla todo hasta integrar bien',
      'Refrigera por 2 horas antes de servir'
    ],
    benefits: [
      'Proteína de cordero de alta calidad',
      'Verduras ricas en fibra',
      'Aceites esenciales para la piel',
      'Minerales y vitaminas completas'
    ],
    tips: [
      'Usa carne de cordero fresca',
      'Las verduras deben estar bien picadas',
      'Mezcla bien todos los ingredientes',
      'Refrigera antes de servir'
    ]
  },
  {
    id: '4',
    name: 'Hígado Cocido con Arroz Integral',
    description: 'Hígado de res cocido con arroz integral, ideal para gatos y perros con problemas digestivos.',
    image: '/images/receta-higado-cocido.jpg',
    difficulty: 'Fácil',
    time: '20 min',
    servings: '3-4 porciones',
    temperature: 'Cocido',
    category: 'Cocido',
    ingredients: [
      '200g de hígado de res en tajadas',
      '1 taza de arroz integral cocido',
      '1 zanahoria pequeña cocida',
      '1 cucharada de aceite de oliva',
      '1 cucharadita de sal marina',
      '1 cucharadita de calcio en polvo'
    ],
    instructions: [
      'Cocina el hígado en agua hirviendo por 10 minutos',
      'Cocina el arroz integral según instrucciones',
      'Cocina la zanahoria hasta que esté tierna',
      'Corta el hígado cocido en trozos pequeños',
      'Mezcla el hígado con el arroz y la zanahoria',
      'Agrega el aceite de oliva y la sal marina',
      'Espolvorea el calcio en polvo',
      'Sirve tibio'
    ],
    benefits: [
      'Fácil digestión',
      'Rico en hierro y vitaminas',
      'Ideal para mascotas sensibles',
      'Arroz integral para fibra'
    ],
    tips: [
      'No cocines el hígado demasiado',
      'El arroz debe estar bien cocido',
      'Sirve a temperatura tibia',
      'Ideal para gatos y perros senior'
    ]
  },
  {
    id: '5',
    name: 'Helado de Vísceras con Frutas',
    description: 'Helado refrescante con base de vísceras, coliflor, zanahoria, linaza y frutas naturales.',
    image: '/images/receta-helado-viceras.jpg',
    difficulty: 'Fácil',
    time: '30 min',
    servings: '6-8 porciones',
    temperature: 'Congelado',
    category: 'Helados',
    ingredients: [
      '150g de hígado de res en tajadas',
      '1/2 taza de coliflor cocido',
      '1 zanahoria pequeña cocida',
      '1 cucharada de linaza molida',
      '1 cucharada de aceite de coco',
      '1 plátano maduro',
      '1/2 taza de arándanos',
      '1 cucharadita de sal marina',
      '1 cucharadita de calcio en polvo'
    ],
    instructions: [
      'Cocina el hígado, coliflor y zanahoria',
      'Licúa las vísceras cocidas con las verduras',
      'Agrega la linaza, aceite de coco y sal marina',
      'Incorpora el plátano y los arándanos',
      'Licúa hasta obtener una mezcla homogénea',
      'Espolvorea el calcio en polvo',
      'Vierte en moldes para helados',
      'Congela por 3-4 horas'
    ],
    benefits: [
      'Refrescante en días calurosos',
      'Nutrición completa',
      'Fácil de servir',
      'Ideal para verano'
    ],
    tips: [
      'Usa frutas maduras',
      'La mezcla debe estar bien licuada',
      'Congela por al menos 3 horas',
      'Sirve inmediatamente'
    ]
  },
  {
    id: '6',
    name: 'BARF de Cordero para Gatos',
    description: 'Receta especial para gatos con cordero, coliflor, zanahoria, linaza, aceites naturales, sal marina y calcio.',
    image: '/images/receta-cordero-gatos.jpg',
    difficulty: 'Intermedio',
    time: '20 min',
    servings: '4-5 porciones',
    temperature: 'Crudo',
    category: 'BARF',
    ingredients: [
      '250g de carne de cordero molida',
      '150g de vísceras de cordero',
      '1/2 taza de coliflor crudo',
      '1 zanahoria pequeña',
      '1 cucharada de linaza molida',
      '1 cucharada de aceite de pescado',
      '1 cucharada de aceite de coco',
      '1/2 cucharadita de sal marina',
      '1 cucharadita de calcio en polvo'
    ],
    instructions: [
      'Pica finamente la coliflor y la zanahoria',
      'Mezcla la carne de cordero con las vísceras',
      'Agrega las verduras picadas',
      'Incorpora la linaza molida',
      'Añade los aceites y la sal marina',
      'Espolvorea el calcio en polvo',
      'Mezcla todo hasta integrar bien',
      'Refrigera por 1 hora antes de servir'
    ],
    benefits: [
      'Proteína de cordero suave',
      'Ideal para gatos sensibles',
      'Verduras ricas en fibra',
      'Aceites esenciales'
    ],
    tips: [
      'Usa porciones pequeñas para gatos',
      'Las verduras deben estar bien picadas',
      'Mezcla bien todos los ingredientes',
      'Refrigera antes de servir'
    ]
  }
];

export default function RecetasPage() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

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
    const message = `Hola! Me interesa la receta: ${recipeName}. ¿Podrían darme más información sobre los ingredientes y cómo puedo adquirirlos?`;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'BARF': return 'bg-blue-100 text-blue-800';
      case 'Vísceras Crudas': return 'bg-red-100 text-red-800';
      case 'Cocido': return 'bg-orange-100 text-orange-800';
      case 'Helados': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecipes = selectedCategory === 'Todas' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  const categories = ['Todas', 'BARF', 'Vísceras Crudas', 'Cocido', 'Helados'];

  const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Imagen de la receta */}
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">🍽️</div>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(recipe.category)}`}>
              {recipe.category}
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
              <ChefHat size={16} className="mr-2" />
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Raízel
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🍽️ Recetas para Mascotas</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Descubre recetas deliciosas y nutritivas para tu mascota usando nuestros productos BARF, 
            vísceras crudas y ingredientes naturales. Desde platos crudos hasta helados refrescantes.
          </p>
        </div>

        {/* Filtros por categoría */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-orange-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{recipes.length}</div>
            <div className="text-sm text-gray-600">Recetas disponibles</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">5-30 min</div>
            <div className="text-sm text-gray-600">Tiempo promedio</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">2-8</div>
            <div className="text-sm text-gray-600">Porciones por receta</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌿</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">100%</div>
            <div className="text-sm text-gray-600">Natural</div>
          </div>
        </div>

        {/* Grid de recetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map(recipe => (
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
                  <div className="relative h-64 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl">🍽️</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Clock size={24} className="mx-auto mb-2 text-orange-600" />
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
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
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
                          <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0">
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
            Contáctanos para obtener los ingredientes frescos y de calidad para preparar estas deliciosas recetas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleContactWhatsApp('Ingredientes para recetas')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>Consultar ingredientes</span>
            </button>
            <Link href="/catalogo-perros" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
              Ver productos para perros
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
