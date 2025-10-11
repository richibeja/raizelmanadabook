'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Camera, Facebook, MessageCircle, Share2, Heart } from 'lucide-react';

export default function ComunidadPage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // URLs de Redes Sociales - RAÍZEL OFICIAL
  const FACEBOOK_PAGE = 'https://www.facebook.com/profile.php?id=61577967586361';
  const FACEBOOK_GROUP = 'https://www.facebook.com/share/g/1CSVg7WncY/';
  const INSTAGRAM_URL = 'https://www.instagram.com/somosraizel?igsh=MnduazUycGhneng%3D';
  const TIKTOK_URL = 'https://www.tiktok.com/@raizeloficial?_t=ZS-90SvcHz0z5j&_r=1';
  const WHATSAPP_NUMBER = '573124505966';

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Abre la cámara en móviles
    
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  const handleSharePhoto = () => {
    if (photoPreview) {
      alert('¡Ahora puedes ir al grupo de Facebook y compartir tu foto!');
      window.open(FACEBOOK_GROUP, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Volver a Raízel
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🐾 Comunidad Raízel
          </h1>
          <p className="text-lg text-gray-600">
            Únete a nuestra comunidad en Facebook y comparte momentos increíbles con tu mascota
          </p>
        </div>

        {/* Redes Sociales - Cards Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Página de Facebook */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-3 mx-auto">
              <Facebook size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Página Facebook
            </h3>
            <p className="text-gray-600 mb-4 text-center text-sm">
              Consejos y novedades diarias
            </p>
            <a
              href={FACEBOOK_PAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center text-sm"
            >
              Seguir
            </a>
          </div>

          {/* Grupo de Facebook */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-purple-400">
            <div className="flex items-center justify-center w-14 h-14 bg-purple-600 rounded-full mb-3 mx-auto">
              <Users size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Grupo Exclusivo
            </h3>
            <p className="text-gray-600 mb-4 text-center text-sm">
              Comunidad de dueños de mascotas
            </p>
            <a
              href={FACEBOOK_GROUP}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-center text-sm"
            >
              Unirme
            </a>
          </div>

          {/* Instagram */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-full mb-3 mx-auto">
              <Camera size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Instagram
            </h3>
            <p className="text-gray-600 mb-4 text-center text-sm">
              @somosraizel - Fotos adorables
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold text-center text-sm"
            >
              Seguir
            </a>
          </div>

          {/* TikTok */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-14 h-14 bg-black rounded-full mb-3 mx-auto">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              TikTok
            </h3>
            <p className="text-gray-600 mb-4 text-center text-sm">
              @raizeloficial - Videos divertidos
            </p>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold text-center text-sm"
            >
              Seguir
            </a>
          </div>
        </div>

        {/* Captura de Fotos */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <div className="text-center mb-6">
            <Camera size={48} className="mx-auto text-green-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              Captura Momentos Especiales
            </h2>
            <p className="text-gray-600">
              Toma una foto de tu mascota y compártela en nuestro grupo de Facebook
            </p>
          </div>

          {!photoPreview ? (
            <div className="space-y-4">
              <button
                onClick={handleTakePhoto}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
              >
                <Camera size={24} className="mr-2" />
                Tomar Foto
              </button>
              <p className="text-sm text-gray-500 text-center">
                📸 En móviles, se abrirá tu cámara directamente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview de la foto */}
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-contain bg-gray-100"
                />
              </div>
              
              {/* Acciones */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPhotoPreview(null)}
                  className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Tomar Otra
                </button>
                <button
                  onClick={handleSharePhoto}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                >
                  <Share2 size={20} className="mr-2" />
                  Compartir en Grupo
                </button>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                💡 Tu foto se abrirá en Facebook. Súbela manualmente al grupo
              </p>
            </div>
          )}
        </div>

        {/* WhatsApp Contact */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 shadow-lg text-white mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-semibold mb-2">¿Necesitas ayuda?</h3>
              <p className="text-green-100">
                Contáctanos directamente por WhatsApp para pedidos y consultas
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 py-3 px-8 rounded-lg hover:bg-green-50 transition-colors font-semibold flex items-center"
            >
              <MessageCircle size={20} className="mr-2" />
              Abrir WhatsApp
            </a>
          </div>
        </div>

        {/* Beneficios de la Comunidad */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            ¿Por qué unirte a nuestra comunidad?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart size={24} className="text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Comparte Experiencias</h4>
              <p className="text-sm text-gray-600">
                Conecta con otros dueños de mascotas y comparte historias
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users size={24} className="text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Consejos Expertos</h4>
              <p className="text-sm text-gray-600">
                Recibe recomendaciones sobre nutrición y cuidado de mascotas
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 size={24} className="text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Promociones Exclusivas</h4>
              <p className="text-sm text-gray-600">
                Accede a descuentos especiales para miembros del grupo
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
          <h2 className="text-2xl font-semibold mb-4">
            ¡Únete hoy a la familia Raízel! 🐾
          </h2>
          <p className="text-blue-100 mb-6">
            Miles de dueños de mascotas ya forman parte de nuestra comunidad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={FACEBOOK_GROUP}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              Unirme al Grupo
            </a>
            <Link
              href="/catalogo-perros"
              className="bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-900 transition-colors font-semibold"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

