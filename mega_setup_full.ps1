# ==============================
# Mega Setup PowerShell: Raízel / ManadaBook
# ==============================

$baseDir = "C:\Users\ALP\Documents\raizel\app"
cd $baseDir

# -----------------------------
# 1️⃣ Crear package.json con scripts y dependencias
# -----------------------------
$packageJsonPath = Join-Path $baseDir "package.json"
$packageJsonContent = @"
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
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.0.0"
  },
  "devDependencies": {
    "typescript": "^5.1.0",
    "ts-node": "^10.9.2"
  }
}
"@
[System.IO.File]::WriteAllText($packageJsonPath, $packageJsonContent, [System.Text.Encoding]::UTF8)
Write-Host "✅ package.json creado / actualizado"

# -----------------------------
# 2️⃣ Instalar dependencias
# -----------------------------
Write-Host "⏳ Instalando dependencias..."
npm install

# -----------------------------
# 3️⃣ Crear carpetas para imágenes y videos si no existen
# -----------------------------
$imagesDir = Join-Path $baseDir "..\public\images"
$mediaDir  = Join-Path $baseDir "..\public\media"
if (-not (Test-Path $imagesDir)) { New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null }
if (-not (Test-Path $mediaDir)) { New-Item -ItemType Directory -Force -Path $mediaDir | Out-Null }

# -----------------------------
# 4️⃣ Descargar imágenes de prueba
# -----------------------------
$exampleImages = @{
    "logo.png"      = "https://via.placeholder.com/200x50?text=Raizel+Logo"
    "sponsor1.png"  = "https://via.placeholder.com/150x50?text=Sponsor+1"
    "sponsor2.png"  = "https://via.placeholder.com/150x50?text=Sponsor+2"
    "pet1.png"      = "https://via.placeholder.com/200x200?text=Mascota+1"
    "product1.png"  = "https://via.placeholder.com/200x200?text=Producto+1"
    "post1.png"     = "https://via.placeholder.com/400x300?text=Post+1"
    "post2.png"     = "https://via.placeholder.com/400x300?text=Post+2"
    "story1.png"    = "https://via.placeholder.com/400x700?text=Story+1"
    "story2.png"    = "https://via.placeholder.com/400x700?text=Story+2"
}
foreach ($imgName in $exampleImages.Keys) {
    $imgPath = Join-Path $imagesDir $imgName
    if (-not (Test-Path $imgPath)) {
        try { Invoke-WebRequest -Uri $exampleImages[$imgName] -OutFile $imgPath; Write-Host "✅ Imagen descargada: $imgName" }
        catch { Write-Host "⚠️ Error descargando $imgName, agregar manualmente" }
    }
}

# -----------------------------
# 5️⃣ Descargar videos de prueba
# -----------------------------
$exampleVideos = @{
    "video1.mp4" = "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4"
    "video2.mp4" = "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4"
}
foreach ($vid in $exampleVideos.Keys) {
    $vidPath = Join-Path $mediaDir $vid
    if (-not (Test-Path $vidPath)) {
        try { Invoke-WebRequest -Uri $exampleVideos[$vid] -OutFile $vidPath; Write-Host "✅ Video descargado: $vid" }
        catch { Write-Host "⚠️ Error descargando $vid, agregar manualmente" }
    }
}

# -----------------------------
# 6️⃣ Levantar la app en modo desarrollo
# -----------------------------
Write-Host "🚀 Levantando Raízel / ManadaBook en modo desarrollo..."
npm run dev
