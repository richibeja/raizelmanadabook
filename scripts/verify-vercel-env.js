#!/usr/bin/env node

/**
 * Script para verificar variables de entorno de Vercel
 * Ejecutar antes del deployment para asegurar que todas las variables estén configuradas
 */

const fs = require('fs');

console.log('🔍 VERIFICACIÓN DE VARIABLES DE ENTORNO VERCEL');
console.log('==============================================\n');

// Variables de entorno requeridas para Vercel
const requiredEnvVars = [
  {
    name: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    description: 'Firebase API Key',
    example: 'AIzaSyA2FPFID3rKhqZXekWHTygsh9cjCGm8Tr8'
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    description: 'Firebase Project ID',
    example: 'manadabook-web'
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    description: 'Firebase Auth Domain',
    example: 'manadabook-web.firebaseapp.com'
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    description: 'Firebase Storage Bucket',
    example: 'manadabook-web.firebasestorage.app'
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    description: 'Firebase Messaging Sender ID',
    example: '126019253852'
  },
  {
    name: 'NEXT_PUBLIC_FIREBASE_APP_ID',
    description: 'Firebase App ID',
    example: '1:126019253852:web:73e6e5fd18823cbf261899'
  }
];

// Variables opcionales pero recomendadas
const optionalEnvVars = [
  {
    name: 'NEXT_PUBLIC_BACKEND_API_URL',
    description: 'Backend API URL',
    example: 'https://your-backend-api.com'
  },
  {
    name: 'STRIPE_SECRET_KEY',
    description: 'Stripe Secret Key',
    example: 'sk_live_...'
  },
  {
    name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    description: 'Stripe Publishable Key',
    example: 'pk_live_...'
  }
];

console.log('📋 VARIABLES REQUERIDAS:');
console.log('------------------------');

let missingRequired = 0;
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar.name];
  const exists = value !== undefined && value !== '';
  console.log(`${exists ? '✅' : '❌'} ${envVar.name}`);
  console.log(`   Descripción: ${envVar.description}`);
  console.log(`   Ejemplo: ${envVar.example}`);
  if (!exists) {
    missingRequired++;
  }
  console.log('');
});

console.log('📋 VARIABLES OPCIONALES:');
console.log('-------------------------');

let missingOptional = 0;
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar.name];
  const exists = value !== undefined && value !== '';
  console.log(`${exists ? '✅' : '⚠️ '} ${envVar.name}`);
  console.log(`   Descripción: ${envVar.description}`);
  console.log(`   Ejemplo: ${envVar.example}`);
  if (!exists) {
    missingOptional++;
  }
  console.log('');
});

// Resumen
console.log('📊 RESUMEN:');
console.log('===========');
console.log(`✅ Variables requeridas configuradas: ${requiredEnvVars.length - missingRequired}/${requiredEnvVars.length}`);
console.log(`⚠️  Variables opcionales configuradas: ${optionalEnvVars.length - missingOptional}/${optionalEnvVars.length}`);

if (missingRequired > 0) {
  console.log('\n❌ ERROR: Faltan variables de entorno requeridas');
  console.log('🔧 ACCIÓN REQUERIDA:');
  console.log('1. Ve al dashboard de Vercel');
  console.log('2. Selecciona tu proyecto "Raizel ManadaBook"');
  console.log('3. Ve a Settings > Environment Variables');
  console.log('4. Agrega las variables faltantes');
  console.log('5. Vuelve a ejecutar el deployment');
  process.exit(1);
} else {
  console.log('\n✅ Todas las variables requeridas están configuradas');
  console.log('🚀 Listo para deployment en Vercel');
}

if (missingOptional > 0) {
  console.log('\n⚠️  NOTA: Algunas variables opcionales no están configuradas');
  console.log('Esto puede afectar funcionalidades específicas pero no impedirá el deployment');
}
