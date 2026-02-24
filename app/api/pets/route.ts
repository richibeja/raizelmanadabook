import { NextRequest, NextResponse } from 'next/server';
import { 
  db,
  COLLECTIONS,
  createPet,
  Pet as FirebasePet,
  toDate
} from '@/lib/firebase';
import { 
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  QueryConstraint
} from 'firebase/firestore';
import { requireAuth } from '@/lib/jwt';

// Función para mapear Firebase Pet a formato legacy
function mapFirebasePetToLegacy(firebasePet: FirebasePet): any {
  const age = firebasePet.birthDate 
    ? Math.floor((new Date().getTime() - firebasePet.birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365))
    : 1;

  return {
    id: firebasePet.id,
    name: firebasePet.name,
    species: firebasePet.species === 'dog' ? 'Perro' : firebasePet.species === 'cat' ? 'Gato' : 'Otro',
    breed: firebasePet.breed || '',
    date_of_birth: firebasePet.birthDate?.toISOString().split('T')[0] || '',
    gender: firebasePet.gender || 'indefinido',
    weight: firebasePet.weight || 0,
    color: '', // Placeholder
    bio: firebasePet.bio || '',
    avatar_url: firebasePet.photoURL || '',
    is_sterilized: firebasePet.medicalInfo?.spayed || false,
    vaccines: firebasePet.medicalInfo?.allergies || [],
    medical_notes: firebasePet.medicalInfo?.conditions?.join(', ') || '',
    privacy_level: firebasePet.isPublic ? 'public' : 'private',
    created_at: firebasePet.createdAt.toISOString(),
    updated_at: firebasePet.updatedAt.toISOString(),
    owner_username: 'usuario', // TODO: Join with user profile
    followers_count: firebasePet.stats.followersCount,
    posts_count: firebasePet.stats.postsCount,
    age_years: age,
    age_months: 0, // Simplified
    age_estimated: `${age} años`,
    personality: firebasePet.bio || 'Personalidad única',
    interests: [], // Placeholder
    pet_location: '', // Placeholder
    microchip: '', // TODO: Add to schema
    adoption_date: firebasePet.createdAt.toISOString().split('T')[0],
    special_needs: firebasePet.medicalInfo?.allergies?.join(', ') || '',
    favorite_food: 'Raízel BARF',
    favorite_activities: 'Jugar y ejercitarse'
  };
}

// GET - Obtener mascotas desde Firebase (tiempo real compatible)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('owner_id');
    const species = searchParams.get('species');
    const search = searchParams.get('search');
    const limitParam = parseInt(searchParams.get('limit') || '20');

    // Construir query Firebase
    const constraints: QueryConstraint[] = [];
    
    // Filtros
    if (ownerId) {
      constraints.push(where('ownerId', '==', ownerId));
    } else {
      // Solo pets públicos por defecto  
      constraints.push(where('isPublic', '==', true));
    }
    
    if (species && species !== 'all') {
      const speciesMap: any = {
        'Perro': 'dog',
        'Gato': 'cat',
        'perro': 'dog', 
        'gato': 'cat'
      };
      const firebaseSpecies = speciesMap[species] || species;
      constraints.push(where('species', '==', firebaseSpecies));
    }
    
    // Ordenar y limitar
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(firestoreLimit(limitParam));

    const petsQuery = query(collection(db, COLLECTIONS.PETS), ...constraints);
    const querySnapshot = await getDocs(petsQuery);

    // Convertir documentos Firebase a objetos Pet
    const firebasePets: FirebasePet[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        birthDate: data.birthDate ? toDate(data.birthDate) : undefined,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt)
      } as FirebasePet;
    });

    // Mapear a formato legacy para compatibilidad
    let legacyPets = firebasePets.map(mapFirebasePetToLegacy);

    // Aplicar búsqueda textual
    if (search) {
      const searchTerm = search.toLowerCase();
      legacyPets = legacyPets.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm) ||
        pet.breed.toLowerCase().includes(searchTerm) ||
        pet.bio.toLowerCase().includes(searchTerm)
      );
    }
    
    return NextResponse.json({
      success: true,
      data: legacyPets,
      total: legacyPets.length,
      source: 'firebase',
      pagination: {
        limit: limitParam,
        offset: 0,
        hasMore: legacyPets.length === limitParam
      }
    });

  } catch (error) {
    console.error('Error fetching pets from Firebase:', error);
    
    // Fallback a mock data si Firebase no disponible
    const mockPets = [
      {
        id: '1',
        name: 'Luna',
        species: 'Gato',
        breed: 'Siamés', 
        date_of_birth: '2020-03-15',
        gender: 'hembra',
        weight: 4.2,
        color: 'Crema con puntos marrones',
        bio: 'Luna es una gata muy cariñosa que ama los productos Raízel.',
        avatar_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
        is_sterilized: true,
        vaccines: ['Triple felina', 'Leucemia felina', 'Rabia'],
        medical_notes: 'Saludable con dieta Raízel BARF',
        privacy_level: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner_username: 'maria_garcia',
        followers_count: 1247,
        posts_count: 89,
        age_years: 3,
        age_months: 8,
        age_estimated: '3 años y 8 meses',
        personality: 'Juguetona y cariñosa',
        interests: ['Dormir', 'Jugar con láser', 'Cepillado'],
        pet_location: 'Bogotá, Colombia',
        favorite_food: 'Raízel BARF especial para gatos',
        favorite_activities: 'Perseguir juguetes y dormir al sol'
      },
      {
        id: '2',
        name: 'Max',
        species: 'Perro',
        breed: 'Golden Retriever',
        date_of_birth: '2019-07-10',
        gender: 'macho',
        weight: 32.5,
        color: 'Dorado',
        bio: 'Max es un golden muy activo que ama los productos Raízel y los helados especiales.',
        avatar_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        is_sterilized: true,
        vaccines: ['Quintuple', 'Rabia', 'Tos de las perreras'],
        medical_notes: 'Excelente salud con dieta Raízel BARF',
        privacy_level: 'public',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner_username: 'carlos_rodriguez',
        followers_count: 2156,
        posts_count: 156,
        age_years: 4,
        age_months: 3,
        age_estimated: '4 años y 3 meses',
        personality: 'Activo y leal',
        interests: ['Correr', 'Nadar', 'Jugar pelota'],
        pet_location: 'Medellín, Colombia',
        favorite_food: 'Raízel BARF Res + Choribarf de premio',
        favorite_activities: 'Correr en el parque y nadar'
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: mockPets,
      total: mockPets.length,
      source: 'mock',
      message: 'Datos de ejemplo - Firebase no disponible'
    });
  }
}

// POST - Crear nueva mascota en Firebase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { name, species, breed, birthDate, gender, weight, bio, isPublic = true } = body;
    
    if (!name || !species) {
      return NextResponse.json(
        { success: false, error: 'Nombre y especie son requeridos' },
        { status: 400 }
      );
    }

    // Verificar autenticación (opcional - puede usar Firebase Auth)
    // const auth = requireAuth(request);
    // const ownerId = auth?.uid || 'anonymous-user';
    const ownerId = body.owner_id || 'current-user'; // TODO: Get from auth

    // Crear mascota en Firebase
    const petData = {
      name,
      species: species.toLowerCase(),
      breed: breed || '',
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gender: gender || undefined,
      weight: weight ? parseFloat(weight) : undefined,
      bio: bio || '',
      isPublic,
      ownerId,
      photoURL: body.photoURL || '',
      medicalInfo: {
        vaccinated: body.vaccinated || false,
        spayed: body.spayed || false,
        allergies: body.allergies || [],
        conditions: body.conditions || []
      },
      stats: {
        followersCount: 0,
        postsCount: 0
      }
    };

    const petId = await createPet(petData);
    
    // Convertir a formato legacy para respuesta
    const newPet = mapFirebasePetToLegacy({
      id: petId,
      ...petData,
      createdAt: new Date(),
      updatedAt: new Date()
    } as FirebasePet);

    return NextResponse.json({
      success: true,
      data: newPet,
      message: 'Mascota creada exitosamente en ManadaBook'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating pet:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}