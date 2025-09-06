'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Heart, Star, Zap, Camera, Wand2, Brain, Palette, Music } from 'lucide-react';

interface AdvancedVideoEffectsProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEffect: (effect: string, intensity?: number) => void;
}

const effects = [
  { 
    id: 'none', 
    name: 'Sin efecto', 
    icon: Camera, 
    category: 'basic',
    description: 'Video original'
  },
  { 
    id: 'vintage', 
    name: 'Vintage', 
    icon: Star, 
    category: 'filter',
    description: 'Efecto retro clásico',
    intensity: true
  },
  { 
    id: 'blackwhite', 
    name: 'B&N', 
    icon: Heart, 
    category: 'filter',
    description: 'Escala de grises elegante',
    intensity: true
  },
  { 
    id: 'sepia', 
    name: 'Sépia', 
    icon: Star, 
    category: 'filter',
    description: 'Tono cálido vintage',
    intensity: true
  },
  { 
    id: 'blur', 
    name: 'Desenfoque', 
    icon: Sparkles, 
    category: 'effect',
    description: 'Efecto de profundidad',
    intensity: true
  },
  { 
    id: 'brightness', 
    name: 'Brillo', 
    icon: Zap, 
    category: 'adjustment',
    description: 'Ajuste de luminosidad',
    intensity: true
  },
  { 
    id: 'contrast', 
    name: 'Contraste', 
    icon: Star, 
    category: 'adjustment',
    description: 'Mejora de contraste',
    intensity: true
  },
  { 
    id: 'saturate', 
    name: 'Saturación', 
    icon: Palette, 
    category: 'adjustment',
    description: 'Intensidad de colores',
    intensity: true
  },
  { 
    id: 'ai_enhance', 
    name: 'IA Mejora', 
    icon: Brain, 
    category: 'ai',
    description: 'Mejora automática con IA',
    intensity: false
  },
  { 
    id: 'ai_style', 
    name: 'IA Estilo', 
    icon: Wand2, 
    category: 'ai',
    description: 'Aplicar estilo artístico',
    intensity: false
  },
  { 
    id: 'ai_anime', 
    name: 'IA Anime', 
    icon: Sparkles, 
    category: 'ai',
    description: 'Convertir a estilo anime',
    intensity: false
  },
  { 
    id: 'ai_pet_focus', 
    name: 'IA Enfoque Mascota', 
    icon: Heart, 
    category: 'ai',
    description: 'Resaltar mascota con IA',
    intensity: false
  }
];

export default function AdvancedVideoEffects({ isOpen, onClose, onApplyEffect }: AdvancedVideoEffectsProps) {
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [intensity, setIntensity] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Simular sugerencias de IA
      setAiSuggestions([
        'Detectar mascota y aplicar filtro cálido',
        'Mejorar iluminación automáticamente',
        'Aplicar efecto de profundidad',
        'Convertir a estilo artístico'
      ]);
    }
  }, [isOpen]);

  const handleApply = async () => {
    if (selectedEffect === 'none') {
      onApplyEffect('none');
      onClose();
      return;
    }

    setProcessing(true);

    // Simular procesamiento de IA
    if (selectedEffect.startsWith('ai_')) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    onApplyEffect(selectedEffect, intensity);
    setProcessing(false);
    onClose();
  };

  const handleAiSuggestion = async (suggestion: string) => {
    setProcessing(true);
    
    // Simular procesamiento de IA basado en la sugerencia
    let effect = 'ai_enhance';
    if (suggestion.includes('filtro cálido')) effect = 'vintage';
    if (suggestion.includes('iluminación')) effect = 'brightness';
    if (suggestion.includes('profundidad')) effect = 'blur';
    if (suggestion.includes('artístico')) effect = 'ai_style';

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onApplyEffect(effect, 75);
    setProcessing(false);
    onClose();
  };

  const getEffectIcon = (effect: any) => {
    const Icon = effect.icon;
    const isAi = effect.category === 'ai';
    return (
      <div className={`relative ${isAi ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gray-700'} rounded-lg p-2`}>
        <Icon className="w-6 h-6 text-white" />
        {isAi && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">AI</span>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
      <div className="w-full bg-gray-900 rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Efectos Avanzados</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* AI Suggestions */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-purple-500" />
              <h4 className="text-white font-medium">Sugerencias de IA</h4>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleAiSuggestion(suggestion)}
                  disabled={processing}
                  className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <Wand2 className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300 text-sm">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Effect Categories */}
          <div className="space-y-4">
            {['basic', 'filter', 'effect', 'adjustment', 'ai'].map(category => {
              const categoryEffects = effects.filter(e => e.category === category);
              if (categoryEffects.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="text-white font-medium mb-3 capitalize">
                    {category === 'ai' ? '🤖 Inteligencia Artificial' : 
                     category === 'filter' ? '🎨 Filtros' :
                     category === 'effect' ? '✨ Efectos' :
                     category === 'adjustment' ? '⚙️ Ajustes' : '📷 Básico'}
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {categoryEffects.map((effect) => (
                      <button
                        key={effect.id}
                        onClick={() => setSelectedEffect(effect.id)}
                        className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                          selectedEffect === effect.id
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {getEffectIcon(effect)}
                        <span className="text-xs text-center mt-2">{effect.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Intensity Slider */}
          {selectedEffect !== 'none' && effects.find(e => e.id === selectedEffect)?.intensity && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm">Intensidad</span>
                <span className="text-gray-400 text-sm">{intensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          )}

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={processing}
            className="w-full mt-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Procesando con IA...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Aplicar Efecto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
