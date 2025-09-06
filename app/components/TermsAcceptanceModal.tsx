'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle, X, AlertTriangle } from 'lucide-react';

interface TermsAcceptanceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsAcceptanceModal({ isOpen, onAccept, onDecline }: TermsAcceptanceModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedCommunity, setAcceptedCommunity] = useState(false);

  const allAccepted = acceptedTerms && acceptedPrivacy && acceptedCommunity;

  const handleAccept = () => {
    if (allAccepted) {
      onAccept();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Bienvenido a Raízel</h2>
              <p className="text-blue-100">Para continuar, necesitamos tu aceptación de nuestras políticas</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Términos de Uso */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  acceptedTerms 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {acceptedTerms && <CheckCircle className="w-3 h-3" />}
              </button>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Términos de Uso</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Acepto los términos y condiciones de uso de la plataforma Raízel, incluyendo el uso de ManadaBook, 
                  ManadaShorts y todos los servicios relacionados.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Incluye:</strong> Uso aceptable, derechos de contenido, modificaciones de términos
                </div>
              </div>
            </div>
          </div>

          {/* Política de Privacidad */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => setAcceptedPrivacy(!acceptedPrivacy)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  acceptedPrivacy 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {acceptedPrivacy && <CheckCircle className="w-3 h-3" />}
              </button>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Política de Privacidad</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Acepto el procesamiento de mis datos personales y de mi mascota según la política de privacidad de Raízel.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Incluye:</strong> Recopilación de datos, uso de información, derechos del usuario
                </div>
              </div>
            </div>
          </div>

          {/* Normas de la Comunidad */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <button
                onClick={() => setAcceptedCommunity(!acceptedCommunity)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  acceptedCommunity 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                {acceptedCommunity && <CheckCircle className="w-3 h-3" />}
              </button>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Normas de la Comunidad</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Me comprometo a seguir las normas de la comunidad, tratando a todos con respeto y compartiendo 
                  contenido apropiado relacionado con mascotas.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Incluye:</strong> Respeto mutuo, contenido apropiado, moderación de la comunidad
                </div>
              </div>
            </div>
          </div>

          {/* Información importante */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Información importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Todas las funcionalidades son reales y funcionan completamente</li>
                  <li>• Tu información está protegida y no se comparte con terceros</li>
                  <li>• Puedes modificar o eliminar tu cuenta en cualquier momento</li>
                  <li>• El contenido debe ser apropiado y relacionado con mascotas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onDecline}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X className="w-4 h-4 mr-2 inline" />
              No acepto
            </button>
            <button
              onClick={handleAccept}
              disabled={!allAccepted}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                allAccepted
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Acepto todas las políticas
            </button>
          </div>

          {/* Enlaces a políticas completas */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Puedes leer las políticas completas en{' '}
              <a href="/politicas" className="text-blue-600 hover:text-blue-800 underline">
                /politicas
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
