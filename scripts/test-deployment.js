#!/usr/bin/env node

/**
 * Script de test para verificar que el deployment funciona correctamente
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Iniciando tests de deployment...\n');

// Test 1: Verificar que el build funciona
console.log('1️⃣ Verificando build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build exitoso');
} catch (error) {
  console.error('❌ Build falló:', error.message);
  process.exit(1);
}

// Test 2: Verificar que los archivos críticos existen
console.log('\n2️⃣ Verificando archivos críticos...');
const criticalFiles = [
  'public/manifest.json',
  'public/sw.js',
  'app/layout.tsx',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.error(`❌ ${file} no existe`);
    process.exit(1);
  }
});

// Test 3: Verificar configuración de TailwindCSS
console.log('\n3️⃣ Verificando configuración de TailwindCSS...');
try {
  const tailwindConfig = require('../tailwind.config.js');
  if (tailwindConfig.content && tailwindConfig.content.length > 0) {
    console.log('✅ TailwindCSS configurado correctamente');
  } else {
    console.error('❌ TailwindCSS no configurado');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error en configuración de TailwindCSS:', error.message);
  process.exit(1);
}

// Test 4: Verificar PostCSS
console.log('\n4️⃣ Verificando configuración de PostCSS...');
try {
  const postcssConfig = require('../postcss.config.js');
  if (postcssConfig.plugins && postcssConfig.plugins['@tailwindcss/postcss']) {
    console.log('✅ PostCSS configurado correctamente');
  } else {
    console.error('❌ PostCSS no configurado correctamente');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error en configuración de PostCSS:', error.message);
  process.exit(1);
}

// Test 5: Verificar que no hay errores de TypeScript
console.log('\n5️⃣ Verificando tipos de TypeScript...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript sin errores');
} catch (error) {
  console.error('❌ Errores de TypeScript:', error.message);
  process.exit(1);
}

console.log('\n🎉 Todos los tests pasaron! El deployment debería funcionar correctamente.');
console.log('\n📋 Resumen:');
console.log('✅ Build exitoso');
console.log('✅ Archivos críticos presentes');
console.log('✅ TailwindCSS configurado');
console.log('✅ PostCSS configurado');
console.log('✅ TypeScript sin errores');
console.log('\n🚀 Listo para deployment en Vercel!');
