'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Phone, MessageCircle, Share2 } from 'lucide-react';

interface Mascota {
  id: string;
  nombre: string;
  raza: string;
  edad: number;
  ubicacion: string;
  imagen: string;
  descripcion: string;
  vacunado: boolean;
  esterilizado: boolean;
  disponible: boolean;
  fechaPublicacion: string;
}

interface CardMascotaProps {
  mascota: Mascota;
  className?: string;
  showActions?: boolean;
}

export default function CardMascota({ mascota, className = '', showActions = true }: CardMascotaProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Implementar lógica de compartir
    if (navigator.share) {
      navigator.share({
        title: `${mascota.nombre} - ${mascota.raza}`,
        text: `Mira a ${mascota.nombre}, un adorable ${mascota.raza} disponible para adopción en RaízSocial`,
        url: `/adoptions/${mascota.id}`,
      });
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(`${window.location.origin}/adoptions/${mascota.id}`);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={mascota.imagen}
          alt={`${mascota.nombre} - ${mascota.raza}`}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsImageLoaded(true)}
          onError={(e) => {
            // Fallback image
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGOUZBIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzEwMCAxMzQuMzE0IDExMi44MTQgMTIxIDEyOCAxMjFIMjcyQzI4Ny4xODYgMTIxIDMwMCAxMzQuMzE0IDMwMCAxNTBWMjUwQzMwMCAyNjUuNjg2IDI4Ny4xODYgMjc5IDI3MiAyNzlIMTI4QzExMi44MTQgMjc5IDEwMCAyNjUuNjg2IDEwMCAyNTBWMTUwWiIgZmlsbD0iI0U2RUVGNyIvPgo8Y2lyY2xlIGN4PSIxNTAgY3k9IjE3MCIgcj0iMTUiIGZpbGw9IiM2QjcyODAiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTcwIiByPSIxNSIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNMTYwIDIyMEMxNjAgMjA5Ljk1IDE2Ny45NSAyMTggMTc4IDIxOEgyMjJDMjMyLjA1IDIxOCAyNDAgMjA5Ljk1IDI0MCAyMjBWMjUwQzI0MCAyNjAuMDUgMjMyLjA1IDI2OCAyMjIgMjY4SDE3OEMxNjcuOTUgMjY4IDE2MCAyNjAuMDUgMTYwIDI1MFYyMjBaIiBmaWxsPSIjNkI3MjgwIi8+Cjxzdmcgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgODAgODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cjx0ZXh0IHg9IjQwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5GAPC90ZXh0Pgo8L3N2Zz4KPC9zdmc+';
          }}
        />
        
        {/* Loading skeleton */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse"></div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            mascota.disponible 
              ? 'bg-success-100 text-success-700' 
              : 'bg-neutral-100 text-neutral-700'
          }`}>
            {mascota.disponible ? 'Disponible' : 'Adoptado'}
          </span>
        </div>

        {/* Like button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isLiked 
              ? 'bg-secondary-500 text-white shadow-lg' 
              : 'bg-white/80 text-neutral-600 hover:bg-white hover:text-secondary-500'
          }`}
          aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="absolute top-3 right-12 p-2 rounded-full bg-white/80 text-neutral-600 hover:bg-white hover:text-primary-500 transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Compartir"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
              {mascota.nombre}
            </h3>
            <p className="text-sm text-neutral-600">
              {mascota.raza} • {mascota.edad} {mascota.edad === 1 ? 'año' : 'años'}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-neutral-600 mb-3">
          <MapPin size={16} className="mr-1" />
          <span>{mascota.ubicacion}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-700 mb-4 line-clamp-2">
          {mascota.descripcion}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mascota.vacunado && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
              Vacunado
            </span>
          )}
          {mascota.esterilizado && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
              Esterilizado
            </span>
          )}
        </div>

        {/* Date */}
        <div className="flex items-center text-xs text-neutral-500 mb-4">
          <Calendar size={14} className="mr-1" />
          <span>Publicado {mascota.fechaPublicacion}</span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Link
              href={`/adoptions/${mascota.id}`}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
            >
              Ver detalles
            </Link>
            
            <button
              className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              aria-label="Contactar"
              title="Contactar"
            >
              <MessageCircle size={18} />
            </button>
            
            <button
              className="p-2 text-neutral-600 hover:text-primary-500 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
              aria-label="Llamar"
              title="Llamar"
            >
              <Phone size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente de ejemplo para mostrar múltiples mascotas
export function MascotasGrid({ mascotas, className = '' }: { mascotas: Mascota[], className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {mascotas.map((mascota) => (
        <CardMascota key={mascota.id} mascota={mascota} />
      ))}
    </div>
  );
}

// Datos de ejemplo
export const mascotasEjemplo: Mascota[] = [
  {
    id: '1',
    nombre: 'Luna',
    raza: 'Golden Retriever',
    edad: 2,
    ubicacion: 'Madrid, España',
    imagen: '/images/mascotas/luna.jpg',
    descripcion: 'Luna es una perrita muy cariñosa y juguetona. Le encanta pasear y jugar con otros perros.',
    vacunado: true,
    esterilizado: true,
    disponible: true,
    fechaPublicacion: 'hace 2 días'
  },
  {
    id: '2',
    nombre: 'Max',
    raza: 'Border Collie',
    edad: 1,
    ubicacion: 'Barcelona, España',
    imagen: '/images/mascotas/max.jpg',
    descripcion: 'Max es muy inteligente y activo. Perfecto para familias que disfruten del ejercicio.',
    vacunado: true,
    esterilizado: false,
    disponible: true,
    fechaPublicacion: 'hace 1 semana'
  },
  {
    id: '3',
    nombre: 'Mia',
    raza: 'Gato Persa',
    edad: 3,
    ubicacion: 'Valencia, España',
    imagen: '/images/mascotas/mia.jpg',
    descripcion: 'Mia es una gatita tranquila y elegante. Ideal para hogares tranquilos.',
    vacunado: true,
    esterilizado: true,
    disponible: true,
    fechaPublicacion: 'hace 3 días'
  }
];
