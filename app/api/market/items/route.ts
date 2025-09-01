import { NextRequest, NextResponse } from 'next/server';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de items del marketplace
  const mockItems = [
    {
      id: '1',
      seller_id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Collar Premium para Perros',
      description: 'Collar de cuero genuino con hebilla de acero inoxidable. Ideal para perros medianos y grandes.',
      price: 45.99,
      currency: 'EUR',
      category: 'accesorios',
      subcategory: 'collares',
      condition: 'nuevo',
      brand: 'PetLuxury',
      photos: [
        'https://example.com/market/collar-1.jpg',
        'https://example.com/market/collar-2.jpg',
        'https://example.com/market/collar-3.jpg'
      ],
      location: 'Madrid, España',
      shipping_info: {
        method: 'correo_express',
        cost: 5.99,
        estimated_days: '2-3 días'
      },
      status: 'active',
      views_count: 156,
      likes_count: 23,
      created_at: new Date('2024-01-10T09:30:00Z'),
      updated_at: new Date('2024-01-15T14:20:00Z'),
      seller_username: 'pet_store_madrid',
      seller_verified: true,
      seller_rating: 4.8,
      seller_reviews_count: 156
    },
    {
      id: '2',
      seller_id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Adopción: Luna - Gata Siamés',
      description: 'Luna es una gata siamesa de 2 años, muy cariñosa y juguetona. Buscamos una familia responsable.',
      price: 0,
      currency: 'EUR',
      category: 'adopcion',
      subcategory: 'gatos',
      condition: 'usado',
      brand: null,
      photos: [
        'https://example.com/market/luna-1.jpg',
        'https://example.com/market/luna-2.jpg'
      ],
      location: 'Barcelona, España',
      shipping_info: {
        method: 'recogida_local',
        cost: 0,
        estimated_days: 'Acuerdo mutuo'
      },
      status: 'active',
      views_count: 89,
      likes_count: 45,
      created_at: new Date('2024-01-12T11:15:00Z'),
      updated_at: new Date('2024-01-15T16:45:00Z'),
      seller_username: 'refugio_animales_bcn',
      seller_verified: true,
      seller_rating: 4.9,
      seller_reviews_count: 234
    },
    {
      id: '3',
      seller_id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Alimento Premium para Gatos',
      description: 'Alimento premium para gatos adultos, rico en proteínas y sin cereales. 5kg.',
      price: 29.99,
      currency: 'EUR',
      category: 'alimentacion',
      subcategory: 'gatos',
      condition: 'nuevo',
      brand: 'NutriCat',
      photos: [
        'https://example.com/market/food-1.jpg',
        'https://example.com/market/food-2.jpg'
      ],
      location: 'Valencia, España',
      shipping_info: {
        method: 'correo_estandar',
        cost: 3.99,
        estimated_days: '3-5 días'
      },
      status: 'active',
      views_count: 234,
      likes_count: 67,
      created_at: new Date('2024-01-08T10:45:00Z'),
      updated_at: new Date('2024-01-15T12:30:00Z'),
      seller_username: 'pet_supplies_val',
      seller_verified: false,
      seller_rating: 4.2,
      seller_reviews_count: 89
    }
  ];

  return {
    rows: mockItems,
    rowCount: mockItems.length
  };
}

// GET - Obtener items del marketplace (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const sellerId = searchParams.get('seller_id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        mi.id,
        mi.seller_id,
        mi.title,
        mi.description,
        mi.price,
        mi.currency,
        mi.category,
        mi.subcategory,
        mi.condition,
        mi.brand,
        mi.photos,
        mi.location,
        mi.shipping_info,
        mi.status,
        mi.views_count,
        mi.likes_count,
        mi.created_at,
        mi.updated_at,
        u.username as seller_username,
        u.is_verified as seller_verified,
        u.rating as seller_rating,
        u.reviews_count as seller_reviews_count
      FROM marketplace_items mi
      LEFT JOIN users u ON mi.seller_id = u.id
      WHERE mi.status = 'active'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filtrar por categoría
    if (category) {
      sqlQuery += ` AND mi.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Filtrar por subcategoría
    if (subcategory) {
      sqlQuery += ` AND mi.subcategory = $${paramIndex}`;
      params.push(subcategory);
      paramIndex++;
    }

    // Filtrar por condición
    if (condition) {
      sqlQuery += ` AND mi.condition = $${paramIndex}`;
      params.push(condition);
      paramIndex++;
    }

    // Filtrar por rango de precio
    if (minPrice) {
      sqlQuery += ` AND mi.price >= $${paramIndex}`;
      params.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      sqlQuery += ` AND mi.price <= $${paramIndex}`;
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // Filtrar por ubicación
    if (location) {
      sqlQuery += ` AND mi.location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    // Filtrar por vendedor
    if (sellerId) {
      sqlQuery += ` AND mi.seller_id = $${paramIndex}`;
      params.push(sellerId);
      paramIndex++;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const items = result.rows;

    // Aplicar filtros simulados
    let filteredItems = [...items];

    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    if (subcategory) {
      filteredItems = filteredItems.filter(item => item.subcategory === subcategory);
    }

    if (condition) {
      filteredItems = filteredItems.filter(item => item.condition === condition);
    }

    if (minPrice) {
      filteredItems = filteredItems.filter(item => item.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filteredItems = filteredItems.filter(item => item.price <= parseFloat(maxPrice));
    }

    if (location) {
      const locationLower = location.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.location.toLowerCase().includes(locationLower)
      );
    }

    if (sellerId) {
      filteredItems = filteredItems.filter(item => item.seller_id === sellerId);
    }

    // Búsqueda por texto
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        (item.brand && item.brand.toLowerCase().includes(searchLower))
      );
    }

    // Ordenar items
    filteredItems.sort((a, b) => {
      let aValue: any = a[sort as keyof typeof a];
      let bValue: any = b[sort as keyof typeof b];

      if (sort === 'created_at' || sort === 'updated_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (order === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    // Aplicar paginación
    const total = filteredItems.length;
    const paginatedItems = filteredItems.slice(offset, offset + limit);

    // Calcular estadísticas
    const stats = {
      total: total,
      categories: [...new Set(filteredItems.map(item => item.category))],
      price_range: {
        min: Math.min(...filteredItems.map(item => item.price)),
        max: Math.max(...filteredItems.map(item => item.price)),
        avg: filteredItems.reduce((sum, item) => sum + item.price, 0) / filteredItems.length
      },
      total_views: filteredItems.reduce((sum, item) => sum + (item.views_count || 0), 0),
      total_likes: filteredItems.reduce((sum, item) => sum + (item.likes_count || 0), 0)
    };

    return NextResponse.json({
      success: true,
      data: {
        items: paginatedItems,
        stats,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo item del marketplace (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { title, description, price, category, subcategory, condition, photos, location } = body;
    
    if (!title || !description || price === undefined || !category || !subcategory || !condition || !photos || !location) {
      return NextResponse.json(
        { success: false, error: 'All fields are required: title, description, price, category, subcategory, condition, photos, location' },
        { status: 400 }
      );
    }

    // Validar precio
    if (price < 0) {
      return NextResponse.json(
        { success: false, error: 'Price cannot be negative' },
        { status: 400 }
      );
    }

    // Validar fotos
    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one photo is required' },
        { status: 400 }
      );
    }

    // Simular creación de item
    const newItem = {
      id: Date.now().toString(),
      seller_id: body.seller_id || 'current-user-id',
      title,
      description,
      price: parseFloat(price),
      currency: body.currency || 'EUR',
      category,
      subcategory,
      condition,
      brand: body.brand || null,
      photos,
      location,
      shipping_info: body.shipping_info || {
        method: 'correo_estandar',
        cost: 0,
        estimated_days: '3-5 días'
      },
      status: 'active',
      views_count: 0,
      likes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      seller_username: 'usuario_actual',
      seller_verified: false,
      seller_rating: 0,
      seller_reviews_count: 0
    };

    console.log('Marketplace item created (simulated):', newItem);

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating marketplace item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
