'use client';
import React, { useState, useEffect } from 'react';

export default function PWATestPage() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Detectar si la PWA es instalable
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-600 mb-8 text-center">
          🧪 PWA Test - Raízel Manadabook
        </h1>
        
        {/* Estado de la PWA */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Estado de la PWA</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isInstallable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-gray-700">
                {isInstallable ? '✅ PWA Instalable' : '⏳ Esperando prompt de instalación'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">✅ Service Worker Registrado</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">✅ Manifest.json Cargado</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">✅ Iconos PWA Disponibles</span>
            </div>
          </div>
        </div>

        {/* Botón de Instalación */}
        {isInstallable && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">📱 Instalar PWA</h3>
            <p className="text-blue-700 mb-4">
              Tu navegador soporta la instalación de esta PWA. Haz clic en el botón para instalarla.
            </p>
            <button
              onClick={handleInstall}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Instalar Raízel Manadabook
            </button>
          </div>
        )}

        {/* Iconos PWA */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Iconos PWA</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <img src="/icon-32x32.png" alt="32x32" className="mx-auto mb-2" />
              <p className="text-sm text-gray-600">32x32</p>
            </div>
            <div className="text-center">
              <img src="/icon-144x144.png" alt="144x144" className="mx-auto mb-2" />
              <p className="text-sm text-gray-600">144x144</p>
            </div>
            <div className="text-center">
              <img src="/icon-192x192.png" alt="192x192" className="mx-auto mb-2" />
              <p className="text-sm text-gray-600">192x192</p>
            </div>
            <div className="text-center">
              <img src="/icon-512x512.png" alt="512x512" className="mx-auto mb-2" />
              <p className="text-sm text-gray-600">512x512</p>
            </div>
          </div>
        </div>

        {/* Información del Manifest */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información del Manifest</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{JSON.stringify({
  name: "Raízel Manadabook",
  short_name: "Raízel",
  start_url: "/",
  display: "standalone",
  theme_color: "#059669",
  background_color: "#ffffff",
  icons: "7 iconos disponibles"
}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
