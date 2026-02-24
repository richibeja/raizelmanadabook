const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Crear todos los iconos PNG necesarios para PWA
async function createAllPNGIcons() {
  try {
    // Crear un icono base SVG profesional
    const svgIcon = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#059669;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#047857;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#bg)" rx="64"/>
        <circle cx="256" cy="200" r="80" fill="white" opacity="0.9"/>
        <text x="256" y="220" font-family="Arial, sans-serif" font-size="100" font-weight="bold" text-anchor="middle" fill="#059669">🐾</text>
        <text x="256" y="350" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">Raízel</text>
        <text x="256" y="390" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="white" opacity="0.8">Manadabook</text>
      </svg>
    `;

    // Todos los tamaños necesarios para PWA
    const sizes = [
      { size: 32, filename: 'icon-32x32.png' },
      { size: 144, filename: 'icon-144x144.png' },
      { size: 192, filename: 'icon-192x192.png' },
      { size: 512, filename: 'icon-512x512.png' }
    ];

    console.log('🎨 Creando iconos PWA profesionales...');

    for (const { size, filename } of sizes) {
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(path.join(__dirname, '..', 'public', filename));
      
      console.log(`✅ Created ${filename} (${size}x${size})`);
    }

    console.log('🎉 Todos los iconos PWA creados exitosamente!');
    console.log('📱 Iconos listos para instalación en dispositivos móviles');
  } catch (error) {
    console.error('❌ Error creando iconos PNG:', error);
  }
}

createAllPNGIcons();
