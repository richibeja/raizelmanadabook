#!/bin/bash

# =========================================
# RAÍZEL + MANADABOOK - DEPLOY TO VERCEL
# =========================================

echo "🚀 Iniciando despliegue de Raízel + ManadaBook a Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI no está instalado. Instalando...${NC}"
    npm install -g vercel
fi

# Check if user is logged in
echo -e "${BLUE}🔍 Verificando autenticación Vercel...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  No estás logueado en Vercel. Iniciando login...${NC}"
    vercel login
fi

# Link project
echo -e "${BLUE}🔗 Conectando proyecto...${NC}"
vercel link --project-id prj_qJDrQV0qZzT8mfZQt9DKZtsmPamC --yes

# Check environment variables
echo -e "${BLUE}📋 Verificando variables de entorno...${NC}"

REQUIRED_VARS=(
    "NEXT_PUBLIC_API_URL"
    "NEXT_PUBLIC_FIREBASE_API_KEY"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
    "JWT_SECRET"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! vercel env ls production | grep -q "$var"; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Variables de entorno faltantes en Vercel:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "${RED}   - $var${NC}"
    done
    echo -e "${YELLOW}💡 Configura las variables en Vercel Dashboard:${NC}"
    echo -e "${YELLOW}   https://vercel.com/ganafacils-projects/raizel-manadabook/settings/environment-variables${NC}"
    echo ""
    echo -e "${YELLOW}📋 Variables requeridas (copia desde .env.example):${NC}"
    cat << 'EOF'
NEXT_PUBLIC_API_URL=https://api.manadabook.com
NEXT_PUBLIC_WS_URL=wss://api.manadabook.com
NEXT_PUBLIC_MINIO_ENDPOINT=https://storage.manadabook.com
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=raizel-ecosystem
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
JWT_SECRET=your-production-secret
WORKER_SECRET_TOKEN=worker-production-secret
EOF
    echo ""
    echo -e "${RED}⚠️  Configura estas variables y vuelve a ejecutar el script${NC}"
    exit 1
fi

# Build and test locally first
echo -e "${BLUE}🏗️  Construyendo proyecto localmente...${NC}"
if ! npm run build; then
    echo -e "${RED}❌ Build falló. Revisa los errores antes de desplegar.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build exitoso!${NC}"

# Choose deployment type
echo -e "${YELLOW}🎯 ¿Qué tipo de despliegue quieres hacer?${NC}"
echo "1) Preview/Staging (para testing)"
echo "2) Producción (live para usuarios)"
read -p "Selecciona (1-2): " deploy_type

case $deploy_type in
    1)
        echo -e "${BLUE}🧪 Desplegando en Preview/Staging...${NC}"
        vercel --yes
        ;;
    2)
        echo -e "${RED}⚠️  ¿Estás seguro de desplegar a PRODUCCIÓN? (y/N): ${NC}"
        read -p "" confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            echo -e "${BLUE}🚀 Desplegando a PRODUCCIÓN...${NC}"
            vercel --prod --yes
        else
            echo -e "${YELLOW}❌ Despliegue cancelado${NC}"
            exit 0
        fi
        ;;
    *)
        echo -e "${RED}❌ Opción inválida${NC}"
        exit 1
        ;;
esac

# Show final URLs
echo ""
echo -e "${GREEN}🎉 ¡Despliegue completado exitosamente!${NC}"
echo ""
echo -e "${BLUE}🌐 URLs del Ecosistema:${NC}"
echo -e "${GREEN}📱 Frontend: https://raizel-manadabook.vercel.app${NC}"
echo -e "${GREEN}🔥 Backend: https://api.manadabook.com${NC}"
echo -e "${GREEN}🗄️  Firebase: Automático (Google Cloud)${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo "1. Verificar que el backend esté running en tu servidor"
echo "2. Testear la conectividad frontend ↔ backend"
echo "3. Configurar dominio custom si lo tienes"
echo "4. Monitorear logs de Vercel"
echo ""
echo -e "${BLUE}🔍 Comandos útiles:${NC}"
echo "vercel logs --follow"
echo "vercel inspect [deployment-url]"
echo "vercel domains ls"
echo ""
echo -e "${GREEN}🐾 ¡Raízel + ManadaBook está vivo en la nube! 🚀${NC}"