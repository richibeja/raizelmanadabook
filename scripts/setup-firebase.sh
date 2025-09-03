#!/bin/bash

# ========================================
# SCRIPT DE CONFIGURACIÓN FIREBASE
# ========================================

echo "🔥 Configurando Firebase para Manadabook..."
echo "==========================================="

# Verificar que Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI no está instalado. Instalando..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI disponible"

# Verificar autenticación
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Necesitas autenticarte en Firebase..."
    echo "Ejecutando 'firebase login'..."
    firebase login
fi

echo "✅ Autenticado en Firebase"

# Verificar que existen las variables de entorno
if [ ! -f .env.local ]; then
    echo "⚠️  Archivo .env.local no encontrado"
    echo "📝 Creando .env.local desde template..."
    cp .env.local.example .env.local 2>/dev/null || echo "# Configura tus variables de Firebase" > .env.local
fi

echo "📝 Revisando configuración..."

# Verificar variables Firebase
if ! grep -q "NEXT_PUBLIC_FIREBASE_API_KEY" .env.local; then
    echo ""
    echo "⚠️  CONFIGURACIÓN REQUERIDA:"
    echo "----------------------------"
    echo "Por favor agrega las siguientes variables a tu .env.local:"
    echo ""
    echo "NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key"
    echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com"
    echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id" 
    echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com"
    echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id"
    echo "NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id"
    echo ""
    echo "💡 Encuentra estas credenciales en:"
    echo "   Firebase Console → Configuración del proyecto → Configuración general"
    echo ""
fi

# Verificar que firebase.json existe
if [ ! -f firebase.json ]; then
    echo "❌ archivo firebase.json no encontrado"
    exit 1
fi

echo "✅ Archivos de configuración verificados"

# Inicializar Firebase (si es necesario)
echo "🔧 Configurando servicios Firebase..."

# Deploy reglas
echo "📤 Desplegando reglas de Firestore y Storage..."
firebase deploy --only firestore:rules,storage:rules --project $(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d '=' -f2) 2>/dev/null || echo "⚠️  Ejecuta manualmente: firebase deploy --only firestore:rules,storage:rules"

echo ""
echo "🎉 ¡CONFIGURACIÓN COMPLETA!"
echo "=========================="
echo ""
echo "📋 Próximos pasos:"
echo "1. ✅ Firebase configurado" 
echo "2. 📝 Completa las variables en .env.local"
echo "3. 🚀 Ejecuta: npm run dev"
echo "4. 📊 Poblar datos: npm run firebase:populate"
echo "5. 🧪 Usar emulators: npm run firebase:emulator"
echo ""
echo "🔗 URLs útiles:"
echo "- Firebase Console: https://console.firebase.google.com"
echo "- Emulator UI: http://localhost:4000 (cuando esté activo)"
echo "- Aplicación: http://localhost:3000"
echo ""
echo "🐾 ¡Listo para desarrollar con Firebase en tiempo real!"