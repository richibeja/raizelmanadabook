#!/bin/bash

# =========================================
# VERCEL PRE-FLIGHT CHECK
# =========================================
# Verifica que todo esté listo para Vercel

echo "🔍 Ejecutando verificaciones pre-despliegue para Vercel..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Function to print status
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ((WARNINGS++))
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ((ERRORS++))
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

echo -e "${BLUE}=== 🔍 VERIFICACIONES DE PROYECTO ===${NC}"

# Check if package.json has correct scripts
if grep -q '"build": "next build"' package.json; then
    print_status "success" "package.json tiene script build correcto"
else
    print_status "error" "package.json missing 'build' script for Vercel"
fi

if grep -q '"start": "next start"' package.json; then
    print_status "success" "package.json tiene script start correcto"
else
    print_status "error" "package.json missing 'start' script for Vercel"
fi

# Check if Next.js app directory exists
if [ -d "app" ]; then
    print_status "success" "Next.js App Router detectado (app/ directory)"
elif [ -d "pages" ]; then
    print_status "warning" "Pages Router detectado - considera migrar a App Router"
else
    print_status "error" "No se encontró app/ ni pages/ directory"
fi

# Check critical files for Vercel
files_to_check=(
    "next.config.js:Next.js configuration"
    "vercel.json:Vercel deployment configuration"
    "env.example:Environment variables template"
    ".env.local.example:Local development template"
)

for file_desc in "${files_to_check[@]}"; do
    IFS=':' read -r file desc <<< "$file_desc"
    if [ -f "$file" ]; then
        print_status "success" "$desc existe"
    else
        print_status "warning" "$desc no encontrado"
    fi
done

echo ""
echo -e "${BLUE}=== 🔥 VERIFICACIONES FIREBASE ===${NC}"

# Check Firebase configuration
if [ -f "lib/firebase.ts" ]; then
    print_status "success" "Firebase configuration encontrada"
    
    # Check if Firebase collections are properly defined
    if grep -q "COLLECTIONS.*=" lib/firebase.ts; then
        print_status "success" "Firebase collections definidas"
    else
        print_status "warning" "Firebase collections no encontradas"
    fi
else
    print_status "error" "lib/firebase.ts no encontrado"
fi

echo ""
echo -e "${BLUE}=== 💳 VERIFICACIONES STRIPE ===${NC}"

# Check Stripe integration
if grep -q "stripe" package.json; then
    print_status "success" "Stripe dependency encontrada"
else
    print_status "warning" "Stripe dependency no encontrada en package.json"
fi

if find app/api -name "*.ts" -exec grep -l "Stripe" {} \; | grep -q .; then
    print_status "success" "Stripe integration en APIs encontrada"
else
    print_status "warning" "Stripe integration en APIs no encontrada"
fi

echo ""
echo -e "${BLUE}=== 🧪 VERIFICACIONES BUILD ===${NC}"

# Test build
echo -e "${BLUE}🏗️  Ejecutando test build...${NC}"
if npm run build > build.log 2>&1; then
    print_status "success" "Build test exitoso"
    rm -f build.log
else
    print_status "error" "Build test falló - revisar build.log"
    echo -e "${RED}Últimas líneas del error:${NC}"
    tail -10 build.log
fi

echo ""
echo -e "${BLUE}=== 📦 VERIFICACIONES DEPENDENCIAS ===${NC}"

# Check critical dependencies
critical_deps=(
    "next:Next.js framework"
    "react:React library" 
    "firebase:Firebase SDK"
    "stripe:Stripe payments"
    "lucide-react:Icons library"
)

for dep_desc in "${critical_deps[@]}"; do
    IFS=':' read -r dep desc <<< "$dep_desc"
    if npm list "$dep" > /dev/null 2>&1; then
        print_status "success" "$desc instalada"
    else
        print_status "warning" "$desc no encontrada"
    fi
done

echo ""
echo -e "${BLUE}=== 📋 RESUMEN ===${NC}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    print_status "success" "Todo perfecto! Listo para Vercel 🚀"
    echo ""
    echo -e "${GREEN}🎯 Comandos para desplegar:${NC}"
    echo "   ./scripts/setup-vercel-env.sh  # Configurar variables"
    echo "   ./scripts/deploy-vercel.sh     # Deploy automático"
    echo "   vercel --prod                  # Deploy manual"
elif [ $ERRORS -eq 0 ]; then
    print_status "warning" "Listo con $WARNINGS advertencias"
    echo -e "${YELLOW}💡 Puedes continuar, pero revisa las advertencias${NC}"
else
    print_status "error" "Encontrados $ERRORS errores y $WARNINGS advertencias"
    echo -e "${RED}🛑 Corrige los errores antes de desplegar${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔗 Links útiles:${NC}"
echo "• Vercel Dashboard: https://vercel.com/ganafacils-projects/raizel-manadabook"
echo "• Environment Variables: https://vercel.com/ganafacils-projects/raizel-manadabook/settings/environment-variables"
echo "• Deployments: https://vercel.com/ganafacils-projects/raizel-manadabook/deployments"
echo ""