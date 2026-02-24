const https = require('https');

// Verificar iconos en producción
async function checkProductionIcons() {
  const baseUrl = 'https://raizelmanadabook.vercel.app';
  const icons = [
    'icon-32x32.png',
    'icon-144x144.png', 
    'icon-192x192.png',
    'icon-512x512.png'
  ];

  console.log('🔍 Verificando iconos en producción...\n');

  for (const icon of icons) {
    try {
      const url = `${baseUrl}/${icon}`;
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        console.log(`✅ ${icon} - OK (${contentLength} bytes, ${contentType})`);
      } else {
        console.log(`❌ ${icon} - Error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${icon} - Error de red: ${error.message}`);
    }
  }

  // Verificar manifest
  try {
    const manifestUrl = `${baseUrl}/manifest.json`;
    const response = await fetch(manifestUrl);
    
    if (response.ok) {
      const manifest = await response.json();
      console.log(`\n✅ manifest.json - OK (${manifest.icons?.length || 0} iconos)`);
    } else {
      console.log(`\n❌ manifest.json - Error ${response.status}`);
    }
  } catch (error) {
    console.log(`\n❌ manifest.json - Error de red: ${error.message}`);
  }
}

checkProductionIcons();
