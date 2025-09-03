# 🚀 Guía de Despliegue en Vercel - Raizel Frontend

## 📋 Resumen

Esta guía te ayudará a configurar el despliegue automático en Vercel para el frontend Next.js, manteniendo el backend (NestJS, DB, Redis, Minio) corriendo en Docker o servidor propio.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Backend       │    │   Servicios     │
│   (Frontend)    │◄──►│   (NestJS)      │◄──►│   (DB/Redis)    │
│   Next.js       │    │   Docker        │    │   Minio         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Configuración Inicial

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Configurar Variables de Entorno

#### Opción A: Desde la CLI
```bash
# Configurar variables de entorno
vercel env add NEXT_PUBLIC_BACKEND_API_URL
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add STRIPE_SECRET_KEY
# ... (ver vercel-env.example para lista completa)
```

#### Opción B: Desde el Dashboard de Vercel
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Settings → Environment Variables
3. Agrega todas las variables del archivo `vercel-env.example`

## 🌐 Variables de Entorno Requeridas

### Backend API
```bash
NEXT_PUBLIC_BACKEND_API_URL=https://your-backend-api.com
NEXT_PUBLIC_WS_URL=wss://your-backend-api.com
```

### Firebase (Mantener configuración existente)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA2FPFID3rKhqZXekWHTygsh9cjCGm8Tr8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=manadabook-web.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=manadabook-web
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=manadabook-web.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=126019253852
NEXT_PUBLIC_FIREBASE_APP_ID=1:126019253852:web:73e6e5fd18823cbf261899
```

### Stripe
```bash
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
```

### Autenticación
```bash
JWT_SECRET=your-super-secret-jwt-key-for-production
JWT_EXPIRES_IN=7d
```

## 🚀 Despliegue

### Despliegue Inicial
```bash
# Desde la raíz del proyecto
vercel

# Para producción
vercel --prod
```

### Despliegue Automático
Una vez configurado, Vercel se desplegará automáticamente en cada push a:
- `main` branch → Producción
- Otras branches → Preview

## 🔄 Configuración del Backend

### 1. Exponer Backend API Públicamente

Asegúrate de que tu backend esté accesible públicamente:

```bash
# Si usas Docker
docker run -p 3001:3001 your-backend-image

# Si usas servidor propio
# Configurar nginx o proxy reverso
```

### 2. Configurar CORS en Backend

```typescript
// En tu backend NestJS
app.enableCors({
  origin: [
    'https://your-app.vercel.app',
    'https://your-app-git-main.vercel.app'
  ],
  credentials: true
});
```

### 3. Variables de Entorno del Backend

```bash
# En tu servidor backend
DATABASE_URL=postgresql://user:pass@your-db-host:5432/dbname
REDIS_URL=redis://your-redis-host:6379
MINIO_ENDPOINT=your-minio-endpoint.com
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
```

## 🔧 Configuración de Dominio

### 1. Dominio Personalizado (Opcional)

```bash
# Agregar dominio personalizado
vercel domains add your-domain.com
```

### 2. Configurar DNS

```
# En tu proveedor de DNS
CNAME www your-app.vercel.app
A @ 76.76.19.61
```

## 📊 Monitoreo y Analytics

### 1. Vercel Analytics
```bash
# Instalar Vercel Analytics
npm install @vercel/analytics
```

### 2. Configurar en tu app
```typescript
// En app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 🛠️ Comandos Útiles

```bash
# Ver logs de despliegue
vercel logs

# Ver información del proyecto
vercel inspect

# Descargar variables de entorno
vercel env pull .env.local

# Desplegar preview
vercel

# Desplegar producción
vercel --prod

# Verificar configuración
vercel env ls
```

## 🔍 Troubleshooting

### Error: Build Failed
```bash
# Verificar logs
vercel logs

# Verificar variables de entorno
vercel env ls

# Rebuild local
npm run build
```

### Error: API Routes No Funcionan
1. Verificar que `vercel.json` esté configurado correctamente
2. Verificar que las rutas API no tengan `export const dynamic = 'force-static'`
3. Verificar variables de entorno

### Error: Firebase No Funciona
1. Verificar que todas las variables `NEXT_PUBLIC_FIREBASE_*` estén configuradas
2. Verificar que el dominio esté autorizado en Firebase Console

## 📝 Checklist de Despliegue

- [ ] Variables de entorno configuradas en Vercel
- [ ] Backend API accesible públicamente
- [ ] CORS configurado en backend
- [ ] Firebase configurado con variables de entorno
- [ ] Stripe configurado con claves de producción
- [ ] Dominio personalizado configurado (opcional)
- [ ] Analytics configurado
- [ ] Pruebas de funcionalidad completadas

## 🔐 Seguridad

### Variables Sensibles
- ✅ `STRIPE_SECRET_KEY` - Solo en servidor
- ✅ `JWT_SECRET` - Solo en servidor
- ✅ `MINIO_SECRET_KEY` - Solo en servidor
- ✅ `NEXT_PUBLIC_*` - Públicas (seguras para frontend)

### Headers de Seguridad
El archivo `vercel.json` incluye headers de seguridad básicos. Para mayor seguridad, considera agregar:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs: `vercel logs`
2. Verifica la configuración: `vercel inspect`
3. Consulta la documentación de Vercel: [vercel.com/docs](https://vercel.com/docs)

---

¡Tu aplicación Next.js ahora está lista para desplegarse automáticamente en Vercel! 🎉

