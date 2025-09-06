'use client';

import React, { useState } from 'react';
import { X, Heart, Camera, User, ArrowRight } from 'lucide-react';
import PetProfileEditor from './PetProfileEditor';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const handleCreateProfile = () => {
    setShowProfileEditor(true);
  };

  const handleProfileCreated = () => {
    setShowProfileEditor(false);
    onComplete();
  };

  if (!isOpen) return null;

  if (showProfileEditor) {
    return (
      <PetProfileEditor
        isOpen={true}
        onClose={() => setShowProfileEditor(false)}
        onSave={handleProfileCreated}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">¡Bienvenido a ManadaShorts!</h2>
          <button
            onClick={onComplete}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Crea el perfil de tu mascota
                </h3>
                <p className="text-gray-400">
                  Comparte la personalidad única de tu mascota con la comunidad de ManadaShorts
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-left">
                  <Camera className="w-5 h-5 text-red-500" />
                  <span className="text-gray-300">Sube fotos increíbles</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <User className="w-5 h-5 text-red-500" />
                  <span className="text-gray-300">Personaliza su perfil</span>
                </div>
                <div className="flex items-center space-x-3 text-left">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-gray-300">Conecta con otros amantes de mascotas</span>
                </div>
              </div>
              <button
                onClick={handleCreateProfile}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Crear Perfil</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  ¡Comienza a crear contenido!
                </h3>
                <p className="text-gray-400">
                  Graba videos divertidos de tu mascota y compártelos con la comunidad
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <h4 className="text-white font-medium">Consejos para videos increíbles:</h4>
                <ul className="text-gray-300 text-sm space-y-1 text-left">
                  <li>• Usa buena iluminación</li>
                  <li>• Captura momentos espontáneos</li>
                  <li>• Añade música temática</li>
                  <li>• Usa hashtags relevantes</li>
                </ul>
              </div>
              <button
                onClick={onComplete}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                ¡Empezar a crear!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
