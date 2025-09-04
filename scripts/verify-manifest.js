const https = require('https');

// Función para verificar el manifest.json en producción
function verifyManifest() {
  const url = 'https://raizelmanadabook.vercel.app/manifest.json';
  
  console.log('🔍 Verificando manifest.json en producción...');
  console.log(`URL: ${url}`);
  
  https.get(url, (res) => {
    console.log(`\n📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    if (res.statusCode === 200) {
      console.log('✅ ÉXITO: manifest.json es accesible correctamente');
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const manifest = JSON.parse(data);
          console.log('\n📄 Contenido del manifest:');
          console.log(`- Nombre: ${manifest.name}`);
          console.log(`- Short Name: ${manifest.short_name}`);
          console.log(`- Start URL: ${manifest.start_url}`);
          console.log(`- Display: ${manifest.display}`);
          console.log(`- Theme Color: ${manifest.theme_color}`);
          console.log(`- Iconos: ${manifest.icons ? manifest.icons.length : 0} iconos definidos`);
          
          if (manifest.icons && manifest.icons.length > 0) {
            console.log('\n🎨 Iconos disponibles:');
            manifest.icons.forEach((icon, index) => {
              console.log(`  ${index + 1}. ${icon.src} (${icon.sizes})`);
            });
          }
          
          console.log('\n🎉 PWA configurada correctamente!');
        } catch (error) {
          console.error('❌ Error al parsear JSON:', error.message);
        }
      });
    } else if (res.statusCode === 401) {
      console.log('❌ ERROR 401: No autorizado - Revisa la configuración de Vercel');
    } else if (res.statusCode === 404) {
      console.log('❌ ERROR 404: Archivo no encontrado - Verifica que esté en public/');
    } else {
      console.log(`❌ ERROR ${res.statusCode}: No se pudo acceder al manifest.json`);
    }
  }).on('error', (error) => {
    console.error('❌ Error de conexión:', error.message);
  });
}

// Ejecutar verificación
verifyManifest();
