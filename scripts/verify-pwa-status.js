const https = require('https');

// Función para verificar el estado completo de la PWA
function verifyPWAStatus() {
  const baseUrl = 'https://raizelmanadabook.vercel.app';
  
  console.log('🔍 Verificando estado completo de la PWA...');
  console.log(`URL Base: ${baseUrl}`);
  console.log('='.repeat(60));
  
  // Verificar manifest.json
  checkManifest(baseUrl);
  
  // Verificar service worker
  setTimeout(() => checkServiceWorker(baseUrl), 1000);
  
  // Verificar iconos
  setTimeout(() => checkIcons(baseUrl), 2000);
}

function checkManifest(url) {
  console.log('\n📄 Verificando manifest.json...');
  
  https.get(`${url}/manifest.json`, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ manifest.json: ACCESIBLE');
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const manifest = JSON.parse(data);
          console.log(`   - Nombre: ${manifest.name}`);
          console.log(`   - Short Name: ${manifest.short_name}`);
          console.log(`   - Display: ${manifest.display}`);
          console.log(`   - Theme Color: ${manifest.theme_color}`);
          console.log(`   - Iconos: ${manifest.icons ? manifest.icons.length : 0}`);
        } catch (error) {
          console.log('❌ Error al parsear manifest.json');
        }
      });
    } else {
      console.log(`❌ manifest.json: ERROR ${res.statusCode}`);
    }
  }).on('error', (error) => {
    console.log(`❌ manifest.json: ERROR DE CONEXIÓN - ${error.message}`);
  });
}

function checkServiceWorker(url) {
  console.log('\n⚙️ Verificando Service Worker...');
  
  https.get(`${url}/sw.js`, (res) => {
    if (res.statusCode === 200) {
      console.log('✅ Service Worker: ACCESIBLE');
      console.log(`   - Content-Type: ${res.headers['content-type']}`);
      console.log(`   - Cache-Control: ${res.headers['cache-control']}`);
    } else {
      console.log(`❌ Service Worker: ERROR ${res.statusCode}`);
    }
  }).on('error', (error) => {
    console.log(`❌ Service Worker: ERROR DE CONEXIÓN - ${error.message}`);
  });
}

function checkIcons(url) {
  console.log('\n🎨 Verificando iconos PWA...');
  
  const icons = [
    '/favicon.ico',
    '/favicon.svg',
    '/icon-32x32.png',
    '/icon-144x144.png',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/icon-192x192.svg',
    '/icon-512x512.svg'
  ];
  
  let checkedIcons = 0;
  let accessibleIcons = 0;
  
  icons.forEach((icon, index) => {
    setTimeout(() => {
      https.get(`${url}${icon}`, (res) => {
        checkedIcons++;
        if (res.statusCode === 200) {
          accessibleIcons++;
          console.log(`✅ ${icon}: ACCESIBLE`);
        } else {
          console.log(`❌ ${icon}: ERROR ${res.statusCode}`);
        }
        
        // Mostrar resumen cuando se hayan verificado todos
        if (checkedIcons === icons.length) {
          console.log('\n📊 RESUMEN DE ICONOS:');
          console.log(`   - Total verificados: ${checkedIcons}`);
          console.log(`   - Accesibles: ${accessibleIcons}`);
          console.log(`   - Porcentaje de éxito: ${Math.round((accessibleIcons / checkedIcons) * 100)}%`);
          
          console.log('\n🎉 VERIFICACIÓN COMPLETA');
          console.log('='.repeat(60));
        }
      }).on('error', (error) => {
        checkedIcons++;
        console.log(`❌ ${icon}: ERROR DE CONEXIÓN - ${error.message}`);
        
        if (checkedIcons === icons.length) {
          console.log('\n📊 RESUMEN DE ICONOS:');
          console.log(`   - Total verificados: ${checkedIcons}`);
          console.log(`   - Accesibles: ${accessibleIcons}`);
          console.log(`   - Porcentaje de éxito: ${Math.round((accessibleIcons / checkedIcons) * 100)}%`);
          
          console.log('\n🎉 VERIFICACIÓN COMPLETA');
          console.log('='.repeat(60));
        }
      });
    }, index * 200); // Delay entre verificaciones
  });
}

// Ejecutar verificación
verifyPWAStatus();
