# ManadaBook - Red Social Completa para Mascotas
## Resumen de Entregables - Fase 2-3 Completa

### 🎯 Visión Ejecutiva
ManadaBook es la red social más grande del mundo para mascotas de todo tipo (perros, gatos, aves, peces, reptiles, roedores, caballos, exóticas, etc.), con funcionalidades completas de social media, marketplace, short-video, publicidad y analytics.

### 🚀 Features Implementadas

#### ✅ **PR1: Infraestructura Base** (`feature/infra-setup`)
- Docker Compose con PostgreSQL, Redis, MinIO
- GitHub Actions CI/CD
- Variables de entorno (.env.example)
- README con instrucciones de setup

#### ✅ **PR2: Autenticación y Perfiles** (`feature/auth-profiles`)
- JWT Authentication (register/login/logout)
- Perfiles de usuarios y mascotas expandidos
- Campos universales: species, breed (opcional), age, gender, personality, interests, location, bio
- Soporte para múltiples mascotas por tutor
- Privacidad básica (público/privado)

#### ✅ **PR3: Circles (Grupos)** (`feature/circles-core`)
- Grupos públicos y privados
- Roles: admin, moderador, miembro
- Feed específico por grupo
- Discovery por ciudad/tags
- Invitaciones y gestión de miembros

#### ✅ **PR4: Moments (Estados Efímeros)** (`feature/moments`)
- Posts efímeros (24h de duración)
- Carousel en la parte superior del feed
- Indicadores de progreso
- Sistema de expiración automática

#### ✅ **PR5: Mercaplace (Marketplace)** (`feature/mercaplace-mvp`)
- Compra/venta/adopción de mascotas y productos
- Categorías y filtros
- Perfiles de vendedores
- Integración con Stripe Checkout
- Estados: activo, vendido, reservado

#### ✅ **PR6: Snippets (Short-Video)** (`feature/snippets-mvp`)
- Feed de videos estilo TikTok/Reels
- Autoplay con mute/unmute
- Likes y comentarios
- Upload con presigned URLs
- Worker stub para transcodificación con FFmpeg

#### ✅ **PR7: Promos (Publicidad)** (`feature/promos-ads`)
- Sistema de anuncios pagados
- Tipos de bid: CPM, CPC, CPI
- Segmentación por ubicación, raza, intereses
- Workflow de aprobación admin
- Integración con Stripe para pagos

#### ✅ **PR8: Mensajería en Tiempo Real** (`feature/realtime-msgs`)
- Chat 1:1 y grupal
- WebSocket/Socket.IO
- Notificaciones en tiempo real
- Conversaciones persistentes
- Estados de lectura

#### ✅ **PR9: Moderación y Administración** (`feature/moderation-admin`)
- Sistema de reportes
- Dashboard de moderación
- Acciones: warning, ban temporal/permanente
- Rate limiting y spam detection
- Logs de administración

#### ✅ **PR10: Analytics y Métricas** (`feature/analytics`)
- Tracking de eventos en tiempo real
- Dashboard con métricas clave
- Funnels de conversión
- Cohortes de usuarios
- Export de datos

### 🛠️ Stack Tecnológico

#### Frontend
- **Framework**: Next.js 15.5.2 (App Router)
- **UI**: React 18.2.0 + TypeScript 5.9.2
- **Styling**: Tailwind CSS (JIT)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks + Context

#### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL (Primary) + Redis (Cache)
- **Storage**: MinIO (S3-compatible)
- **Real-time**: WebSocket/Socket.IO
- **Payments**: Stripe

#### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Jest + @testing-library/react
- **Monitoring**: Custom analytics + event tracking

### 📊 Data Model

#### Entidades Principales
```sql
-- Usuarios y Autenticación
users (id, name, email, phone, password_hash, avatar_url, role, created_at)
pets (id, owner_id, name, species, breed, age, gender, personality, interests, location, bio, avatar_url, vaccines[], privacy)

-- Contenido Social
posts (id, author_id, pet_id, content, media[], type, visibility, created_at)
reactions (id, user_id, post_id, type)
comments (id, post_id, user_id, parent_comment_id, content, created_at)
follows (follower_id, followee_id, status)

-- Comunidad
circles (id, name, slug, type, admin_id, description, location, created_at)
circle_members (circle_id, user_id, role, joined_at)

-- Marketplace
marketplace_items (id, seller_id, title, description, price, currency, photos[], status, category, location)

-- Multimedia
snippets (id, author_id, title, description, video_url, thumbnail_url, duration, views, likes, created_at)

-- Mensajería
conversations (id, type, title, participants[])
messages (id, conversation_id, sender_id, content, media[], created_at, read_at)

-- Publicidad
ads (id, owner_id, title, description, target, budget, bid_type, start_date, end_date, creative[], status)

-- Analytics
analytics_events (id, user_id, session_id, event_type, event_category, event_data, created_at)
analytics_metrics (id, metric_name, metric_value, metric_unit, dimension_key, dimension_value, date_bucket)

-- Moderación
reports (id, reporter_id, target_type, target_id, reason, status, created_at)
moderation_actions (id, moderator_id, target_type, target_id, action_type, reason, created_at)
```

### 🚀 Cómo Levantar Localmente

#### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+
- npm o yarn

#### Pasos de Instalación

1. **Clonar y configurar**
```bash
git clone <repo-url>
cd raizel
cp .env.example .env
# Editar .env con tus variables
```

2. **Levantar servicios con Docker**
```bash
docker-compose up -d
```

3. **Instalar dependencias**
```bash
npm install
```

4. **Ejecutar migraciones**
```bash
# Las migraciones se ejecutan automáticamente al levantar PostgreSQL
# O manualmente:
docker-compose exec postgres psql -U postgres -d manadabook -f /migrations/*.sql
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

6. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api
- MinIO Console: http://localhost:9001
- PostgreSQL: localhost:5432

### 📡 Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

#### Usuarios y Mascotas
- `GET /api/users/:id` - Perfil de usuario
- `PUT /api/users/:id` - Actualizar perfil
- `POST /api/pets` - Crear mascota
- `GET /api/pets/:id` - Perfil de mascota
- `PUT /api/pets/:id` - Actualizar mascota

#### Feed y Contenido
- `GET /api/feed` - Feed principal
- `POST /api/posts` - Crear post
- `GET /api/posts/:id` - Ver post
- `POST /api/posts/:id/react` - Reaccionar
- `POST /api/posts/:id/comments` - Comentar

#### Circles (Grupos)
- `POST /api/circles` - Crear grupo
- `GET /api/circles` - Listar grupos
- `GET /api/circles/:id` - Ver grupo
- `POST /api/circles/:id/join` - Unirse
- `POST /api/circles/:id/leave` - Salir

#### Mercaplace
- `POST /api/market/items` - Crear item
- `GET /api/market/items` - Listar items
- `GET /api/market/items/:id` - Ver item
- `POST /api/market/items/:id/purchase` - Iniciar compra

#### Snippets (Videos)
- `POST /api/snippets` - Subir video
- `GET /api/snippets` - Feed de videos
- `GET /api/snippets/:id` - Ver video
- `POST /api/snippets/:id/react` - Reaccionar

#### Promos (Publicidad)
- `POST /api/ads` - Crear campaña
- `GET /api/ads` - Listar campañas
- `POST /api/ads/:id/pay` - Pagar campaña
- `GET /api/ads/:id/stats` - Estadísticas

#### Mensajería
- `GET /api/conversations` - Listar conversaciones
- `POST /api/conversations` - Crear conversación
- `GET /api/conversations/:id/messages` - Mensajes
- `POST /api/conversations/:id/messages` - Enviar mensaje

#### Moderación
- `POST /api/reports` - Reportar contenido
- `GET /api/moderation/reports` - Listar reportes
- `POST /api/moderation/actions` - Acción de moderación

#### Analytics
- `POST /api/analytics/events` - Trackear evento
- `GET /api/analytics/metrics` - Obtener métricas
- `GET /api/analytics/dashboard` - Dashboard

### 🧪 Testing

#### Ejecutar Tests
```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

#### Comandos de Desarrollo
```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Start de producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

### 📱 Páginas Implementadas

#### Páginas Principales
- `/` - Landing page
- `/manadabook` - Feed principal
- `/pets` - Lista de mascotas
- `/pets/[id]` - Perfil de mascota
- `/circles` - Grupos
- `/circles/[id]` - Grupo específico
- `/snippets` - Videos cortos
- `/snippets/[id]` - Video específico
- `/mercaplace` - Marketplace
- `/mercaplace/[id]` - Item específico
- `/ads` - Publicidad
- `/ads/[id]` - Campaña específica
- `/conversations` - Chat
- `/conversations/[id]` - Conversación específica
- `/notifications` - Notificaciones
- `/moderation` - Panel de moderación
- `/moderation/actions` - Acciones de moderación
- `/analytics` - Dashboard de analytics
- `/analytics/events` - Eventos detallados

### 🔧 Configuración de Variables de Entorno

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/manadabook
REDIS_URL=redis://localhost:6379

# Storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=manadabook

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics
ANALYTICS_ENABLED=true
ANALYTICS_SAMPLE_RATE=1.0
```

### 🚀 TODO para Producción

#### Infraestructura
- [ ] CDN (CloudFront/Azure CDN) para assets estáticos
- [ ] SSL/TLS con Let's Encrypt
- [ ] Load balancer (ALB/Application Gateway)
- [ ] Auto-scaling groups
- [ ] Monitoring con Prometheus + Grafana
- [ ] Logging centralizado (ELK Stack)

#### Seguridad
- [ ] WAF (Web Application Firewall)
- [ ] Rate limiting avanzado
- [ ] Moderación con ML (AWS Rekognition/Azure Computer Vision)
- [ ] Backup automático de base de datos
- [ ] Auditoría de seguridad

#### Performance
- [ ] Caching con Redis Cluster
- [ ] Database sharding
- [ ] Microservicios para video processing
- [ ] CDN para videos
- [ ] Optimización de imágenes (WebP/AVIF)

#### Features Avanzadas
- [ ] App móvil (React Native)
- [ ] Push notifications
- [ ] Live streaming
- [ ] AI para recomendaciones
- [ ] Gamificación (badges, achievements)
- [ ] Marketplace multi-vendor con Stripe Connect

### 📈 Métricas de Éxito

#### KPIs Principales
- **Usuarios**: DAU, MAU, crecimiento mensual
- **Engagement**: tiempo en app, posts por usuario, likes/comentarios
- **Retención**: D1, D7, D30
- **Monetización**: ARPU, conversión de ads, revenue por usuario
- **Técnico**: uptime, response time, error rate

#### Funnels de Conversión
1. Registro → Verificación de email
2. Primer post → Primer like
3. Seguir primera mascota → Engagement
4. Crear grupo → Invitar amigos
5. Subir video → Viralización
6. Compra en marketplace → Recompra

### 🤝 Contribución

#### Estructura de Branches
- `main` - Producción
- `develop` - Desarrollo
- `feature/*` - Features individuales
- `hotfix/*` - Fixes críticos

#### Proceso de PR
1. Crear branch desde `develop`
2. Implementar feature
3. Tests y linting
4. Crear PR
5. Code review
6. Merge a `develop`
7. Deploy a staging
8. Deploy a producción

### 📞 Soporte

#### Documentación
- [API Documentation](./openapi.yaml)
- [Component Library](./components/README.md)
- [Database Schema](./migrations/README.md)

#### Contacto
- Issues: GitHub Issues
- Email: support@manadabook.com
- Discord: [Link al servidor]

---

**ManadaBook** - La red social más grande del mundo para mascotas 🐾
