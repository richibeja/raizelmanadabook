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
  BookOpen,
  Video,
  Megaphone,
  IceCream,
  ChefHat
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

function NavigationHub() {
  const navigationCards = [
    {
      icon: <Dog size={24} />,
      title: "Productos para Perros",
      description: "Alimentos BARF premium con ingredientes naturales: coliflor, zanahoria, linaza, aceites esenciales, sal marina y calcio. Chorizos, albóndigas funcionales, bandejas de vísceras crudas y helados naturales. ¡Nutrición completa para tu mejor amigo!",
      href: "/catalogo-perros",
      color: "#10b981", // verde esmeralda vibrante
      bgColor: "#ecfdf5"
    },
    {
      icon: <Cat size={24} />,
      title: "Productos para Gatos",
      description: "Recetas BARF especializadas para gatos con cordero, hígado de res, vísceras mixtas y pellets adaptados. Bocaditos naturales, bandejas de vísceras crudas y nutrición felina completa. ¡Tu gato merece lo mejor!",
      href: "/catalogo-gatos",
      color: "#8b5cf6", // violeta vibrante
      bgColor: "#faf5ff"
    },
    {
      icon: <IceCream size={24} />,
      title: "Recetas de Helados",
      description: "6 recetas exclusivas de helados caseros para mascotas: helado de pollo, helado de hígado, helado de zanahoria, helado de manzana, helado de yogur y helado de atún. Ingredientes 100% naturales y nutritivos. ¡Refresca a tu mascota!",
      href: "/helados",
      color: "#06b6d4", // cian vibrante
      bgColor: "#f0f9ff"
    },
    {
      icon: <ChefHat size={24} />,
      title: "Recetas para Mascotas",
      description: "6 recetas completas con bandejas de vísceras crudas, cordero BARF, hígado de res, vísceras mixtas, helados de vísceras y cordero para gatos. Desde platos crudos hasta preparaciones cocidas. ¡Cocina como un chef para tu mascota!",
      href: "/recetas",
      color: "#f97316", // naranja vibrante
      bgColor: "#fff7ed"
    },
    {
      icon: <Calculator size={24} />,
      title: "Calculadora de Porciones",
      description: "Calculadora inteligente y precisa con edad en años y meses, validación de datos, cálculos detallados de nutrición, opciones de impresión y copia, resultados personalizados y recomendaciones específicas. ¡Calcula la porción perfecta!",
      href: "/calculadora",
      color: "#ef4444", // rojo vibrante
      bgColor: "#fef2f2"
    },
    {
      icon: <Users size={24} />,
      title: "ManadaBook",
      description: "La red social más completa para amantes de mascotas. Crea perfiles detallados de tus mascotas, comparte momentos únicos, conecta con otros dueños, únete a círculos temáticos, gestiona seguidores, sistema de moderación activa y mucho más. ¡Tu ecosistema social completo!",
      href: "/manadabook",
      color: "#3b82f6", // azul vibrante
      bgColor: "#eff6ff"
    },
    {
      icon: <Video size={24} />,
      title: "ManadaShorts",
      description: "Videos cortos estilo TikTok para mascotas con reproducción automática, scroll vertical, sistema de likes y comentarios, subida de videos, descubrimiento de contenido, navegación fluida y integración completa con la red social. ¡Viraliza a tu mascota!",
      href: "/manadashorts",
      color: "#ec4899", // rosa vibrante
      bgColor: "#fdf2f8"
    },
    {
      icon: <Megaphone size={24} />,
      title: "Dashboard de Publicidad",
      description: "Panel completo de administración publicitaria con métricas en tiempo real, creación y gestión de campañas, targeting avanzado por ubicación e intereses, control de presupuestos, analytics detallados y sistema de monetización. ¡Maximiza tu alcance!",
      href: "/ads-dashboard",
      color: "#a855f7", // violeta vibrante
      bgColor: "#f3f4f6"
    },
    {
      icon: <Users size={24} />,
      title: "Nuestros Aliados",
      description: "Sistema completo de gestión de aliados con CRUD funcional, filtros avanzados por región y servicios, contacto directo, control de estado activo/inactivo, búsqueda inteligente y red de colaboradores especializados. ¡Conecta con los mejores!",
      href: "/aliados",
      color: "#f59e0b", // ámbar vibrante
      bgColor: "#fffbeb"
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Contacto",
      description: "Escríbenos a WhatsApp o correo para más información, consultas sobre productos, asesoría nutricional, soporte técnico y atención personalizada 24/7. ¡Estamos aquí para ayudarte!",
      href: "/contacto",
      color: "#10b981", // verde vibrante
      bgColor: "#ecfdf5"
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
              <div className="text-3xl mb-2">🎥</div>
              <h3 className="font-bold text-gray-900 mb-2">Entretenimiento y comunidad</h3>
              <p className="text-sm text-gray-600">ManadaBook, ManadaShorts y círculos temáticos</p>
            </div>
            <div className="text-center p-4 bg-white/80 rounded-2xl shadow-lg border border-orange-200">
              <div className="text-3xl mb-2">🛒</div>
              <h3 className="font-bold text-gray-900 mb-2">Marketplace especializado</h3>
              <p className="text-sm text-gray-600">Productos de confianza con recetas y promociones exclusivas</p>
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
            <Link href="/catalogo-perros" className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 text-base sm:text-lg text-center transform hover:scale-105">
              🛍️ Explorar Productos
            </Link>
            <Link href="/manadabook" className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 text-base sm:text-lg text-center transform hover:scale-105">
              👥 Unirse a la Comunidad
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
