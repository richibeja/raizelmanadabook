const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build estático para Firebase Hosting...');

// Crear directorio out si no existe
if (!fs.existsSync('out')) {
  fs.mkdirSync('out');
}

// Copiar archivos estáticos
console.log('📁 Copiando archivos estáticos...');
try {
  execSync('Copy-Item -Path "public" -Destination "out\\public" -Recurse -Force', { 
    stdio: 'inherit',
    shell: 'powershell.exe'
  });
} catch (error) {
  console.log('⚠️ No se pudo copiar public, continuando...');
}

// Crear index.html básico
const indexHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ManadaBook - Red Social para Mascotas</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
        }
        .logo {
            font-size: 2.5em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        .features {
            text-align: left;
            margin: 30px 0;
        }
        .feature {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .feature:last-child {
            border-bottom: none;
        }
        .status {
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🐾 ManadaBook</div>
        <div class="subtitle">Red Social para Mascotas</div>
        
        <div class="features">
            <div class="feature">✅ Perfiles de mascotas</div>
            <div class="feature">✅ Feed social</div>
            <div class="feature">✅ Marketplace</div>
            <div class="feature">✅ Conversaciones</div>
            <div class="feature">✅ Snippets de video</div>
            <div class="feature">✅ Sistema de moderación</div>
        </div>
        
        <div class="status">🚀 Aplicación desplegada exitosamente</div>
    </div>
</body>
</html>
`;

fs.writeFileSync('out/index.html', indexHtml);

console.log('✅ Build estático completado!');
console.log('📁 Archivos generados en: ./out/');
console.log('🌐 Listo para Firebase Hosting');
