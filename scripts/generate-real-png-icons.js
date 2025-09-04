const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Crear iconos PNG reales usando Sharp
async function createPNGIcons() {
  try {
    // Crear un icono base SVG simple
    const svgIcon = `
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" fill="#059669" rx="64"/>
        <text x="256" y="320" font-family="Arial, sans-serif" font-size="200" font-weight="bold" text-anchor="middle" fill="white">🐾</text>
        <text x="256" y="400" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">Raízel</text>
      </svg>
    `;

    // Convertir SVG a diferentes tamaños PNG
    const sizes = [
      { size: 144, filename: 'icon-144x144.png' },
      { size: 192, filename: 'icon-192.png' },
      { size: 512, filename: 'icon-512.png' }
    ];

    for (const { size, filename } of sizes) {
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png()
        .toFile(path.join(__dirname, '..', 'public', filename));
      
      console.log(`✅ Created ${filename} (${size}x${size})`);
    }

    console.log('🎉 All PNG icons created successfully with Sharp!');
  } catch (error) {
    console.error('❌ Error creating PNG icons:', error);
  }
}

createPNGIcons();
