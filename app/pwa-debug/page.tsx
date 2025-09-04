'use client';
import React, { useState, useEffect } from 'react';

export default function PWADebugPage() {
  const [iconStatus, setIconStatus] = useState<Record<string, string>>({});
  const [manifestStatus, setManifestStatus] = useState<string>('checking');

  useEffect(() => {
    // Verificar estado de iconos
    const checkIcons = async () => {
      const icons = [
        { name: 'icon-32x32.png', size: '32x32' },
        { name: 'icon-144x144.png', size: '144x144' },
        { name: 'icon-192x192.png', size: '192x192' },
        { name: 'icon-512x512.png', size: '512x512' }
      ];

      const status: Record<string, string> = {};

      for (const icon of icons) {
        try {
          const response = await fetch(`/${icon.name}`, { method: 'HEAD' });
          if (response.ok) {
            status[icon.name] = `✅ OK (${response.headers.get('content-length')} bytes)`;
          } else {
            status[icon.name] = `❌ Error ${response.status}`;
          }
        } catch (error) {
          status[icon.name] = `❌ Error de red`;
        }
      }

      setIconStatus(status);
    };

    // Verificar manifest
    const checkManifest = async () => {
      try {
        const response = await fetch('/manifest.json');
        if (response.ok) {
          const manifest = await response.json();
          setManifestStatus(`✅ OK (${manifest.icons?.length || 0} iconos)`);
        } else {
          setManifestStatus(`❌ Error ${response.status}`);
        }
      } catch (error) {
        setManifestStatus('❌ Error de red');
      }
    };

    checkIcons();
    checkManifest();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
          🔧 PWA Debug - Diagnóstico de Problemas
        </h1>
        
        {/* Estado de Iconos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Estado de Iconos PWA</h2>
          <div className="space-y-2">
            {Object.entries(iconStatus).map(([icon, status]) => (
              <div key={icon} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono text-sm">{icon}</span>
                <span className="text-sm">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estado del Manifest */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Estado del Manifest</h2>
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-lg">{manifestStatus}</p>
          </div>
        </div>

        {/* Información del Navegador */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Información del Navegador</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>PWA Support:</strong> {('serviceWorker' in navigator) ? '✅ Sí' : '❌ No'}</p>
            <p><strong>Install Prompt:</strong> {('beforeinstallprompt' in window) ? '✅ Disponible' : '❌ No disponible'}</p>
          </div>
        </div>

        {/* Instrucciones de Solución */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">🛠️ Instrucciones de Solución</h3>
          <ul className="text-yellow-700 space-y-1 text-sm">
            <li>• Si algún icono muestra error, verifica que el archivo esté en /public/</li>
            <li>• Limpia la caché del navegador (Ctrl+Shift+R)</li>
            <li>• Verifica que el manifest.json tenga las rutas correctas</li>
            <li>• Los iconos deben ser archivos PNG válidos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
