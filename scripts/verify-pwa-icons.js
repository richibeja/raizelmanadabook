const fs = require('fs');
const path = require('path');

// Verificar que todos los iconos PWA existen y son válidos
function verifyPWAIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  const requiredIcons = [
    'icon-32x32.png',
    'icon-144x144.png', 
    'icon-192x192.png',
    'icon-512x512.png'
  ];

  console.log('🔍 Verificando iconos PWA...\n');

  let allValid = true;

  requiredIcons.forEach(iconName => {
    const iconPath = path.join(publicDir, iconName);
    
    if (fs.existsSync(iconPath)) {
      const stats = fs.statSync(iconPath);
      const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
      
      if (stats.size > 0) {
        console.log(`✅ ${iconName} - ${sizeKB} KB`);
      } else {
        console.log(`❌ ${iconName} - Archivo vacío`);
        allValid = false;
      }
    } else {
      console.log(`❌ ${iconName} - No encontrado`);
      allValid = false;
    }
  });

  // Verificar manifest.json
  const manifestPath = path.join(publicDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      console.log(`\n✅ manifest.json - Válido (${manifest.icons.length} iconos)`);
    } catch (error) {
      console.log(`\n❌ manifest.json - Error de sintaxis: ${error.message}`);
      allValid = false;
    }
  } else {
    console.log('\n❌ manifest.json - No encontrado');
    allValid = false;
  }

  console.log(`\n${allValid ? '🎉 Todos los iconos PWA están correctos' : '⚠️ Hay problemas con los iconos PWA'}`);
  
  return allValid;
}

verifyPWAIcons();
