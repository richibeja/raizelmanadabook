'use client';

import React, { useState } from 'react';
import { X, Camera, Video, Heart, MessageCircle, Share2, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Video className="w-16 h-16 text-red-500" />,
      title: "¡Bienvenido a ManadaShorts!",
      description: "La red social de videos cortos para mascotas. Comparte los momentos más especiales de tu mejor amigo.",
      features: ["Videos de hasta 60 segundos", "Efectos y filtros especiales", "Comunidad de amantes de mascotas"]
    },
    {
      icon: <Camera className="w-16 h-16 text-blue-500" />,
      title: "Crea contenido increíble",
      description: "Graba videos directamente o sube desde tu galería. Usa efectos y música para hacer tu contenido único.",
      features: ["Grabación en tiempo real", "Efectos con IA", "Biblioteca de música"]
    },
    {
      icon: <Heart className="w-16 h-16 text-pink-500" />,
      title: "Conecta con la comunidad",
      description: "Interactúa con otros dueños de mascotas. Dale like, comenta y comparte los videos que más te gusten.",
      features: ["Sistema de likes y comentarios", "Compartir en redes sociales", "Seguir a tus favoritos"]
    },
    {
      icon: <MessageCircle className="w-16 h-16 text-green-500" />,
      title: "¡Todo listo!",
      description: "Ya puedes empezar a crear y compartir videos de tu mascota. ¡La comunidad te está esperando!",
      features: ["Perfil personalizado", "Estadísticas de tus videos", "Notificaciones en tiempo real"]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-700">
          <div 
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            {currentStepData.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            {currentStepData.title}
          </h2>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-8">
            {currentStepData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-left">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Omitir
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>
                {currentStep < steps.length - 1 ? 'Siguiente' : '¡Empezar!'}
              </span>
              {currentStep < steps.length - 1 && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-red-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}