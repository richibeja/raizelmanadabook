# -----------------------------
# Mega Setup Raízel / ManadaBook
# -----------------------------
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Write-Host '✅ Levantando la app en modo desarrollo...'
cd 'C:\Users\ALP\Documents\raizel\app'

# Instalar dependencias
npm install

# Construir y levantar la app en dev
npm run dev
Start-Process 'http://localhost:3000'
Write-Host '🌐 Navegador abierto en http://localhost:3000'