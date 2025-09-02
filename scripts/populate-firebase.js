#!/usr/bin/env node

/**
 * Script para poblar Firebase Firestore con datos de ejemplo
 * Ejecuta: node scripts/populate-firebase.js
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} = require('firebase/firestore');

// Configuración Firebase (usando variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de ejemplo para anuncios
const sampleAds = [
  {
    ownerId: 'user-vet-madrid',
    campaignName: 'Promoción Veterinaria Premium',
    adType: 'banner',
    targetAudience: {
      species: ['perro', 'gato'],
      ageRange: ['adulto', 'senior'],
      location: ['Madrid', 'Barcelona'],
      interests: ['salud', 'nutrición']
    },
    budget: 500.00,
    bidType: 'CPM',
    bidAmount: 2.50,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    status: 'active',
    approvalStatus: 'approved',
    impressions: 12500,
    clicks: 234,
    ctr: 0.0187,
    spend: 312.50,
    creative: {
      title: 'Consulta Veterinaria Gratuita',
      description: 'Primera consulta sin costo para tu mascota',
      imageUrl: 'https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?w=400',
      ctaText: 'Reservar Ahora',
      landingUrl: 'https://vet-clinic.com/promo'
    },
    ownerUsername: 'vet_clinic_madrid',
    ownerVerified: true
  },
  {
    ownerId: 'user-refuge-valencia',
    campaignName: 'Adopción de Mascotas',
    adType: 'story',
    targetAudience: {
      species: ['perro', 'gato'],
      ageRange: ['cachorro', 'joven'],
      location: ['Valencia', 'Sevilla'],
      interests: ['adopción', 'rescate']
    },
    budget: 300.00,
    bidType: 'CPC',
    bidAmount: 1.20,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-25'),
    status: 'active',
    approvalStatus: 'approved',
    impressions: 8900,
    clicks: 156,
    ctr: 0.0175,
    spend: 187.20,
    creative: {
      title: 'Adopta un Amigo para Siempre',
      description: 'Mascotas rescatadas buscando un hogar amoroso',
      imageUrl: 'https://images.unsplash.com/photo-1601758228041-3caa3d3d3c1c?w=400',
      ctaText: 'Ver Mascotas',
      landingUrl: 'https://refugio.org/adopciones'
    },
    ownerUsername: 'refugio_animales',
    ownerVerified: true
  },
  {
    ownerId: 'user-petstore-premium',
    campaignName: 'Productos Premium para Mascotas',
    adType: 'feed',
    targetAudience: {
      species: ['perro', 'gato'],
      ageRange: ['adulto'],
      location: ['Barcelona', 'Madrid'],
      interests: ['premium', 'nutrición']
    },
    budget: 1000.00,
    bidType: 'CPM',
    bidAmount: 3.00,
    startDate: new Date('2024-01-05'),
    endDate: new Date('2024-02-05'),
    status: 'paused',
    approvalStatus: 'approved',
    impressions: 15600,
    clicks: 289,
    ctr: 0.0185,
    spend: 468.00,
    creative: {
      title: 'Alimento Premium 20% OFF',
      description: 'La mejor nutrición para tu mascota con descuento especial',
      imageUrl: 'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?w=400',
      ctaText: 'Comprar Ahora',
      landingUrl: 'https://petstore.com/premium-offer'
    },
    ownerUsername: 'pet_store_premium',
    ownerVerified: false
  }
];

// Datos de ejemplo para usuarios
const sampleUsers = [
  {
    id: 'user-vet-madrid',
    username: 'vet_clinic_madrid',
    email: 'contacto@vetmadrid.com',
    displayName: 'Clínica Veterinaria Madrid',
    isVerified: true
  },
  {
    id: 'user-refuge-valencia',
    username: 'refugio_animales',
    email: 'info@refugiovalencia.org',
    displayName: 'Refugio de Animales Valencia',
    isVerified: true
  },
  {
    id: 'user-petstore-premium',
    username: 'pet_store_premium',
    email: 'ventas@petstores.com',
    displayName: 'Pet Store Premium',
    isVerified: false
  }
];

// Datos de ejemplo para sponsors
const sampleSponsors = [
  {
    name: 'Veterinaria San Francisco',
    logoUrl: '/images/sponsor1.png',
    websiteUrl: 'https://vetsanfrancisco.com',
    description: 'Clínica veterinaria especializada en medicina preventiva'
  },
  {
    name: 'Pet Food Express',
    logoUrl: '/images/sponsor2.png', 
    websiteUrl: 'https://petfoodexpress.com',
    description: 'Alimentos premium y naturales para mascotas'
  }
];

async function populateFirestore() {
  console.log('🔥 Iniciando población de Firestore...\n');

  try {
    // Poblar usuarios
    console.log('👥 Agregando usuarios de ejemplo...');
    for (const user of sampleUsers) {
      await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Usuario creado: ${user.username}`);
    }

    // Poblar anuncios
    console.log('\n📢 Agregando anuncios de ejemplo...');
    for (const ad of sampleAds) {
      await addDoc(collection(db, 'ads'), {
        ...ad,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ Anuncio creado: ${ad.campaignName}`);
    }

    // Poblar sponsors
    console.log('\n🤝 Agregando sponsors de ejemplo...');
    for (const sponsor of sampleSponsors) {
      await addDoc(collection(db, 'sponsors'), sponsor);
      console.log(`✅ Sponsor creado: ${sponsor.name}`);
    }

    console.log('\n🎉 ¡Firebase poblado exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`- ${sampleUsers.length} usuarios`);
    console.log(`- ${sampleAds.length} anuncios`);
    console.log(`- ${sampleSponsors.length} sponsors`);

  } catch (error) {
    console.error('❌ Error poblando Firestore:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Verificar configuración
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error('❌ Error: Variables de entorno de Firebase no configuradas');
  console.log('Por favor configura tu archivo .env.local con las credenciales de Firebase');
  process.exit(1);
}

// Ejecutar
populateFirestore();