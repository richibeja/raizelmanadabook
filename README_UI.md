# RaízSocial - UI Design System

## 🎨 Sistema de Diseño Moderno

Este documento describe cómo probar y utilizar el nuevo sistema de diseño de RaízSocial, una interfaz moderna y premium para la plataforma social de mascotas.

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd raizel

# Instalar dependencias
npm install

# Instalar dependencias adicionales para el diseño
npm install lucide-react framer-motion @tailwindcss/forms @tailwindcss/typography
```

### Configuración de Tailwind CSS
```bash
# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Inicializar configuración
npx tailwindcss init -p
```

### Configurar `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0F6FF6',
          600: '#0C5CD9',
          700: '#0949BC',
          800: '#06369F',
          900: '#032382'
        },
        secondary: {
          50: '#FFF0ED',
          100: '#FFE1D9',
          200: '#FFC3B3',
          300: '#FFA58D',
          400: '#FF8767',
          500: '#FF7A59',
          600: '#E65E3F',
          700: '#CC4225',
          800: '#B3260B',
          900: '#990A00'
        },
        accent: {
          50: '#E6FFFC',
          100: '#CCFFF9',
          200: '#99FFF3',
          300: '#66FFED',
          400: '#33FFE7',
          500: '#00C2A8',
          600: '#009B87',
          700: '#007466',
          800: '#004D45',
          900: '#002624'
        },
        neutral: {
          50: '#FBFDFF',
          100: '#F5F8FA',
          200: '#E6EEF7',
          300: '#D1DDE8',
          400: '#A3B7C7',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#0B1220'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## 🎯 Componentes Disponibles

### 1. Header (`components/ui/Header.tsx`)
Header responsive con navegación, búsqueda y acciones principales.

**Características:**
- Navegación responsive
- Menú móvil desplegable
- Búsqueda integrada
- Notificaciones y perfil
- Logo con gradiente

**Uso:**
```tsx
import Header from '@/components/ui/Header';

export default function Layout() {
  return (
    <div>
      <Header />
      {/* Contenido */}
    </div>
  );
}
```

### 2. Hero (`components/ui/Hero.tsx`)
Sección hero con imagen, estadísticas y CTAs principales.

**Características:**
- Imagen hero con fallback
- Estadísticas animadas
- Botones CTA con gradientes
- Indicadores de confianza
- Diseño responsive

**Uso:**
```tsx
import Hero from '@/components/ui/Hero';

export default function HomePage() {
  return (
    <div>
      <Hero />
      {/* Resto del contenido */}
    </div>
  );
}
```

### 3. CardMascota (`components/ui/CardMascota.tsx`)
Card moderna para mostrar información de mascotas.

**Características:**
- Imagen con lazy loading
- Badges de estado
- Botones de acción
- Hover effects
- Responsive design

**Uso:**
```tsx
import CardMascota, { MascotasGrid, mascotasEjemplo } from '@/components/ui/CardMascota';

// Card individual
<CardMascota mascota={mascotaData} />

// Grid de mascotas
<MascotasGrid mascotas={mascotasEjemplo} />
```

## 🧪 Testing del Diseño

### 1. Página de Prueba
Crear una página de prueba para visualizar todos los componentes:

```tsx
// app/test-ui/page.tsx
'use client';

import Header from '@/components/ui/Header';
import Hero from '@/components/ui/Hero';
import { MascotasGrid, mascotasEjemplo } from '@/components/ui/CardMascota';

export default function TestUIPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
          Mascotas Disponibles
        </h2>
        <MascotasGrid mascotas={mascotasEjemplo} />
      </section>
    </div>
  );
}
```

### 2. Ejecutar el Proyecto
```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000/test-ui
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 0-639px (1 columna)
- **Tablet**: 640-1023px (1-2 columnas)
- **Desktop**: 1024-1439px (2-3 columnas)
- **Wide**: ≥1440px (3+ columnas)

### Testing Responsive
1. Abrir DevTools (F12)
2. Activar modo responsive
3. Probar en diferentes tamaños:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1024px+)

## 🎨 Paleta de Colores

### Colores Principales
- **Primario**: `#0F6FF6` (Azul Eléctrico)
- **Secundario**: `#FF7A59` (Coral Cálido)
- **Acento**: `#00C2A8` (Verde Menta)

### Estados
- **Éxito**: `#22C55E`
- **Advertencia**: `#F59E0B`
- **Error**: `#EF4444`

### Neutros
- **Fondo**: `#FBFDFF`
- **Texto Principal**: `#1F2937`
- **Texto Secundario**: `#6B7280`
- **Bordes**: `#E6EEF7`

## 🔧 Utilidades CSS

### Clases de Espaciado
```css
/* Sistema basado en 4px */
.p-1 { padding: 4px; }
.p-2 { padding: 8px; }
.p-4 { padding: 16px; }
.p-6 { padding: 24px; }
.p-8 { padding: 32px; }
```

### Clases de Sombras
```css
.shadow-soft { /* Sombra sutil */ }
.shadow-medium { /* Sombra media */ }
.shadow-large { /* Sombra grande */ }
```

### Clases de Border Radius
```css
.rounded-lg { border-radius: 8px; }
.rounded-xl { border-radius: 12px; }
.rounded-full { border-radius: 9999px; }
```

## 📊 Métricas de Performance

### Objetivos Lighthouse
- **Performance**: >90
- **Accessibility**: >90
- **Best Practices**: >90
- **SEO**: >90

### Core Web Vitals
- **LCP**: <2.5s
- **FID**: <100ms
- **CLS**: <0.1

### Testing Performance
```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Ejecutar auditoría
lighthouse http://localhost:3000/test-ui --output html --output-path ./lighthouse-report.html
```

## ♿ Accesibilidad

### Contraste
- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Elementos interactivos**: Mínimo 3:1

### Navegación por Teclado
- Todos los elementos son navegables con Tab
- Focus visible en todos los elementos interactivos
- Escape cierra modales y menús

### Testing Accesibilidad
```bash
# Instalar axe-core
npm install axe-core

# Ejecutar en consola del navegador
axe.run()
```

## 🎭 Animaciones

### Transiciones
- **Duración**: 0.2s para micro-interacciones
- **Easing**: `ease` para la mayoría de elementos
- **Cubic-bezier**: `cubic-bezier(0.4, 0, 0.2, 1)` para animaciones suaves

### Micro-interacciones
- Hover en cards: Lift + shadow
- Botón CTA: Gradient sutil animado
- Like: Burst animation
- Loading: Skeleton con shimmer

## 📝 Checklist de QA

### Visual
- [ ] Todos los componentes se ven correctamente en móvil
- [ ] No hay overflow horizontal
- [ ] Los colores tienen suficiente contraste
- [ ] Las imágenes se cargan correctamente
- [ ] Los fallbacks funcionan

### Funcional
- [ ] Navegación por teclado funciona
- [ ] Los botones son clickeables
- [ ] Los enlaces funcionan
- [ ] Los formularios son accesibles
- [ ] Las animaciones no son distractivas

### Performance
- [ ] Lighthouse Score >90
- [ ] LCP <2.5s
- [ ] CLS <0.1
- [ ] Imágenes optimizadas
- [ ] CSS crítico inline

### Accesibilidad
- [ ] 0 violaciones críticas en axe
- [ ] Contraste mínimo 4.5:1
- [ ] Focus visible
- [ ] Alt text en imágenes
- [ ] ARIA labels donde necesario

## 🚀 Próximos Pasos

1. **Implementar más componentes**
   - Modal
   - Drawer
   - Formularios
   - Tablas

2. **Optimizaciones**
   - Lazy loading de componentes
   - Code splitting
   - Bundle optimization

3. **Testing**
   - Unit tests para componentes
   - Integration tests
   - E2E tests

4. **Documentación**
   - Storybook
   - Component API docs
   - Design tokens

## 📞 Soporte

Para preguntas o problemas con el sistema de diseño:

1. Revisar la documentación en `design/`
2. Verificar los ejemplos en `components/ui/`
3. Probar en diferentes dispositivos
4. Ejecutar auditorías de performance y accesibilidad

---

**Nota**: Este sistema de diseño está en desarrollo activo. Las actualizaciones se documentarán en `design/CHANGELOG.md`.
