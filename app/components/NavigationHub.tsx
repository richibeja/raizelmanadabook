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
  IceCream,
  ChefHat,
  Shield,
  ShieldAlert,
  Syringe,
  Scale,
  Microscope,
  Clock,
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

function NavigationCard({
  icon,
  title,
  description,
  href,
  color,
  bgColor
}: NavigationCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="relative bg-white/70 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3 p-8 h-full border border-white/50 group-hover:border-white/80 overflow-hidden">
        {/* Decorative background element */}
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150"
          style={{ backgroundColor: color }}
        />

        {/* Icon container with premium border */}
        <div
          className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transform transition-transform duration-500 group-hover:rotate-12"
          style={{
            backgroundColor: `${color}15`,
            border: `1px solid ${color}30`
          }}
        >
          <div style={{ color }} className="text-3xl filter drop-shadow-sm">
            {icon}
          </div>
        </div>

        {/* Content with improved spacing and contrast */}
        <div className="relative space-y-4">
          <h3 className="text-2xl font-extrabold text-gray-900 leading-tight group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
            style={{ backgroundImage: `linear-gradient(to right, ${color}, ${color}dd)` }}>
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        </div>

        {/* Action area with glowing button effect */}
        <div className="mt-8 flex items-center justify-between">
          <span
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 transform group-hover:scale-105"
            style={{
              color: 'white',
              backgroundColor: color,
              boxShadow: `0 4px 14px 0 ${color}40`
            }}
          >
            Explorar Ahora
          </span>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 bg-gray-50 group-hover:bg-white group-hover:shadow-md"
          >
            <ArrowRight
              size={20}
              style={{ color }}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>

        {/* Hover overlay gradient */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${color}20, transparent)`
          }}
        />
      </div>
    </Link>
  );
};

function NavigationHub() {
  const navigationCards = [
    {
      icon: <Microscope size={24} />,
      title: "BioCheck AI",
      description: "Análisis de salud intestinal sin importar su dieta (Croquetas o Natural). Escanea y monitorea el microbioma de tu mascota al instante.",
      href: "/herramientas/biocheck-intestinal",
      color: "#06b6d4",
      bgColor: "#ecfeff"
    },
    {
      icon: <BookOpen size={24} />,
      title: "Guía de Transición",
      description: "El paso a paso definitivo para cambiar de croquetas a BARF de forma segura. Evita diarreas y optimiza la salud de tu mascota.",
      href: "/herramientas/guia-barf",
      color: "#f43f5e",
      bgColor: "#fff1f2"
    },
    {
      icon: <Heart size={24} />,
      title: "Rutina de Cuidado",
      description: "Asistente diario indispensable. Agenda de alimentación, hidratación, paseos y juegos para una mascota feliz y sin estrés.",
      href: "/herramientas/rutina-diaria",
      color: "#6366f1",
      bgColor: "#eef2ff"
    },
    {
      icon: <Calculator size={24} />,
      title: "Smart Diet Calc",
      description: "Optimiza su nutrición actual o descubre su ración natural exacta. Algoritmo avanzado para evitar el sobrepeso y ahorrar dinero.",
      href: "/calculadora",
      color: "#ef4444",
      bgColor: "#fef2f2"
    },
    {
      icon: <Syringe size={24} />,
      title: "Pasaporte de Salud",
      description: "Digitaliza el carnet de vacunas. Recibe alertas inteligentes y mantén el historial de protección siempre a la mano.",
      href: "/herramientas/calendario-vacunas",
      color: "#16a34a",
      bgColor: "#f0fdf4"
    },
    {
      icon: <Scale size={24} />,
      title: "Control de Peso",
      description: "Monitorea la evolución física de tu mejor amigo. Historial de pesaje y metas de bienestar para una vida larga y activa.",
      href: "/herramientas/control-peso",
      color: "#3b82f6",
      bgColor: "#eff6ff"
    },
    {
      icon: <ShieldAlert size={24} />,
      title: "Alimentos Tóxicos",
      description: "Buscador de emergencia. Descubre qué alimentos son un riesgo mortal para tu mascota en segundos.",
      href: "/herramientas/alimentos-toxicos",
      color: "#f97316",
      bgColor: "#fff7ed"
    },
    {
      icon: <ChefHat size={24} />,
      title: "Cocina Natural",
      description: "Centro gourmet exclusivo. Aprende a preparar platillos BARF y postres naturales con el sello de calidad Raízel.",
      href: "/cocina",
      color: "#f59e0b",
      bgColor: "#fffbeb"
    },
    {
      icon: <Dog size={24} />,
      title: "Productos Boutique",
      description: "Explora nuestra línea de alimentos premium, snacks funcionales y recetas gourmet 100% naturales.",
      href: "/catalogo-perros",
      color: "#10b981",
      bgColor: "#ecfdf5"
    },
    {
      icon: <Users size={24} />,
      title: "Comunidad VIP",
      description: "Únete a dueños responsables, resuelve dudas y accede a beneficios exclusivos en nuestra comunidad oficial.",
      href: "/comunidad",
      color: "#1877f2",
      bgColor: "#e7f3ff"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Soporte Experto",
      description: "¿Dudas sobre nutrición? Escríbenos directamente para asesoría personalizada por especialistas en bienestar animal.",
      href: "/contacto",
      color: "#8b5cf6",
      bgColor: "#faf5ff"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl shadow-2xl mb-6 sm:mb-8 animate-pulse">
            <span className="text-3xl sm:text-4xl">🐾</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-tight px-4">
            Bienvenido a{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
              Raízel
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-10 px-4 font-medium">
            Descubre una plataforma única que reúne todo lo que necesitas para el bienestar de tu mejor amigo. Con Raízel, no solo encuentras alimentos naturales premium, también accedes a una comunidad vibrante y a herramientas exclusivas que harán la vida con tu mascota más fácil y divertida.
          </p>
          {/* Puntos destacados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 sm:mb-10 max-w-6xl mx-auto">
            <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg border border-green-200">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-bold text-gray-900 mb-2">Alimentos naturales premium</h3>
              <p className="text-sm text-gray-600">BARF, albóndigas, chorizos, helados y snacks saludables</p>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg border border-blue-200">
              <div className="text-3xl mb-2">🐶</div>
              <h3 className="font-bold text-gray-900 mb-2">Cuidado inteligente</h3>
              <p className="text-sm text-gray-600">Calculadora de porciones, recordatorios de salud, consejos de embarazo</p>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg border border-purple-200">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-bold text-gray-900 mb-2">Comunidad en redes sociales</h3>
              <p className="text-sm text-gray-600">Facebook, Instagram, TikTok y grupos de amantes de mascotas</p>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg border border-orange-200">
              <div className="text-3xl mb-2">📖</div>
              <h3 className="font-bold text-gray-900 mb-2">Recetas y contenido gratis</h3>
              <p className="text-sm text-gray-600">Recetas caseras de helados, comidas y guías nutricionales</p>
            </div>
          </div>

          {/* Herramientas prácticas */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Herramientas prácticas</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Nutrición personalizada, guías por etapas de vida y seguimiento de tu mascota
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link href="/calculadora" className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 text-base sm:text-lg text-center transform hover:scale-105 animate-pulse">
              🧮 Calcular Porciones Ahora
            </Link>
            <a href="https://raizel4.mitiendanube.com" target="_blank" rel="noopener noreferrer" className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 text-base sm:text-lg text-center transform hover:scale-105">
              🛒 Ir a la Tienda Oficial
            </a>
            <Link href="/comunidad" className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 text-base sm:text-lg text-center transform hover:scale-105">
              👥 Comunidad
            </Link>
          </div>

          {/* Enlace a políticas */}
          <div className="text-center mt-6">
            <Link href="/politicas" className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm">
              <Shield className="w-4 h-4 mr-2" />
              Políticas de Uso y Privacidad
            </Link>
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
        <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl sm:rounded-4xl shadow-2xl p-8 sm:p-10 lg:p-14 border border-purple-100">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              ¿Por qué elegir Raízel? 🌟
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto px-4 font-medium">
              Descubre las ventajas increíbles que nos hacen únicos en el cuidado de mascotas.
              ¡Somos más que una marca, somos una familia! 💕
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            <div className="text-center group bg-white/60 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">100% Natural 🌿</h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">Sin conservantes ni químicos artificiales. Solo ingredientes puros y nutritivos para tu mascota.</p>
            </div>

            <div className="text-center group bg-white/60 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 rounded-3xl shadow-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Comunidad Activa 👥</h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">Conecta con miles de dueños de mascotas, comparte momentos y forma parte de nuestra gran familia.</p>
            </div>

            <div className="text-center group bg-white/60 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 rounded-3xl shadow-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Todas las Mascotas 🐾</h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">Perros, gatos, conejos, aves y muchas más especies. ¡Todos son bienvenidos en Raízel!</p>
            </div>

            <div className="text-center group bg-white/60 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 rounded-3xl shadow-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Soporte 24/7 📞</h3>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">Atención personalizada, asesoría nutricional y soporte técnico disponible las 24 horas del día.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NavigationCard };
export default NavigationHub;
