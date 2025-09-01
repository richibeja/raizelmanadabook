# ---------------------------
# Mega Full Setup Raízel / ManadaBook
# ---------------------------

Write-Host "🚀 Iniciando Mega Setup..."

# 1️⃣ Limpiar node_modules y package-lock.json
Write-Host "🧹 Limpiando node_modules y package-lock.json..."
Remove-Item -Recurse -Force .\node_modules, .\package-lock.json -ErrorAction SilentlyContinue

# 2️⃣ Corregir package.json
Write-Host "📝 Creando package.json limpio..."
$pkgPath = "C:\Users\ALP\Documents\raizel\app\package.json"
$pkgContent = @"
{
  "name": "raizel-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "15.5.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "firebase": "^10.4.0"
  },
  "devDependencies": {
    "typescript": "^5.2.0",
    "ts-node": "^10.9.1"
  }
}
"@
# Guardar sin BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($pkgPath, $pkgContent, $utf8NoBom)
Write-Host "✅ package.json corregido y limpio"

# 3️⃣ Instalar dependencias
Write-Host "📦 Instalando dependencias..."
npm install

# 4️⃣ Corregir vulnerabilidades
Write-Host "⚡ Corriendo npm audit fix y actualizando paquetes críticos..."
npm audit fix
npm update undici @firebase/auth @firebase/firestore @firebase/functions @firebase/storage

# 5️⃣ Limpiar posibles BOM en package.json (prevención)
$pkgContentRaw = Get-Content $pkgPath -Raw
$pkgContentClean = $pkgContentRaw -replace "^\uFEFF",""
[System.IO.File]::WriteAllText($pkgPath, $pkgContentClean, $utf8NoBom)

# 6️⃣ Levantar la app en desarrollo
Write-Host "🚀 Levantando la app en modo desarrollo..."
Start-Process "cmd" "/k npm run dev"
Write-Host "🌐 La app debería abrirse en http://localhost:3000 o siguiente puerto disponible"

Write-Host "✅ Mega Setup completado. Raízel / ManadaBook lista para desarrollo."
