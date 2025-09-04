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
  Phone,
  BookOpen
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
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6 h-full border border-gray-100">
        {/* Icono con fondo moderno */}
        <div 
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md"
          style={{ 
            backgroundColor: `${color}15`,
            border: `2px solid ${color}30`
          }}
        >
          <div style={{ color }} className="text-2xl">
            {icon}
          </div>
        </div>

        {/* Contenido con tipografía mejorada */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Botón de acción moderno */}
        <div className="mt-6 flex items-center justify-between">
          <span 
            className="text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200"
            style={{ 
              color: color,
              backgroundColor: `${color}10`
            }}
          >
            Explorar
          </span>
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 group-hover:scale-110"
            style={{ backgroundColor: `${color}20` }}
          >
            <ArrowRight 
              size={16} 
              style={{ color }}
              className="transition-transform group-hover:translate-x-0.5" 
            />
          </div>
        </div>

        {/* Gradiente sutil en hover */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
          style={{ 
            background: `linear-gradient(135deg, ${color}20, ${color}10)`
          }}
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
    },
    {
      icon: <BookOpen size={24} />,
      title: "Raizelmanada Book",
      description: "Una experiencia literaria única que combina tradición y modernidad en cada página.",
      href: "/raizelmanada-book",
      color: "#3a6ea5", // azul literario
      bgColor: "#f0f9ff"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl shadow-lg mb-4 sm:mb-6">
            <span className="text-2xl sm:text-3xl">🐾</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
            Bienvenido a{' '}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Raízel
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            El ecosistema completo para el bienestar de tu mascota. 
            Alimentos naturales y una comunidad que ama a los animales.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base">
              Explorar Productos
            </button>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 text-sm sm:text-base">
              Unirse a la Comunidad
            </button>
          </div>
        </div>

        {/* Grid de tarjetas con diseño moderno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
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

        {/* Sección de beneficios con cards modernas */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              ¿Por qué elegir Raízel?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Descubre las ventajas que nos hacen únicos en el cuidado de mascotas
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">100% Natural</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Sin conservantes ni químicos artificiales</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Camera size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Comunidad</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Conecta con otros dueños de mascotas</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl shadow-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Todas las mascotas</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Perros, gatos y muchas más especies</p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Phone size={20} className="sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Soporte</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Atención personalizada 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
