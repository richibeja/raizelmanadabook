# 🚀 VERCEL DEPLOYMENT - RAÍZEL + MANADABOOK

## ⚡ **DEPLOY EN 3 PASOS**

### 🎯 **Paso 1: Setup Automático**
```bash
# Ejecutar script helper
./scripts/vercel-preflight.sh    # Verificar que todo esté listo
./scripts/setup-vercel-env.sh    # Configurar variables
./scripts/deploy-vercel.sh       # Deploy automático
```

### 🎯 **Paso 2: Manual Rápido**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login y conectar
vercel login
vercel link --project-id prj_qJDrQV0qZzT8mfZQt9DKZtsmPamC

# Deploy
vercel --prod
```

### 🎯 **Paso 3: Verificar Funcionamiento**
```bash
# Test URLs finales
curl -I https://raizel-manadabook.vercel.app
curl https://raizel-manadabook.vercel.app/api/pets
```

---

## 📋 **VARIABLES CRÍTICAS PARA VERCEL**

### ⚡ **Configurar en Vercel Dashboard:**
```
🌐 API URLs:
NEXT_PUBLIC_API_URL=https://api.manadabook.com
NEXT_PUBLIC_WS_URL=wss://api.manadabook.com

🔥 FIREBASE:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=raizel-ecosystem
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=raizel-ecosystem.firebaseapp.com

💳 STRIPE:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

🔐 SECURITY:
JWT_SECRET=your-production-secret
WORKER_SECRET_TOKEN=worker-production-secret
```

---

## 🌐 **ARQUITECTURA FINAL**

```
🏗️ RAÍZEL + MANADABOOK ECOSYSTEM:

┌─ 🌐 VERCEL (Frontend)
│  ├── Next.js App Router ✅
│  ├── Firebase Client ✅  
│  ├── Stripe Checkout ✅
│  ├── Auto-deploy GitHub ✅
│  └── CDN Global ✅
│
├─ 🔥 TU SERVIDOR (Backend)  
│  ├── NestJS APIs
│  ├── PostgreSQL + Redis
│  ├── MinIO Storage
│  └── Workers
│
└─ 🔥 GOOGLE CLOUD (Firebase)
   ├── Auth + Profiles
   ├── Realtime Database  
   ├── Storage
   └── Analytics
```

---

## 🎯 **URLs FINALES**

### 🌐 **Producción**
- **Frontend**: https://raizel-manadabook.vercel.app
- **Backend**: https://api.manadabook.com *(tu servidor)*
- **Firebase**: Automático *(Google Cloud)*

### 🧪 **Development**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001 *(Docker)*
- **MinIO**: http://localhost:9001 *(Docker)*

---

## 🚨 **CHECKLIST PRE-DEPLOY**

- [ ] Variables de entorno configuradas en Vercel
- [ ] Backend running en tu servidor
- [ ] Firebase project configurado
- [ ] Stripe keys de producción configuradas
- [ ] Build test exitoso: `npm run build`
- [ ] CORS configurado en backend para Vercel URL

---

## 🆘 **SOPORTE RÁPIDO**

### 🔧 **Comandos Útiles**
```bash
vercel logs --follow          # Ver logs tiempo real
vercel env ls                 # Listar variables
vercel inspect [url]          # Inspeccionar deployment
vercel domains ls             # Ver dominios
```

### 📞 **Links Directos**
- [Vercel Dashboard](https://vercel.com/ganafacils-projects/raizel-manadabook)
- [Environment Variables](https://vercel.com/ganafacils-projects/raizel-manadabook/settings/environment-variables)
- [Deployments](https://vercel.com/ganafacils-projects/raizel-manadabook/deployments)

---

## 🎉 **¡LISTO!**

**🐾 Tu ecosistema Raízel + ManadaBook está preparado para conquistar la nube con Vercel** 🚀

---

*Documentación completa en: [README.md](./README.md)*