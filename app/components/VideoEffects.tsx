'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Heart, Star, Zap, Camera } from 'lucide-react';

interface VideoEffectsProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyEffect: (effect: string) => void;
}

const effects = [
  { id: 'none', name: 'Sin efecto', icon: Camera },
  { id: 'vintage', name: 'Vintage', icon: Star },
  { id: 'blackwhite', name: 'B&N', icon: Heart },
  { id: 'sepia', name: 'Sépia', icon: Star },
  { id: 'blur', name: 'Desenfoque', icon: Sparkles },
  { id: 'brightness', name: 'Brillo', icon: Zap },
  { id: 'contrast', name: 'Contraste', icon: Star },
  { id: 'saturate', name: 'Saturación', icon: Heart },
];

export default function VideoEffects({ isOpen, onClose, onApplyEffect }: VideoEffectsProps) {
  const [selectedEffect, setSelectedEffect] = useState('none');

  const handleApply = () => {
    onApplyEffect(selectedEffect);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
      <div className="w-full bg-gray-900 rounded-t-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Efectos</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {effects.map((effect) => {
            const Icon = effect.icon;
            return (
              <button
                key={effect.id}
                onClick={() => setSelectedEffect(effect.id)}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                  selectedEffect === effect.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-xs text-center">{effect.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Aplicar Efecto
        </button>
      </div>
    </div>
  );
}
