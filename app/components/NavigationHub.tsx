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
        className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        style={{ 
          backgroundColor: bgColor,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Icono */}
        <div 
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>
            {icon}
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        {/* Botón de acción */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color }}>
            Ver más
          </span>
          <ArrowRight 
            size={16} 
            style={{ color }}
            className="transition-transform group-hover:translate-x-1" 
          />
        </div>

        {/* Efecto de hover */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-10"
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Bienvenido a <span className="text-green-600">Raízel</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          El ecosistema completo para el bienestar de tu mascota. 
          Alimentos naturales y una comunidad que ama a los animales.
        </p>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Sección de beneficios */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          ¿Por qué elegir Raízel?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Heart size={24} className="text-green-600" />
            </div>
            <h3 className="font-medium text-gray-800">100% Natural</h3>
            <p className="text-sm text-gray-600 text-center">Sin conservantes ni químicos</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Camera size={24} className="text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-800">Comunidad</h3>
            <p className="text-sm text-gray-600 text-center">Conecta con otros dueños</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Globe size={24} className="text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-800">Todas las mascotas</h3>
            <p className="text-sm text-gray-600 text-center">Perros, gatos y más</p>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Phone size={24} className="text-red-600" />
            </div>
            <h3 className="font-medium text-gray-800">Soporte</h3>
            <p className="text-sm text-gray-600 text-center">Atención personalizada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
