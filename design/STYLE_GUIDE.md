# Guía de Estilo - RaízSocial

## Visión General

RaízSocial es una plataforma social para mascotas que combina una estética moderna, cálida y orgánica. El diseño prioriza la experiencia móvil, la accesibilidad y el rendimiento.

## Paleta de Colores

### Colores Principales
- **Primario (Azul Eléctrico)**: `#0F6FF6` - Para CTAs principales, enlaces y elementos de acción
- **Secundario (Coral Cálido)**: `#FF7A59` - Para elementos de destaque y alertas
- **Acento (Verde Menta)**: `#00C2A8` - Para elementos de éxito y confirmación

### Fondos
- **Fondo Claro**: `#FBFDFF` - Fondo principal de la aplicación
- **Fondo Oscuro**: `#0B1220` - Para banners y secciones destacadas
- **Neutros**: `#1F2937` (texto principal), `#6B7280` (texto secundario), `#E6EEF7` (bordes sutiles)

### Estados
- **Éxito**: `#22C55E`
- **Advertencia**: `#F59E0B`
- **Error**: `#EF4444`

## Tipografía

### Familia de Fuentes
- **Principal**: Inter (Google Fonts)
- **Fallback**: system-ui, sans-serif

### Tamaños y Pesos
- **H1**: 48-56px, Bold (700)
- **H2**: 32-40px, Semibold (600)
- **H3**: 24-28px, Semibold (600)
- **Body**: 16px, Normal (400)
- **Small**: 14px, Normal (400)

### Line Heights
- **Títulos**: 1.25 (tight)
- **Cuerpo**: 1.5 (normal)
- **Párrafos largos**: 1.75 (relaxed)

## Espaciado

Sistema escalonado basado en 4px:
- **4px**: Espaciado mínimo
- **8px**: Espaciado pequeño
- **16px**: Espaciado base
- **24px**: Espaciado medio
- **32px**: Espaciado grande
- **48px**: Espaciado extra grande
- **64px**: Espaciado hero

## Border Radius

- **Cards y Contenedores**: 12px
- **Botones**: 8px (base), 9999px (pill)
- **Inputs**: 8px
- **Avatars**: 9999px (circular)

## Sombras

- **Sutil**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Base**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **Media**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Grande**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

## Breakpoints

- **Mobile**: 0-639px (1 columna)
- **Tablet**: 640-1023px (1-2 columnas)
- **Desktop**: 1024-1439px (2-3 columnas)
- **Wide**: ≥1440px (3+ columnas)

## Componentes

### Botones

#### Botón Primario
```css
background: linear-gradient(135deg, #0F6FF6 0%, #3385FF 100%);
color: white;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
transition: all 0.2s ease;
```

#### Botón Secundario
```css
background: transparent;
color: #0F6FF6;
border: 2px solid #0F6FF6;
padding: 10px 22px;
border-radius: 8px;
font-weight: 600;
transition: all 0.2s ease;
```

### Cards

#### Card de Mascota
```css
background: white;
border-radius: 12px;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
padding: 16px;
transition: transform 0.2s ease, box-shadow 0.2s ease;
```

#### Card de Feed
```css
background: white;
border-radius: 12px;
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
padding: 20px;
margin-bottom: 16px;
```

### Inputs

```css
border: 2px solid #E6EEF7;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;
transition: border-color 0.2s ease;
```

## Animaciones

### Transiciones
- **Duración**: 0.2s para micro-interacciones, 0.3s para transiciones de página
- **Easing**: `ease` para la mayoría de elementos
- **Cubic-bezier**: `cubic-bezier(0.4, 0, 0.2, 1)` para animaciones suaves

### Micro-interacciones
- **Hover en cards**: Lift + shadow
- **Botón CTA**: Gradient sutil animado
- **Like**: Burst animation
- **Loading**: Skeleton con shimmer

## Accesibilidad

### Contraste
- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Elementos interactivos**: Mínimo 3:1

### Focus
- **Outline**: 2px solid #0F6FF6
- **Offset**: 2px del elemento
- **Visible**: Siempre presente en navegación por teclado

### Touch Targets
- **Mínimo**: 44px × 44px
- **Recomendado**: 48px × 48px

## Imágenes

### Formatos
- **WebP/AVIF**: Para navegadores modernos
- **JPEG/PNG**: Fallback para navegadores antiguos

### Tamaños
- **Thumbnail**: 400px
- **Medium**: 800px
- **Large**: 1600px
- **Hero**: 1920px

### Optimización
- **Lazy loading**: Para imágenes abajo del fold
- **Responsive**: srcset con múltiples tamaños
- **Compresión**: Máximo 2MB por imagen

## Performance

### Objetivos Lighthouse
- **Performance**: >90
- **Accessibility**: >90
- **Best Practices**: >90
- **SEO**: >90

### Métricas Core Web Vitals
- **LCP**: <2.5s
- **FID**: <100ms
- **CLS**: <0.1

## Iconografía

### Librería
- **Lucide React**: Iconos principales
- **Heroicons**: Alternativa para iconos específicos

### Tamaños
- **Small**: 16px
- **Medium**: 20px
- **Large**: 24px
- **Extra Large**: 32px

### Estilo
- **Stroke width**: 2px
- **Color**: Hereda del texto padre
- **Consistencia**: Mismo estilo en toda la aplicación
