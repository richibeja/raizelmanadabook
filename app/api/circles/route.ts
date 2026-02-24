import { NextRequest, NextResponse } from 'next/server';
import {
  subscribeToCircles,
  createCircle,
  Circle as FirebaseCircle,
  COLLECTIONS,
  db,
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

// Mapear Firebase Circle a formato legacy
function mapFirebaseCircleToLegacy(firebaseCircle: FirebaseCircle): any {
  return {
    id: firebaseCircle.id,
    name: firebaseCircle.name,
    slug: firebaseCircle.name.toLowerCase().replace(/\s+/g, '-'),
    description: firebaseCircle.description,
    avatar_url: firebaseCircle.photoURL || null,
    cover_url: firebaseCircle.coverURL || null,
    type: firebaseCircle.isPrivate ? 'private' : 'public',
    category: firebaseCircle.tags[0] || 'general',
    location: firebaseCircle.location ? `${firebaseCircle.location.city}, ${firebaseCircle.location.country}` : null,
    tags: firebaseCircle.tags,
    rules: firebaseCircle.rules?.join('\n') || '',
    admin_id: firebaseCircle.createdBy,
    moderator_ids: [], // TODO: Get from members
    member_count: firebaseCircle.stats.membersCount,
    post_count: firebaseCircle.stats.postsCount,
    is_featured: firebaseCircle.tags.includes('featured'),
    is_verified: firebaseCircle.tags.includes('verified'),
    status: 'active',
    settings: firebaseCircle.settings,
    created_at: firebaseCircle.createdAt.toISOString(),
    updated_at: firebaseCircle.updatedAt.toISOString(),
    admin_username: 'usuario' // TODO: Join with user profile
  };
}

// GET - Obtener círculos desde Firebase
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const limitParam = parseInt(searchParams.get('limit') || '20');
    const featured = searchParams.get('featured');

    // Construir query Firebase
    const constraints: QueryConstraint[] = [];
    
    // Filtros básicos
    if (type === 'private') {
      constraints.push(where('isPrivate', '==', true));
    } else {
      constraints.push(where('isPrivate', '==', false)); // Público por defecto
    }
    
    if (city) {
      constraints.push(where('location.city', '==', city));
    }
    
    if (category) {
      constraints.push(where('tags', 'array-contains', category.toLowerCase()));
    }
    
    if (featured === 'true') {
      constraints.push(where('tags', 'array-contains', 'featured'));
    }
    
    // Ordenar y limitar
    constraints.push(orderBy('stats.membersCount', 'desc'));
    constraints.push(firestoreLimit(limitParam));

    const circlesQuery = query(collection(db, COLLECTIONS.CIRCLES), ...constraints);
    const querySnapshot = await getDocs(circlesQuery);

    // Convertir documentos Firebase
    const firebaseCircles: FirebaseCircle[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt)
      } as FirebaseCircle;
    });

    // Mapear a formato legacy
    let legacyCircles = firebaseCircles.map(mapFirebaseCircleToLegacy);

    // Aplicar búsqueda textual (local)
    if (search) {
      const searchTerm = search.toLowerCase();
      legacyCircles = legacyCircles.filter(circle => 
        circle.name.toLowerCase().includes(searchTerm) ||
        circle.description.toLowerCase().includes(searchTerm) ||
        circle.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    return NextResponse.json({
      circles: legacyCircles,
      total: legacyCircles.length,
      limit: limitParam,
      offset: 0,
      hasMore: legacyCircles.length === limitParam,
      source: 'firebase'
    });

  } catch (error) {
    console.error('Error fetching circles from Firebase:', error);
    
    // Fallback a mock data
    const mockCircles = [
      {
        id: '1',
        name: 'Amantes de Perros Bogotá',
        slug: 'amantes-de-perros-bogota',
        description: 'Comunidad para todos los amantes de los perros en Bogotá. Comparte experiencias con productos Raízel.',
        avatar_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        cover_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
        type: 'public',
        category: 'Perros',
        location: 'Bogotá, Colombia',
        tags: ['perros', 'mascotas', 'bogota', 'raizel'],
        rules: '1. Respeta a todos los miembros\n2. Comparte experiencias con productos Raízel\n3. Mantén el contenido apropiado',
        admin_id: '1',
        moderator_ids: [],
        member_count: 1247,
        post_count: 89,
        is_featured: true,
        is_verified: true,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        admin_username: 'maria_garcia'
      },
      {
        id: '2', 
        name: 'Gatos Medellín BARF',
        slug: 'gatos-medellin-barf',
        description: 'Para gatos urbanos y alimentación BARF. Consejos sobre productos Raízel para felinos.',
        avatar_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
        cover_url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&h=400&fit=crop',
        type: 'public',
        category: 'Gatos',
        location: 'Medellín, Colombia',
        tags: ['gatos', 'barf', 'medellin', 'raizel'],
        rules: '1. Solo contenido relacionado con gatos\n2. Fomentar alimentación natural Raízel',
        admin_id: '2',
        moderator_ids: [],
        member_count: 892,
        post_count: 156,
        is_featured: false,
        is_verified: true,
        status: 'active',
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        admin_username: 'carlos_rodriguez'
      }
    ];
    
    return NextResponse.json({
      circles: mockCircles,
      total: mockCircles.length,
      source: 'mock',
      message: 'Datos de ejemplo - Firebase no disponible'
    });
  }
}

// POST - Crear nuevo círculo en Firebase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación campos requeridos
    const { name, description, category, isPrivate = false, city, country, tags, rules } = body;
    
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Nombre y descripción son requeridos' },
        { status: 400 }
      );
    }

    // TODO: Obtener userId del auth
    const createdBy = body.userId || 'current-user';

    // Preparar datos del círculo
    const circleData = {
      name,
      description,
      photoURL: body.photoURL || '',
      coverURL: body.coverURL || '',
      isPrivate,
      requiresApproval: isPrivate,
      location: (city && country) ? { city, country } : undefined,
      tags: [category?.toLowerCase(), ...(tags || [])].filter(Boolean),
      rules: rules ? [rules] : [],
      settings: {
        allowPosts: true,
        allowEvents: true,
        allowMarketplace: true
      },
      createdBy
    };

    // Crear círculo en Firebase
    const circleId = await createCircle(circleData);
    
    // Convertir a formato legacy para respuesta
    const newCircle = mapFirebaseCircleToLegacy({
      id: circleId,
      ...circleData,
      stats: {
        membersCount: 1,
        postsCount: 0,
        activeMembers: 1
      },
      createdAt: new Date(),
      updatedAt: new Date()
    } as FirebaseCircle);

    return NextResponse.json({
      success: true,
      data: newCircle,
      message: 'Círculo creado exitosamente en ManadaBook'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating circle:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}