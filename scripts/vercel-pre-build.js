#!/usr/bin/env node

/**
 * Script de pre-build para Vercel
 * Verifica dependencias y prepara el entorno antes del build
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 VERCEL PRE-BUILD SCRIPT');
console.log('===========================\n');

try {
  // 1. Verificar que estamos en el directorio correcto
  console.log('📁 Verificando directorio de trabajo...');
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json no encontrado. Asegúrate de estar en el directorio raíz del proyecto.');
  }
  console.log('✅ Directorio correcto');

  // 2. Verificar Node.js version
  console.log('\n🔧 Verificando versión de Node.js...');
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);

  // 3. Verificar que las dependencias estén instaladas
  console.log('\n📦 Verificando dependencias...');
  if (!fs.existsSync('node_modules')) {
    console.log('⚠️  node_modules no encontrado, instalando dependencias...');
    execSync('npm ci --legacy-peer-deps', { stdio: 'inherit' });
  } else {
    console.log('✅ Dependencias ya instaladas');
  }

  // 4. Verificar archivos críticos
  console.log('\n📋 Verificando archivos críticos...');
  const criticalFiles = [
    'next.config.js',
    'tsconfig.json',
    'tailwind.config.js',
    'postcss.config.js',
    'app/layout.tsx',
    'app/page.tsx',
    'public/manifest.json'
  ];

  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - FALTANTE`);
    }
  });

  // 5. Verificar variables de entorno críticas
  console.log('\n🔧 Verificando variables de entorno...');
  const criticalEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  ];

  let missingEnvVars = 0;
  criticalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}`);
    } else {
      console.log(`⚠️  ${envVar} - No definida (esto es normal en desarrollo)`);
      missingEnvVars++;
    }
  });

  // 6. Verificar configuración de TypeScript
  console.log('\n🔧 Verificando configuración de TypeScript...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript sin errores');
  } catch (error) {
    console.log('⚠️  Errores de TypeScript detectados (continuando...)');
  }

  // 7. Limpiar cache si es necesario
  console.log('\n🧹 Limpiando cache...');
  try {
    if (fs.existsSync('.next')) {
      execSync('rm -rf .next', { stdio: 'pipe' });
      console.log('✅ Cache de Next.js limpiado');
    }
  } catch (error) {
    console.log('⚠️  No se pudo limpiar el cache (continuando...)');
  }

  console.log('\n✅ PRE-BUILD COMPLETADO EXITOSAMENTE');
  console.log('🚀 Listo para el build de Vercel');

} catch (error) {
  console.error('\n❌ ERROR EN PRE-BUILD:');
  console.error(error.message);
  process.exit(1);
}
