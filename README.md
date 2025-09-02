# 🐾 Raízel - Ecosistema Completo para Mascotas

## 🏆 **MILESTONES COMPLETADOS**

### ✅ **Milestone 1: Definición Técnica y Funcional del Ecosistema Digital Raízel** *(Septiembre 2024)*
- 🍖 **Productos definidos**: Vital BARF (Pollo y Res) + Vital Pellets Naturales
- 📱 **App Android**: 85% completada con catálogo, calculadora, pedidos WhatsApp
- 🎨 **Identidad de marca**: 100% natural, hecho en Colombia, sin químicos
- 📞 **Canales establecidos**: WhatsApp +57 310 818 8723, redes sociales activas
- 📍 **Ubicación**: Subía, Cundinamarca, Colombia

### ✅ **Milestone 2: Migración Sistema de Anuncios a Firebase** *(Septiembre 2024)*
- 🔥 **Firebase integrado**: Firestore + Auth + Storage completamente funcional  
- ⚡ **Tiempo real**: onSnapshot para actualizaciones automáticas
- 🔐 **Autenticación**: Email/password + Google OAuth implementada
- 🛡️ **Seguridad**: Reglas granulares configuradas
- 📊 **Analytics**: Métricas en tiempo real (CTR, impresiones, conversiones)

## 📋 Descripción

Raízel es un ecosistema completo que combina **alimentos naturales para mascotas** con una **red social para dueños de mascotas** (ManadaBook). Ofrecemos productos BARF, pellets naturales y una comunidad donde compartir momentos con tu mascota.

### 🍖 **Productos Principales**
- **Vital BARF**: Alimentación cruda biológicamente apropiada (Pollo y Res)
- **Vital Pellets Naturales**: Pellets horneados sin químicos ni conservantes  
- **100% Natural**: Ingredientes frescos colombianos de alta calidad

## 🚀 Características Principales

### 🍖 **Raízel (Alimentos Naturales)**
- **Catálogo de productos** para perros y gatos
- **Calculadora de porciones** inteligente
- **Productos 100% naturales** sin conservantes
- **Sistema de aliados/distribuidores** autorizados

### 🐾 **ManadaBook (Red Social)**
- Perfiles de mascotas
- Feed de momentos y fotos
- Comunidad de dueños de mascotas
- Sistema de grupos y círculos

## 🏗️ Estructura del Proyecto

```
raizel/
├── app/
│   ├── api/                    # APIs del backend
│   │   ├── affiliates/         # Sistema de aliados
│   │   ├── pets/              # Gestión de mascotas
│   │   └── ...
│   ├── components/             # Componentes React
│   │   ├── NavigationHub.tsx  # Hub principal
│   │   ├── TarjetaAliado.tsx  # Tarjeta de aliado
│   │   └── ...
│   ├── aliados/               # Página de aliados
│   ├── catalogo-perros/       # Catálogo perros
│   ├── catalogo-gatos/        # Catálogo gatos
│   ├── calculadora/           # Calculadora porciones
│   ├── manadabook/            # Red social
│   ├── contacto/              # Página de contacto
│   └── page.tsx               # Página principal
├── migrations/                 # Migraciones SQL
│   ├── 001_initial_schema.sql # Esquema inicial
│   └── 002_affiliates.sql     # Tabla de aliados
└── README.md                   # Este archivo
```

## 🗄️ Base de Datos

### Tabla `affiliates` (Aliados)

```sql
CREATE TABLE affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_type VARCHAR(50) NOT NULL CHECK (contact_type IN ('WhatsApp', 'Email', 'Teléfono', 'Web')),
    contact_value VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

## 🔥 Firebase Integration

El proyecto utiliza **Firebase** para almacenamiento en tiempo real y autenticación.

### Servicios Firebase utilizados:
- **Firestore** - Base de datos NoSQL en tiempo real
- **Authentication** - Autenticación de usuarios
- **Storage** - Almacenamiento de archivos multimedia

### Configuración Firebase

#### 1. Configurar proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database**
4. Habilita **Authentication** (Email/Password y Google)
5. Configura **Storage** para archivos multimedia

#### 2. Obtener credenciales
En tu proyecto Firebase, ve a **Configuración del proyecto** → **Configuración general** → **Tus apps** y copia las credenciales.

#### 3. Configurar variables de entorno
Actualiza tu archivo `.env.local` con las credenciales de Firebase:

```bash
# Firebase Configuration (Cliente)
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aquí
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Configuration (Servidor)
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU-PRIVATE-KEY-AQUÍ\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
```

#### 4. Autenticación Firebase CLI
Para usar Firebase CLI (deploy, reglas, etc.):

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Autenticarse
firebase login

# Inicializar proyecto
firebase init firestore
```

#### 5. Estructura de datos Firestore

**Colección: `ads`**
```javascript
{
  ownerId: string,
  campaignName: string,
  adType: 'banner' | 'story' | 'feed',
  targetAudience: {
    species: string[],
    ageRange: string[],
    location: string[],
    interests: string[]
  },
  budget: number,
  bidType: 'CPM' | 'CPC',
  bidAmount: number,
  startDate: Timestamp,
  endDate: Timestamp,
  status: 'pending' | 'active' | 'paused' | 'completed' | 'rejected',
  approvalStatus: 'pending' | 'approved' | 'rejected',
  impressions: number,
  clicks: number,
  ctr: number,
  spend: number,
  creative: {
    title: string,
    description: string,
    imageUrl: string,
    ctaText: string,
    landingUrl: string
  },
  createdAt: Timestamp,
  updatedAt: Timestamp,
  ownerUsername: string,
  ownerVerified: boolean,
  rejectionReason?: string
}
```

**Colección: `users`**
```javascript
{
  id: string,
  username: string,
  email: string,
  displayName?: string,
  photoURL?: string,
  isVerified: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 6. Características en tiempo real
- **Actualizaciones automáticas**: Los datos se sincronizan automáticamente usando `onSnapshot`
- **Estado reactivo**: Los componentes se actualizan cuando cambian los datos
- **Offline support**: Funciona offline con sincronización automática

## 🔧 Instalación y Configuración

### 🛠️ **Desarrollo Local Completo (Recomendado)**

#### **Opción 1: Docker Compose (Más fácil)**
```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd raizel

# 2. Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus configuraciones Firebase

# 3. Iniciar todo el ecosistema
docker-compose up -d

# 4. Ver logs en tiempo real  
docker-compose logs -f

# 5. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001  
# MinIO: http://localhost:9001
# PostgreSQL: localhost:5432
```

#### **Servicios Incluidos en Docker:**
```
🐳 RAÍZEL ECOSYSTEM STACK:
├── 🗄️ PostgreSQL - Base de datos principal
├── ⚡ Redis - Cache y sesiones  
├── 📁 MinIO - Almacenamiento archivos (S3-compatible)
├── 🔥 Backend API - NestJS + Express
├── 📱 Frontend - Next.js (Raízel + ManadaBook)
└── 🎬 Worker - Procesamiento videos/imágenes
```

#### **Comandos útiles Docker:**
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f [servicio]

# Reiniciar un servicio  
docker-compose restart [servicio]

# Parar todo
docker-compose down

# Limpiar volúmenes (¡cuidado!)
docker-compose down -v
```

### 🛠️ **Desarrollo Local Manual**

#### **Prerrequisitos**
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm o yarn

#### **Pasos instalación manual**

1. **Clonar e instalar**
```bash
git clone <url-del-repositorio>
cd raizel
npm install --legacy-peer-deps
```

2. **Configurar servicios locales**
```bash
# PostgreSQL
createdb manadabook
psql manadabook -f migrations/001_initial_schema.sql

# Redis (debe estar ejecutándose)
redis-server
```

3. **Variables de entorno**
```bash
cp env.example .env.local
# Configurar DATABASE_URL, REDIS_URL, Firebase, etc.
```

4. **Ejecutar migraciones**
```bash
npm run migrate
```

5. **Iniciar desarrollo**
```bash
# Frontend (Raízel + ManadaBook)
npm run dev

# Backend API (en otra terminal)
npm run backend:dev
```

### 🧪 **Testing y Calidad**

```bash
# Tests unitarios
npm run test

# Tests con watch
npm run test:watch

# Coverage
npm run test:coverage

# Linting
npm run lint

# Type checking
npm run type-check

# Performance audit
npm run audit:perf
```

El proyecto estará disponible en `http://localhost:3000` (o el puerto que esté libre).

## 👥 Sistema de Aliados/Distribuidores

### 🔐 **Gestión de Aliados**

**IMPORTANTE**: Solo los administradores pueden agregar, editar o eliminar aliados. Los usuarios públicos solo pueden ver la lista.

### 📝 **Agregar un Nuevo Aliado**

#### Opción 1: Directamente en la Base de Datos

```sql
INSERT INTO affiliates (name, contact_type, contact_value, region, description) VALUES
('Nombre del Aliado', 'WhatsApp', '+57 300 123 4567', 'Ciudad', 'Descripción del aliado');
```

#### Opción 2: Panel de Administración (Futuro)

Se implementará un panel admin protegido para gestionar aliados sin acceso directo a la base de datos.

### 📊 **Tipos de Contacto Soportados**

- **WhatsApp**: Número de teléfono (se abre WhatsApp Web/App)
- **Email**: Dirección de correo electrónico (se abre cliente de email)
- **Teléfono**: Número de teléfono (se abre app de llamadas en móvil, se copia en desktop)
- **Web**: URL del sitio web (se abre en nueva pestaña)

### 🎯 **Validaciones**

- `name`, `contact_type` y `contact_value` son obligatorios
- `contact_type` debe ser uno de los valores permitidos
- `is_active` controla si el aliado aparece en la lista pública

## 🎨 Características de Diseño

### 📱 **Mobile-First**
- Diseño responsive optimizado para móviles
- 1 columna en móvil, 2-3 en desktop
- Touch targets optimizados

### 🎨 **Paleta de Colores**
- **Verde**: Productos y elementos principales
- **Azul**: ManadaBook y redes sociales
- **Violeta**: Productos para gatos
- **Rojo**: Calculadora y alertas
- **Ámbar**: Aliados y distribuidores

### ✨ **Componentes UI**
- Tarjetas con sombras suaves
- Bordes redondeados (12px)
- Animaciones de hover
- Iconos Lucide React
- Tipografía Inter

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript
```

## 📱 Páginas Implementadas

- **`/`** - Página principal con hub de navegación
- **`/catalogo-perros`** - Productos para perros
- **`/catalogo-gatos`** - Productos para gatos
- **`/calculadora`** - Calculadora de porciones
- **`/manadabook`** - Red social de mascotas
- **`/aliados`** - Lista de distribuidores autorizados
- **`/contacto`** - Formulario de contacto

## 🔌 APIs Disponibles

- **`GET /api/affiliates`** - Lista de aliados (público)
- **`GET /api/pets`** - Gestión de mascotas
- **`GET /api/circles`** - Grupos de la red social
- **`GET /api/market/items`** - Productos del marketplace

## 🛡️ Seguridad

- **APIs protegidas**: Solo métodos GET están disponibles públicamente
- **Validación de datos**: Todas las entradas son validadas
- **Sanitización**: Los datos se limpian antes de procesarse
- **Rate limiting**: Protección contra spam (futuro)

## 🚧 Estado del Proyecto

### ✅ **Completado**
- [x] Página principal con navegación
- [x] Catálogos de productos
- [x] Calculadora de porciones
- [x] Sistema de aliados/distribuidores
- [x] Página de contacto
- [x] Integración con ManadaBook
- [x] Diseño responsive mobile-first

### 🔄 **En Desarrollo**
- [ ] Panel de administración para aliados
- [ ] Sistema de autenticación
- [ ] Integración completa con PostgreSQL
- [ ] Sistema de pedidos online

### 📋 **Planificado**
- [ ] App móvil React Native
- [ ] Sistema de notificaciones
- [ ] Analytics y métricas
- [ ] Integración con pasarelas de pago

## 🤝 Contribución

### Para Desarrolladores

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Para Aliados/Distribuidores

Si quieres ser aliado oficial de Raízel:

1. Contacta a través de WhatsApp: **+57 310 818 8723**
2. Envía información de tu negocio
3. Recibe aprobación del equipo Raízel
4. Se te agrega a la base de datos de aliados

## 📞 Contacto Oficial Raízel

### 📱 **Atención al Cliente**
- **WhatsApp Business**: [+57 310 818 8723](https://wa.me/573108188723)
- **Email**: contactoraizel@gmail.com  
- **Ubicación**: Subía, Cundinamarca, Colombia 🇨🇴
- **Horarios**: Lunes a Sábado 8:00 AM - 6:00 PM

### 🌐 **Redes Sociales**
- **📸 Instagram**: [@somosraizel](https://instagram.com/somosraizel) - Productos y consejos
- **🎵 TikTok**: [@raizeloficial](https://tiktok.com/@raizeloficial) - Videos educativos  
- **👥 Facebook**: [Raízel](https://facebook.com/raizel) - Comunidad mascotas

### 📱 **Aplicación Móvil**
- **Raízel App Android**: 85% completada
- **Funcionalidades**: Catálogo + Calculadora + Pedidos WhatsApp
- **Lanzamiento**: Próximas semanas (APK directo)

## 🗺️ **Roadmap y Próximos Pasos**

### 🚀 **FASE 1: Lanzamiento Digital** *(Próximas 4 semanas)*
1. **📱 Finalizar Raízel App** - Completar 15% restante + testing
2. **🏷️ Etiquetas finales** - Tabla nutricional + arte imprimible  
3. **🎨 Material promocional** - Templates + contenido lanzamiento

### 🏗️ **FASE 2: Infraestructura** *(1-2 meses)*  
3. **🌐 Web landing oficial** - www.raizel.com.co
4. **💳 Sistema pedidos/pagos** - E-commerce + PSE + inventario

### 🔥 **FASE 3: Firebase Completa** *(2-3 meses)*
5. **👥 Migrar perfiles usuario** - Firestore + tiempo real
6. **💬 Chat tiempo real** - Soporte + ventas integrado

### 📈 **FASE 4: Expansión** *(3-4 meses)*
7. **📱 Marketing digital** - Influencers + comunidad
8. **🌍 Expansion nacional** - 5+ ciudades Colombia

> 📋 **Documentación completa**: Ver `/docs/` para especificaciones técnicas, roadmap detallado y milestones

## 🔥 Configuración Firebase Completa

### Pasos para configurar Firebase desde cero:

#### 1. Configuración inicial del proyecto Firebase

```bash
# Autenticar Firebase CLI
firebase login

# Inicializar Firebase en el proyecto
firebase init

# Seleccionar servicios:
# - Firestore (base de datos)
# - Authentication 
# - Storage
# - Hosting (opcional)
```

#### 2. Configurar variables de entorno

Actualiza tu `.env.local` con las credenciales reales:

```bash
# Firebase Configuration (Cliente) - Obtén estos valores de Firebase Console
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com  
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### 3. Poblar con datos de ejemplo

```bash
# Ejecutar script de población (opcional)
npm run firebase:populate
```

#### 4. Deploy de reglas y configuración

```bash
# Deploy reglas de Firestore y Storage
firebase deploy --only firestore:rules,storage:rules

# Deploy del sitio web (opcional)
firebase deploy --only hosting
```

#### 5. Usar emulators para desarrollo

```bash
# Iniciar emulators locales
npm run firebase:emulator

# La UI estará disponible en http://localhost:4000
```

### Scripts disponibles relacionados con Firebase:

- `npm run firebase:populate` - Poblar con datos de ejemplo
- `npm run firebase:deploy` - Deploy a Firebase Hosting
- `npm run firebase:emulator` - Iniciar emuladores locales

### Características implementadas:

✅ **Tiempo real**: Los datos se actualizan automáticamente usando `onSnapshot`
✅ **Autenticación**: Login/registro con email y Google
✅ **Seguridad**: Reglas de Firestore configuradas
✅ **Storage**: Subida de imágenes con validación
✅ **Offline**: Soporte offline automático de Firebase

### Migración completa:

- ✅ APIs migradas de mock a Firestore
- ✅ Hooks actualizados para tiempo real
- ✅ Autenticación Firebase integrada  
- ✅ Reglas de seguridad configuradas
- ✅ Scripts de deploy y población

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Comunidad de mascotas de Colombia
- Distribuidores y aliados autorizados
- Equipo de desarrollo y diseño
- Usuarios beta que probaron la plataforma

---

**🐾 Hecho con ❤️ para todas las mascotas del mundo**
#   r a i z e l  
 #   r a i z e l  
 