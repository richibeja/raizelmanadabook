#!/usr/bin/env node

/**
 * Script para verificar la configuración de Vercel
 * Ejecutar con: node scripts/test-vercel-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Vercel...\n');

// Verificar archivos requeridos
const requiredFiles = [
  'vercel.json',
  'next.config.js',
  'package.json',
  'app/firebaseConfig.ts',
  'lib/api.ts',
  'vercel-env.example'
];

console.log('📁 Verificando archivos requeridos:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Verificar configuración de Next.js
console.log('\n⚙️ Verificando next.config.js:');
try {
  const nextConfig = fs.readFileSync('next.config.js', 'utf8');
  
  const checks = [
    { name: 'Static export removido', test: !nextConfig.includes("output: 'export'") },
    { name: 'Rewrites configurados', test: nextConfig.includes('async rewrites()') },
    { name: 'Headers configurados', test: nextConfig.includes('async headers()') },
    { name: 'Variables de entorno', test: nextConfig.includes('process.env') }
  ];

  checks.forEach(check => {
    console.log(`  ${check.test ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Error leyendo next.config.js');
}

// Verificar configuración de Vercel
console.log('\n🚀 Verificando vercel.json:');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  const checks = [
    { name: 'Builds configurados', test: vercelConfig.builds && vercelConfig.builds.length > 0 },
    { name: 'Routes configurados', test: vercelConfig.routes && vercelConfig.routes.length > 0 },
    { name: 'Headers configurados', test: vercelConfig.headers && vercelConfig.headers.length > 0 },
    { name: 'Functions configurados', test: vercelConfig.functions }
  ];

  checks.forEach(check => {
    console.log(`  ${check.test ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Error leyendo vercel.json');
}

// Verificar Firebase config
console.log('\n🔥 Verificando Firebase config:');
try {
  const firebaseConfig = fs.readFileSync('app/firebaseConfig.ts', 'utf8');
  
  const checks = [
    { name: 'Variables de entorno configuradas', test: firebaseConfig.includes('process.env.NEXT_PUBLIC_FIREBASE') },
    { name: 'Fallbacks configurados', test: firebaseConfig.includes('||') },
    { name: 'Configuración original preservada', test: firebaseConfig.includes('AIzaSyA2FPFID3rKhqZXekWHTygsh9cjCGm8Tr8') }
  ];

  checks.forEach(check => {
    console.log(`  ${check.test ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Error leyendo app/firebaseConfig.ts');
}

// Verificar package.json
console.log('\n📦 Verificando package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const checks = [
    { name: 'Scripts de Vercel', test: packageJson.scripts && packageJson.scripts['deploy:vercel'] },
    { name: 'Next.js como dependencia', test: packageJson.dependencies && packageJson.dependencies.next },
    { name: 'React como dependencia', test: packageJson.dependencies && packageJson.dependencies.react }
  ];

  checks.forEach(check => {
    console.log(`  ${check.test ? '✅' : '❌'} ${check.name}`);
  });
} catch (error) {
  console.log('  ❌ Error leyendo package.json');
}

console.log('\n🎯 Próximos pasos:');
console.log('1. Configurar variables de entorno en Vercel');
console.log('2. Ejecutar: vercel login');
console.log('3. Ejecutar: vercel (para preview) o vercel --prod (para producción)');
console.log('4. Verificar que el backend esté accesible públicamente');
console.log('5. Configurar CORS en el backend para permitir el dominio de Vercel');

console.log('\n✨ Configuración completada!');

