'use client';
import React from 'react';
import Link from 'next/link';
import { 
  Dog, 
  Cat, 
  Calculator, 
  Users, 
  MessageCircle,
  ArrowRight,
  Heart,
  Camera,
  Globe,
  Phone
} from 'lucide-react';

interface NavigationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ 
  icon, 
  title, 
  description, 
  href, 
  color, 
  bgColor 
}) => {
  return (
    <Link href={href} className="block">
      <div 
        className="group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl min-h-[200px] sm:min-h-[220px]"
        style={{ 
          backgroundColor: bgColor,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Icono - Responsive */}
        <div 
          className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }} className="scale-90 sm:scale-100">
            {icon}
          </div>
        </div>

        {/* Contenido - Responsive */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">{description}</p>
        </div>

        {/* Botón de acción - Responsive */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium" style={{ color }}>
            Ver más
          </span>
          <ArrowRight 
            size={14} 
            style={{ color }}
            className="sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" 
          />
        </div>

        {/* Efecto de hover */}
        <div 
          className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-10"
          style={{ backgroundColor: color }}
        />
      </div>
    </Link>
  );
};

export default function NavigationHub() {
  const navigationCards = [
    {
      icon: <Dog size={24} />,
      title: "Productos para Perros",
      description: "Alimentos naturales y funcionales para perros: BARF, Pellets, Chorizos, Albóndigas, Helados.",
      href: "/catalogo-perros",
      color: "#059669", // verde esmeralda
      bgColor: "#f0fdf4"
    },
    {
      icon: <Cat size={24} />,
      title: "Productos para Gatos",
      description: "Recetas BARF, pellets adaptados y bocaditos naturales para gatos.",
      href: "/catalogo-gatos",
      color: "#7c3aed", // violeta
      bgColor: "#faf5ff"
    },
    {
      icon: <Calculator size={24} />,
      title: "Calculadora de Porciones",
      description: "Descubre cuánto debe comer tu mascota según su peso y edad.",
      href: "/calculadora",
      color: "#dc2626", // rojo
      bgColor: "#fef2f2"
    },
    {
      icon: <Users size={24} />,
      title: "ManadaBook",
      description: "La red social para todas las mascotas, comparte momentos y conecta con la comunidad.",
      href: "/manadabook",
      color: "#0f6ff6", // azul
      bgColor: "#f0f9ff"
    },
    {
      icon: <Users size={24} />,
      title: "Nuestros Aliados",
      description: "Contacta directamente a los distribuidores autorizados de nuestros productos.",
      href: "/aliados",
      color: "#f59e0b", // ámbar
      bgColor: "#fffbeb"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Contacto",
      description: "Escríbenos a WhatsApp o correo para más información.",
      href: "/contacto",
      color: "#059669", // verde
      bgColor: "#f0fdf4"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Header - Optimizado para móviles */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-3 sm:mb-4 leading-tight">
          Bienvenido a <span className="text-green-600">Raízel</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
          El ecosistema completo para el bienestar de tu mascota. 
          Alimentos naturales y una comunidad que ama a los animales.
        </p>
      </div>

      {/* Grid de tarjetas - Responsive mejorado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {navigationCards.map((card, index) => (
          <NavigationCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            href={card.href}
            color={card.color}
            bgColor={card.bgColor}
          />
        ))}
      </div>

      {/* Sección de beneficios - Responsive optimizado */}
      <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8">
          ¿Por qué elegir Raízel?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Heart size={20} className="text-green-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-medium text-gray-800 text-sm sm:text-base">100% Natural</h3>
            <p className="text-xs sm:text-sm text-gray-600 text-center leading-tight">Sin conservantes ni químicos</p>
          </div>
          <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Camera size={20} className="text-blue-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-medium text-gray-800 text-sm sm:text-base">Comunidad</h3>
            <p className="text-xs sm:text-sm text-gray-600 text-center leading-tight">Conecta con otros dueños</p>
          </div>
          <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe size={20} className="text-purple-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-medium text-gray-800 text-sm sm:text-base">Todas las mascotas</h3>
            <p className="text-xs sm:text-sm text-gray-600 text-center leading-tight">Perros, gatos y más</p>
          </div>
          <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Phone size={20} className="text-red-600 sm:w-6 sm:h-6" />
            </div>
            <h3 className="font-medium text-gray-800 text-sm sm:text-base">Soporte</h3>
            <p className="text-xs sm:text-sm text-gray-600 text-center leading-tight">Atención personalizada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
