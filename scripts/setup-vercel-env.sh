#!/bin/bash

# =========================================
# SETUP VERCEL ENVIRONMENT VARIABLES  
# =========================================

echo "🔧 Configurando variables de entorno en Vercel..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI no instalado. Ejecuta: npm install -g vercel${NC}"
    exit 1
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}🔑 Iniciando login en Vercel...${NC}"
    vercel login
fi

echo -e "${BLUE}🔗 Conectando a proyecto raizel-manadabook...${NC}"
vercel link --project-id prj_qJDrQV0qZzT8mfZQt9DKZtsmPamC --yes

echo -e "${YELLOW}📋 Configurando variables críticas...${NC}"
echo ""
echo -e "${BLUE}🌐 URLs BACKEND (Cambiar por tus URLs reales):${NC}"

# Function to add env var with confirmation
add_env_var() {
    local var_name=$1
    local var_description=$2
    local example_value=$3
    local environment=$4
    
    echo -e "${YELLOW}📝 Configurando: $var_name${NC}"
    echo "   Descripción: $var_description"
    echo "   Ejemplo: $example_value"
    echo ""
    read -p "¿Agregar esta variable? (y/N): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        read -p "Ingresa el valor real: " var_value
        if [ ! -z "$var_value" ]; then
            vercel env add "$var_name" "$environment" <<< "$var_value"
            echo -e "${GREEN}✅ $var_name configurado${NC}"
        else
            echo -e "${YELLOW}⚠️  Saltando $var_name (valor vacío)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Saltando $var_name${NC}"
    fi
    echo ""
}

# Critical environment variables
echo -e "${BLUE}🎯 Variables CRÍTICAS para funcionamiento:${NC}"
echo ""

add_env_var "NEXT_PUBLIC_API_URL" "URL del backend API" "https://api.manadabook.com" "production"
add_env_var "NEXT_PUBLIC_WS_URL" "URL WebSocket para tiempo real" "wss://api.manadabook.com" "production"

echo -e "${BLUE}🔥 Variables FIREBASE:${NC}"
add_env_var "NEXT_PUBLIC_FIREBASE_API_KEY" "Firebase API Key (público)" "AIza..." "production"
add_env_var "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "Firebase Project ID" "raizel-ecosystem" "production"
add_env_var "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "Firebase Auth Domain" "raizel-ecosystem.firebaseapp.com" "production"

echo -e "${BLUE}💳 Variables STRIPE:${NC}"
add_env_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "Stripe Publishable Key (público)" "pk_live_..." "production"
add_env_var "STRIPE_SECRET_KEY" "Stripe Secret Key (PRIVADO)" "sk_live_..." "production"
add_env_var "STRIPE_WEBHOOK_SECRET" "Stripe Webhook Secret" "whsec_..." "production"

echo -e "${BLUE}🔐 Variables JWT:${NC}"
add_env_var "JWT_SECRET" "JWT Secret (PRIVADO)" "your-super-secret-jwt-key" "production"

echo -e "${BLUE}🔧 Variables WORKER:${NC}"
add_env_var "WORKER_SECRET_TOKEN" "Worker Secret Token" "worker-secret-123" "production"

echo ""
echo -e "${GREEN}🎉 Configuración de variables completada!${NC}"
echo ""
echo -e "${YELLOW}📋 Próximos pasos:${NC}"
echo "1. Verificar variables: vercel env ls"
echo "2. Deploy: vercel --prod"
echo "3. Verificar funcionamiento en URLs finales"
echo ""
echo -e "${BLUE}🔍 Variables configuradas se pueden ver en:${NC}"
echo "https://vercel.com/ganafacils-projects/raizel-manadabook/settings/environment-variables"
echo ""
echo -e "${GREEN}✅ Listo para desplegar el ecosistema Raízel + ManadaBook! 🚀${NC}"