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
  BookOpen,
  Smartphone,
  Download,
  X,
  Share,
  QrCode,
  ShoppingBag,
  Star,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface NavigationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  bgColor: string;
  featured?: boolean;
  isExternal?: boolean;
}

function NavigationCard({
  icon,
  title,
  description,
  href,
  color,
  bgColor,
  featured,
  isExternal
}: NavigationCardProps) {
  const CardContent = (
    <div className={`relative bg-white/70 backdrop-blur-md rounded-[2.5rem] transition-all duration-500 hover:-translate-y-3 p-8 h-full border border-white/50 group-hover:border-white/80 overflow-hidden ${featured ? 'ring-4 ring-green-600/20 shadow-2xl scale-[1.02] bg-gradient-to-br from-white to-green-50/30' : 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]'}`}>
      {featured && (
        <div className="absolute top-6 right-8">
          <span className="bg-green-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
            Oficial
          </span>
        </div>
      )}
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
        <p className="text-gray-700 leading-relaxed font-semibold transition-opacity">
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
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`block group ${featured ? 'md:col-span-2 lg:col-span-3' : ''}`}>
        {CardContent}
      </a>
    );
  }

  return (
    <Link href={href} className={`block group ${featured ? 'md:col-span-2 lg:col-span-3' : ''}`}>
      {CardContent}
    </Link>
  );
}

function NavigationHub() {
  const [showInstallGuide, setShowInstallGuide] = React.useState(false);

  const RaizelLogo = ({ className = "text-5xl sm:text-7xl" }) => (
    <div className={`inline-flex items-center font-black tracking-tighter ${className} text-[#4a3728]`}>
      <span>Ra</span>
      <div className="relative w-[0.8em] h-[1.4em] mx-0.5 flex items-center justify-center translate-y-[0.1em]">
        <svg viewBox="0 0 24 32" className="w-full h-full text-green-700 overflow-visible" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Stem */}
          <path d="M12 26V10" />
          {/* Leaf Left */}
          <path d="M12 10C12 10 6 4 4 6C2 8 8 12 12 12" />
          {/* Leaf Right */}
          <path d="M12 10C12 10 18 4 20 6C22 8 16 12 12 12" />
          {/* Roots */}
          <path d="M12 26C12 26 10 28.5 7 28" strokeWidth="1.5" />
          <path d="M12 26C12 26 14 28.5 17 28" strokeWidth="1.5" />
          <path d="M12 26V31" strokeWidth="1.5" />
          <path d="M10 29L8 31" strokeWidth="1" opacity="0.6" />
          <path d="M14 29L16 31" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>
      <span>zel</span>
    </div>
  );

  const navigationCards = [
    {
      icon: <Dog size={32} />,
      title: "Artículos para tu Mascota",
      description: "Explora nuestra boutique oficial Raízel. Encuentra accesorios de alta calidad, juguetes educativos y tecnología curada para elevar la calidad de vida de tu mascota.",
      href: "https://raizel4.mitiendanube.com",
      color: "#16a34a",
      bgColor: "#f0fdf4",
      featured: true,
      isExternal: true
    },
    {
      icon: <Calculator size={24} />,
      title: "Smart Diet Calc",
      description: "Nutrición científica al alcance. Calcula la ración exacta, evita el sobrepeso y ahorra dinero con nuestro algoritmo avanzado.",
      href: "/calculadora",
      color: "#ef4444",
      bgColor: "#fef2f2"
    },
    {
      icon: <BookOpen size={24} />,
      title: "Guía de Transición",
      description: "El paso a paso definitivo para cambiar de croquetas a comida natural de forma segura y sin riesgos digestivos.",
      href: "/herramientas/guia-barf",
      color: "#f43f5e",
      bgColor: "#fff1f2"
    },
    {
      icon: <ChefHat size={24} />,
      title: "Cocina Natural",
      description: "Recetas exclusivas de BARF, snacks y postres naturales. Transforma la comida de tu mascota en una experiencia gourmet.",
      href: "/cocina",
      color: "#f59e0b",
      bgColor: "#fffbeb"
    },
    {
      icon: <Syringe size={24} />,
      title: "Pasaporte de Salud",
      description: "Digitaliza el carnet de tu mascota. Control de vacunas, desparasitación y recordatorios de salud en un solo lugar.",
      href: "/herramientas/calendario-vacunas",
      color: "#10b981",
      bgColor: "#ecfdf5"
    },
    {
      icon: <ShieldAlert size={24} />,
      title: "Alimentos Tóxicos",
      description: "Buscador de emergencia 24/7. Descubre al instante qué alimentos son un riesgo mortal para tu mejor amigo.",
      href: "/herramientas/alimentos-toxicos",
      color: "#ea580c",
      bgColor: "#fff7ed"
    },
    {
      icon: <Microscope size={24} />,
      title: "Análisis Nutricional",
      description: "Consulta la tabla nutricional detallada, ingredientes y beneficios de nuestra línea Vital BARF. Transparencia total para tu mascota.",
      href: "/nutricion",
      color: "#4a3728",
      bgColor: "#f3ede4"
    },
    {
      icon: <Users size={24} />,
      title: "Comunidad y Soporte",
      description: "Únete a nuestra manada VIP y recibe asesoría directa de expertos en nutrición y bienestar animal.",
      href: "/comunidad",
      color: "#1877f2",
      bgColor: "#e7f3ff"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl shadow-2xl mb-6 sm:mb-8 animate-pulse">
            <span className="text-3xl sm:text-4xl">🐾</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 sm:mb-8 leading-tight px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            Bienvenido a <RaizelLogo />
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-900 max-w-4xl mx-auto leading-relaxed mb-12 px-4 font-bold italic">
            &quot;Nutrición científica y herramientas premium para una vida natural y feliz.&quot;
          </p>

          {/* Enlace a políticas y Botón de Instalación */}
          <div className="flex flex-col items-center gap-6 mb-12">
            <button
              onClick={() => setShowInstallGuide(true)}
              className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-600 transition-all shadow-xl hover:scale-105 active:scale-95 group"
            >
              <Smartphone size={18} className="group-hover:animate-bounce" />
              Instalar Aplicación
            </button>
            <Link href="/politicas" className="inline-flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-bold">
              <Shield size={16} className="mr-2" />
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

        {/* ============================================================ */}
        {/* SECCIÓN: PRODUCTOS DESTACADOS DE LA TIENDA                   */}
        {/* ============================================================ */}
        <div className="mb-16 sm:mb-20">
          {/* Encabezado de sección */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-full mb-5">
              <Sparkles size={14} />
              Tienda Oficial Raízel
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Productos <span className="text-green-600">Destacados</span> 🛍️
            </h2>
            <p className="text-lg text-gray-600 font-semibold max-w-2xl mx-auto">
              Haz clic en cualquier producto para verlo en nuestra tienda oficial.
            </p>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {[
              {
                id: 'suplemento-2gotas',
                emoji: '💊',
                badge: '💰 $52K MARGEN',
                badgeColor: '#16a34a',
                name: '2 Gotas Suplemento Mascotas',
                desc: 'Suplemento natural en gotas para la salud y vitalidad de tu mascota. ¡902 unidades!',
                price: '$69.000',
                dropiId: '1980165',
                category: 'Bienestar',
                bg: 'from-green-50 to-emerald-100',
                accent: '#16a34a',
              },
              {
                id: 'morral-astronauta',
                emoji: '🚀',
                badge: '🔥 $50K MARGEN',
                badgeColor: '#dc2626',
                name: 'Morral Astronauta Mascotas',
                desc: 'Morral estilo astronauta con ventana panorámica. Viaja con tu mascota con clase.',
                price: '$100.000',
                dropiId: '1984115',
                category: 'Moda',
                bg: 'from-red-50 to-rose-100',
                accent: '#dc2626',
              },
              {
                id: 'combo-mascotas',
                emoji: '🎁',
                badge: '⭐ $45K MARGEN',
                badgeColor: '#7c3aed',
                name: 'Combo Premium Mascotas',
                desc: 'El combo más completo del mercado. Todo lo que tu mascota necesita en un solo paquete.',
                price: '$80.000',
                dropiId: '1987067',
                category: 'Mascotas',
                bg: 'from-purple-50 to-violet-100',
                accent: '#7c3aed',
              },
              {
                id: 'corral-mascotas',
                emoji: '🏠',
                badge: 'PLEGABLE',
                badgeColor: '#d97706',
                name: 'Corral Plegable Mascotas',
                desc: 'Espacio seguro y cómodo para tu mascota. Plegable, fácil de armar y transportar.',
                price: '$80.000',
                dropiId: '1988079',
                category: 'Mascotas',
                bg: 'from-amber-50 to-yellow-100',
                accent: '#d97706',
              },
              {
                id: 'guante-quita-pelo',
                emoji: '🧤',
                badge: 'MÁS VENDIDO',
                badgeColor: '#0891b2',
                name: 'Guante Quita Pelo Pro',
                desc: 'Remueve el pelo suelto en segundos. Funciona en telas, sofás y ropa. Multiusos.',
                price: '$55.000',
                dropiId: '1988137',
                category: 'Hogar',
                bg: 'from-cyan-50 to-sky-100',
                accent: '#0891b2',
              },
              {
                id: 'maquina-motilar',
                emoji: '✂️',
                badge: 'PROF',
                badgeColor: '#2563eb',
                name: 'Máquina Motilar Canina',
                desc: 'Corte profesional de salud canina en casa. Silenciosa, precisa y de larga duración.',
                price: '$100.000',
                dropiId: '1995551',
                category: 'Hogar',
                bg: 'from-blue-50 to-indigo-100',
                accent: '#2563eb',
              },
              {
                id: 'peine-vapor',
                emoji: '♨️',
                badge: 'A VAPOR',
                badgeColor: '#0284c7',
                name: 'Peine a Vapor Mascotas',
                desc: 'Vapor que desenmara, limpia y da brillo al manto de tu mascota al instante.',
                price: '$37.000',
                dropiId: '1994490',
                category: 'Mascotas',
                bg: 'from-sky-50 to-blue-100',
                accent: '#0284c7',
              },
              {
                id: 'pelota-inteligente',
                emoji: '🎾',
                badge: 'SMART',
                badgeColor: '#be185d',
                name: 'Pelota Inteligente Mascotas',
                desc: 'Se mueve sola con sensores. Entretiene a perros y gatos de forma autónoma.',
                price: '$25.000',
                dropiId: '1980663',
                category: 'Mascotas',
                bg: 'from-pink-50 to-rose-100',
                accent: '#be185d',
              },
            ]
              .map((product) => (
                <a
                  key={product.id}
                  href="https://raizel4.mitiendanube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white rounded-[2rem] overflow-hidden border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-400 flex flex-col"
                >
                  {/* Badge */}
                  <div
                    className="absolute top-3 left-3 z-10 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg"
                    style={{ backgroundColor: product.accent }}
                  >
                    {product.badge}
                  </div>

                  {/* Imagen / Emoji Area */}
                  <div className={`relative h-36 sm:h-44 bg-gradient-to-br ${product.bg} flex items-center justify-center overflow-hidden`}>
                    <div className="text-6xl sm:text-7xl transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500">
                      {product.emoji}
                    </div>
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle at center, ${product.accent}, transparent)` }}
                    />
                    {/* Cart icon on hover */}
                    <div className="absolute bottom-3 right-3 w-9 h-9 bg-white/0 group-hover:bg-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
                      <ShoppingBag size={16} style={{ color: product.accent }} />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest mb-1.5"
                      style={{ color: product.accent }}
                    >
                      {product.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-gray-900 leading-tight mb-1.5">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-3 line-clamp-2 flex-1">
                      {product.desc}
                    </p>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
                      ))}
                      <span className="text-[9px] text-gray-400 font-bold ml-1">5.0</span>
                    </div>

                    {/* Precio + CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-black text-gray-900">{product.price}</span>
                      <div
                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-white px-3 py-1.5 rounded-xl transition-all duration-300 group-hover:scale-105"
                        style={{ backgroundColor: product.accent }}
                      >
                        Comprar
                        <ExternalLink size={10} />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
          </div>

          {/* Botón Ver Tienda Completa */}
          <div className="text-center">
            <a
              href="https://raizel4.mitiendanube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] hover:bg-green-600 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 group"
            >
              <ShoppingBag size={20} className="group-hover:animate-bounce" />
              Ver Tienda Completa
              <ExternalLink size={16} />
            </a>
            <p className="text-xs text-gray-400 font-bold mt-4 uppercase tracking-widest">
              🔒 Compra segura · Envíos a toda Colombia
            </p>
          </div>
        </div>
        {/* FIN SECCIÓN PRODUCTOS */}


        {/* Sección de beneficios con cards modernas */}
        <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl sm:rounded-4xl shadow-2xl p-8 sm:p-10 lg:p-14 border border-purple-100 mb-16">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              ¿Por qué elegir Raízel? 🌟
            </h2>
            <p className="text-lg sm:text-xl text-gray-900 max-w-3xl mx-auto px-4 font-bold">
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
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed font-bold">Sin conservantes ni químicos artificiales. Solo ingredientes puros y nutritivos para tu mascota.</p>
            </div>

            <div className="text-center group bg-white/60 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 rounded-3xl shadow-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Camera size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Comunidad Activa 👥</h3>
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed font-bold">Conecta con miles de dueños de mascotas, comparte momentos y forma parte de nuestra gran familia.</p>
            </div>

            <div className="text-center group bg-white/60 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 rounded-3xl shadow-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Todas las Mascotas 🐾</h3>
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed font-bold">Perros, gatos, conejos, aves y muchas más especies. ¡Todos son bienvenidos en Raízel!</p>
            </div>

            <div className="text-center group bg-white/60 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 rounded-3xl shadow-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Soporte 24/7 📞</h3>
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed font-bold">Atención personalizada, asesoría nutricional y soporte técnico disponible las 24 horas del día.</p>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <footer className="text-center py-12 border-t border-white/20">
          <div className="inline-block">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-2">Original Concept By</p>
            <h4 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
              Richard Bejarano A
            </h4>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-cyan-600 mx-auto mt-4 rounded-full"></div>
            <p className="mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              &copy; {new Date().getFullYear()} Raízel Ecosistema. <br />
              Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>

      {/* Guía de Instalación Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all font-black"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <Smartphone className="text-blue-600" size={32} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Instalar Raízel</h2>
              <p className="text-gray-500 text-sm font-bold mt-2">Lleva a tu mascota siempre contigo en tu pantalla de inicio.</p>
            </div>

            <div className="space-y-6">
              {/* Opción Android */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">1</div>
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">En Android (Chrome)</h3>
                </div>
                <p className="text-sm text-gray-600 font-medium">Toca los <span className="font-black text-gray-900">3 puntos</span> arriba a la derecha y selecciona <span className="text-green-600 font-black italic">&quot;Instalar aplicación&quot;</span>.</p>
              </div>

              {/* Opción iPhone */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">2</div>
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">En iPhone (Safari)</h3>
                </div>
                <p className="text-sm text-gray-600 font-medium">Toca el botón <span className="font-black text-gray-900">Compartir</span> <Share size={14} className="inline mx-1" /> abajo y elige <span className="text-blue-600 font-black italic">&quot;Añadir a la pantalla de inicio&quot;</span>.</p>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-green-600 transition-all"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { NavigationCard };
export default NavigationHub;
