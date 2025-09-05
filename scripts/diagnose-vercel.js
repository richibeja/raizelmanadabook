#!/usr/bin/env node

/**
 * Script de diagnóstico para problemas de deployment en Vercel
 * Verifica configuración, variables de entorno y dependencias
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DE VERCEL DEPLOYMENT');
console.log('=====================================\n');

// 1. Verificar archivos de configuración
console.log('📋 1. VERIFICANDO ARCHIVOS DE CONFIGURACIÓN');
console.log('---------------------------------------------');

const configFiles = [
  'vercel.json',
  'next.config.js',
  'package.json',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js'
];

configFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file} ${exists ? 'existe' : 'NO EXISTE'}`);
  
  if (exists && file === 'vercel.json') {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`   - Framework: ${content.framework || 'No especificado'}`);
      console.log(`   - Build Command: ${content.buildCommand || 'No especificado'}`);
      console.log(`   - Output Directory: ${content.outputDirectory || 'No especificado'}`);
    } catch (error) {
      console.log(`   - ❌ Error al leer ${file}: ${error.message}`);
    }
  }
});

// 2. Verificar variables de entorno
console.log('\n🔧 2. VERIFICANDO VARIABLES DE ENTORNO');
console.log('--------------------------------------');

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  const exists = value !== undefined && value !== '';
  console.log(`${exists ? '✅' : '❌'} ${envVar} ${exists ? 'definida' : 'NO DEFINIDA'}`);
  if (exists) {
    console.log(`   - Valor: ${value.substring(0, 20)}...`);
  }
});

// 3. Verificar dependencias
console.log('\n📦 3. VERIFICANDO DEPENDENCIAS');
console.log('-------------------------------');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log(`✅ Node.js version: ${process.version}`);
  console.log(`✅ Next.js version: ${packageJson.dependencies.next || 'No encontrada'}`);
  console.log(`✅ React version: ${packageJson.dependencies.react || 'No encontrada'}`);
  
  // Verificar dependencias críticas
  const criticalDeps = ['next', 'react', 'react-dom', 'typescript'];
  criticalDeps.forEach(dep => {
    const version = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
    console.log(`${version ? '✅' : '❌'} ${dep}: ${version || 'NO INSTALADA'}`);
  });
  
} catch (error) {
  console.log(`❌ Error al leer package.json: ${error.message}`);
}

// 4. Verificar estructura de archivos
console.log('\n📁 4. VERIFICANDO ESTRUCTURA DE ARCHIVOS');
console.log('----------------------------------------');

const requiredDirs = ['app', 'public', 'lib'];
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`${exists ? '✅' : '❌'} ${dir}/ ${exists ? 'existe' : 'NO EXISTE'}`);
});

// 5. Verificar archivos PWA
console.log('\n📱 5. VERIFICANDO ARCHIVOS PWA');
console.log('-------------------------------');

const pwaFiles = [
  'public/manifest.json',
  'public/sw.js',
  'public/favicon.ico',
  'public/icon-192x192.png',
  'public/icon-512x512.png'
];

pwaFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file} ${exists ? 'existe' : 'NO EXISTE'}`);
});

// 6. Verificar configuración de TypeScript
console.log('\n🔧 6. VERIFICANDO CONFIGURACIÓN DE TYPESCRIPT');
console.log('----------------------------------------------');

try {
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  console.log(`✅ TypeScript configurado`);
  console.log(`   - Target: ${tsconfig.compilerOptions?.target || 'No especificado'}`);
  console.log(`   - Module: ${tsconfig.compilerOptions?.module || 'No especificado'}`);
  console.log(`   - JSX: ${tsconfig.compilerOptions?.jsx || 'No especificado'}`);
} catch (error) {
  console.log(`❌ Error al leer tsconfig.json: ${error.message}`);
}

// 7. Verificar configuración de Jest
console.log('\n🧪 7. VERIFICANDO CONFIGURACIÓN DE JEST');
console.log('----------------------------------------');

const jestFiles = ['jest.config.js', 'jest.config.ci.js', 'jest.setup.js', 'jest.setup.ci.js'];
jestFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file} ${exists ? 'existe' : 'NO EXISTE'}`);
});

// 8. Resumen y recomendaciones
console.log('\n📊 8. RESUMEN Y RECOMENDACIONES');
console.log('================================');

console.log('\n🎯 POSIBLES CAUSAS DEL FALLO EN VERCEL:');
console.log('1. Variables de entorno no configuradas en Vercel Dashboard');
console.log('2. Problemas de memoria o timeout durante el build');
console.log('3. Dependencias incompatibles o faltantes');
console.log('4. Errores de TypeScript no detectados localmente');
console.log('5. Problemas con la configuración de Next.js');

console.log('\n🔧 ACCIONES RECOMENDADAS:');
console.log('1. Verificar variables de entorno en Vercel Dashboard');
console.log('2. Revisar logs de build en Vercel para errores específicos');
console.log('3. Ejecutar "npm run build" localmente para verificar');
console.log('4. Verificar que todas las dependencias estén en package.json');
console.log('5. Considerar aumentar el timeout de build en vercel.json');

console.log('\n✅ Diagnóstico completado');
