const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Crear favicon.ico desde el SVG existente
async function createFavicon() {
  try {
    const svgPath = path.join(__dirname, '..', 'public', 'favicon.svg');
    const icoPath = path.join(__dirname, '..', 'public', 'favicon.ico');
    
    // Leer el SVG
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Convertir a PNG de 32x32
    const pngBuffer = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();
    
    // Crear un ICO simple (formato básico)
    const icoHeader = Buffer.from([
      0x00, 0x00, // Reserved
      0x01, 0x00, // Type: 1 (icon)
      0x01, 0x00, // Number of images: 1
      0x20,       // Width: 32
      0x20,       // Height: 32
      0x00,       // Color palette: 0
      0x00,       // Reserved
      0x01, 0x00, // Color planes: 1
      0x20, 0x00, // Bits per pixel: 32
      0x00, 0x00, 0x00, 0x00, // Size of image data
      0x16, 0x00, 0x00, 0x00  // Offset to image data
    ]);
    
    const icoFile = Buffer.concat([icoHeader, pngBuffer]);
    fs.writeFileSync(icoPath, icoFile);
    
    console.log('✅ favicon.ico creado exitosamente');
  } catch (error) {
    console.error('❌ Error creando favicon.ico:', error);
  }
}

createFavicon();
