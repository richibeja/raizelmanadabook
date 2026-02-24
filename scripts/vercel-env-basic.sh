#!/bin/bash

# =========================================
# CONFIGURAR VARIABLES BÁSICAS EN VERCEL
# =========================================

echo "🔧 Configurando variables básicas en Vercel..."

# Variables básicas para que funcione mínimamente
echo "📝 Configurando variables una por una..."

echo "🌐 API URL..."
vercel env add NEXT_PUBLIC_API_URL production <<< "http://localhost:3001"

echo "🔥 Firebase Project ID..."  
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production <<< "raizel-ecosystem"

echo "🔐 JWT Secret..."
vercel env add JWT_SECRET production <<< "vercel-jwt-secret-123"

echo "🔧 Worker Token..."
vercel env add WORKER_SECRET_TOKEN production <<< "worker-vercel-123"

echo ""
echo "✅ Variables básicas configuradas!"
echo ""
echo "🚀 Ahora ejecuta para aplicar las variables:"
echo "   vercel --prod"
echo ""
echo "🔍 Para ver todas las variables:"
echo "   vercel env ls"