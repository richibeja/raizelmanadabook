import { NextRequest, NextResponse } from 'next/server';
import {
  subscribeToMarketplaceItems,
  createMarketplaceItem,
  MarketplaceItem,
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

// GET - Obtener artículos marketplace desde Firebase
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const sellerId = searchParams.get('seller_id');
    const limitParam = parseInt(searchParams.get('limit') || '20');

    // Construir query Firebase
    const constraints: QueryConstraint[] = [];
    
    // Solo items activos
    constraints.push(where('status', '==', 'active'));
    
    // Filtros
    if (category && category !== 'all') {
      constraints.push(where('category', '==', category));
    }
    
    if (city) {
      constraints.push(where('location.city', '==', city));
    }
    
    if (sellerId) {
      constraints.push(where('sellerId', '==', sellerId));
    }
    
    // Ordenar y limitar
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(firestoreLimit(limitParam));

    const itemsQuery = query(collection(db, COLLECTIONS.MARKETPLACE), ...constraints);
    const querySnapshot = await getDocs(itemsQuery);

    // Convertir documentos Firebase
    let items: MarketplaceItem[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        soldAt: data.soldAt ? toDate(data.soldAt) : undefined
      } as MarketplaceItem;
    });

    // Aplicar filtros de precio localmente
    if (priceMin) {
      const minPrice = parseFloat(priceMin);
      items = items.filter(item => item.price >= minPrice);
    }
    if (priceMax) {
      const maxPrice = parseFloat(priceMax);
      items = items.filter(item => item.price <= maxPrice);
    }

    // Aplicar búsqueda textual
    if (search) {
      const searchTerm = search.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    return NextResponse.json({
      success: true,
      data: items,
      total: items.length,
      source: 'firebase'
    });

  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    
    // Fallback mock data
    const mockItems: MarketplaceItem[] = [
      {
        id: '1',
        sellerId: 'user1',
        title: 'Comedero Automático Smart Feeder',
        description: 'Comedero inteligente para mascotas con timer y app móvil. Perfecto para controlar las porciones de comida Raízel.',
        category: 'accessories',
        price: 85000,
        currency: 'COP',
        condition: 'like-new',
        photos: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=400&fit=crop'],
        location: {
          city: 'Bogotá',
          country: 'Colombia'
        },
        shipping: {
          available: true,
          cost: 8000,
          methods: ['Envío express', 'Recogida en punto']
        },
        status: 'active',
        stats: {
          viewsCount: 247,
          favoritesCount: 18,
          inquiriesCount: 5
        },
        tags: ['comedero', 'automatico', 'smart', 'raízel'],
        isPromoted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        sellerId: 'user2',
        title: 'Cama Ortopédica para Perros Grandes',
        description: 'Cama premium con espuma memory foam. Ideal para perros que siguen dieta BARF y necesitan descanso reparador.',
        category: 'accessories',
        price: 120000,
        currency: 'COP',
        condition: 'new',
        photos: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=400&fit=crop'],
        location: {
          city: 'Medellín',
          country: 'Colombia'
        },
        shipping: {
          available: true,
          cost: 15000,
          methods: ['Envío nacional']
        },
        status: 'active',
        stats: {
          viewsCount: 89,
          favoritesCount: 7,
          inquiriesCount: 3
        },
        tags: ['cama', 'ortopedica', 'perros', 'grandes'],
        isPromoted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: mockItems,
      total: mockItems.length,
      source: 'mock',
      message: 'Datos de ejemplo - Firebase no disponible'
    });
  }
}

// POST - Crear nuevo artículo marketplace
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { title, description, category, price, currency = 'COP', condition, photos, city, country } = body;
    
    if (!title || !description || !category || !price || !photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'Título, descripción, categoría, precio y al menos una foto son requeridos' },
        { status: 400 }
      );
    }

    // TODO: Obtener sellerId del auth
    const sellerId = body.sellerId || 'current-user';

    // Preparar datos del artículo
    const itemData = {
      sellerId,
      title,
      description,
      category,
      subcategory: body.subcategory || '',
      price: parseFloat(price),
      currency,
      condition,
      photos: Array.isArray(photos) ? photos : [photos],
      location: {
        city: city || 'Colombia',
        country: country || 'Colombia',
        zipCode: body.zipCode || undefined
      },
      shipping: {
        available: body.shippingAvailable || false,
        cost: body.shippingCost ? parseFloat(body.shippingCost) : undefined,
        methods: body.shippingMethods || []
      },
      status: 'active' as const,
      tags: body.tags || [],
      specifications: body.specifications || {},
      relatedPets: body.relatedPets || [],
      isPromoted: false
    };

    // Crear artículo en Firebase
    const itemId = await createMarketplaceItem(itemData);
    
    // Convertir para respuesta
    const newItem = {
      id: itemId,
      ...itemData,
      sellerId,
      stats: {
        viewsCount: 0,
        favoritesCount: 0,
        inquiriesCount: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Artículo creado exitosamente en ManadaBook Marketplace'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating marketplace item:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}