#!/bin/bash

# =========================================
# VERCEL FRESH DEPLOY - RAÍZEL MANADABOOK
# =========================================

echo "🚀 Iniciando integración LIMPIA en Vercel..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m' 
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Login
echo -e "${BLUE}🔑 Paso 1: Login en Vercel${NC}"
vercel login

echo ""
echo -e "${YELLOW}📋 Instrucciones para el deployment:${NC}"
echo ""
echo -e "${BLUE}Cuando Vercel pregunte, responde:${NC}"
echo "❓ Set up and deploy? → ${GREEN}Y${NC}"
echo "❓ Which scope? → ${GREEN}Selecciona tu cuenta${NC}"
echo "❓ Project name? → ${GREEN}raizel-manadabook${NC}"
echo "❓ In which directory? → ${GREEN}./  (enter)${NC}"
echo "❓ Want to modify settings? → ${GREEN}N${NC}"
echo ""

# Step 2: Deploy
echo -e "${BLUE}🚀 Paso 2: Iniciando deployment...${NC}"
vercel

echo ""
echo -e "${GREEN}✅ Deploy inicial completado!${NC}"
echo ""
echo -e "${YELLOW}🔧 Próximos pasos después del deploy:${NC}"
echo "1. Configurar variables de entorno en Vercel Dashboard"
echo "2. Re-deploy para aplicar variables"
echo "3. Probar URLs finales"
echo ""
echo -e "${BLUE}📋 Variables importantes a configurar:${NC}"
echo "NEXT_PUBLIC_API_URL (tu backend URL)"
echo "NEXT_PUBLIC_FIREBASE_API_KEY"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "JWT_SECRET"
echo ""
echo -e "${GREEN}🎯 Después de configurar variables, ejecuta:${NC}"
echo -e "${BLUE}vercel --prod${NC}"