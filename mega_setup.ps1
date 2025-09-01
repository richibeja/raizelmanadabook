C:\Users\ALP\Documents\raizel\mega_setup.ps1
# ===========================
# Mega Script Raízel
# ===========================

# ---------------------------
# 1️⃣ Configuración Firebase
# ---------------------------
$firebaseConfigFile = "C:\Users\ALP\Documents\raizel\app\firebaseConfig.ts"

# Reemplaza estos valores con tus datos reales de Firebase
$apiKey = "TU_API_KEY"
$authDomain = "TU_AUTH_DOMAIN"
$projectId = "TU_PROJECT_ID"
$storageBucket = "TU_STORAGE_BUCKET"
$messagingSenderId = "TU_MESSAGING_SENDER_ID"
$appId = "TU_APP_ID"

$firebaseContent = @"
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: '$apiKey',
  authDomain: '$authDomain',
  projectId: '$projectId',
  storageBucket: '$storageBucket',
  messagingSenderId: '$messagingSenderId',
  appId: '$appId'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
"@

[System.IO.File]::WriteAllText($firebaseConfigFile, $firebaseContent, [System.Text.Encoding]::UTF8)
Write-Host "✅ firebaseConfig.ts actualizado con tus datos reales"

# ---------------------------
# 2️⃣ Migrar posts y usuarios
# ---------------------------
cd "C:\Users\ALP\Documents\raizel\app"

Write-Host "🚀 Migrando posts..."
npx ts-node migratePosts.ts
Write-Host "✅ Posts migrados a Firebase"

Write-Host "🚀 Migrando usuarios..."
npx ts-node migrateUsers.ts
Write-Host "✅ Usuarios migrados a Firebase"

# ---------------------------
# 3️⃣ Finalización
# ---------------------------
Write-Host "🎉 ¡Todo listo! Raízel / ManadaBook ahora está conectado a Firebase y listo para producción."
