import { NextRequest, NextResponse } from 'next/server';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de círculos
  const mockCircles = [
    {
      id: '1',
      name: 'Amantes de Perros',
      slug: 'amantes-de-perros',
      description: 'Comunidad para todos los amantes de los perros. Comparte fotos, consejos y experiencias.',
      avatar_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face',
      cover_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
      type: 'public',
      category: 'Perros',
      location: 'Madrid, España',
      tags: ['perros', 'mascotas', 'comunidad'],
      rules: '1. Respeta a todos los miembros\n2. No spam\n3. Mantén el contenido apropiado',
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
      name: 'Gatos de la Ciudad',
      slug: 'gatos-de-la-ciudad',
      description: 'Para los gatos urbanos y sus humanos. Consejos para gatos de apartamento.',
      avatar_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=face',
      cover_url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&h=400&fit=crop',
      type: 'public',
      category: 'Gatos',
      location: 'Barcelona, España',
      tags: ['gatos', 'urbano', 'apartamento'],
      rules: '1. Solo contenido relacionado con gatos\n2. No promoción comercial sin autorización',
      admin_id: '1',
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

  return {
    rows: mockCircles,
    rowCount: mockCircles.length
  };
}

// GET - Obtener todos los círculos (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured');

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.avatar_url,
        c.cover_url,
        c.type,
        c.category,
        c.location,
        c.tags,
        c.rules,
        c.admin_id,
        c.moderator_ids,
        c.member_count,
        c.post_count,
        c.is_featured,
        c.is_verified,
        c.status,
        c.settings,
        c.created_at,
        c.updated_at,
        u.first_name,
        u.last_name,
        u.username as admin_username
      FROM circles c
      LEFT JOIN users u ON c.admin_id = u.id
      WHERE c.status = 'active'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filtrar por categoría
    if (category) {
      sqlQuery += ` AND c.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Filtrar por tipo
    if (type) {
      sqlQuery += ` AND c.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Filtrar por featured
    if (featured === 'true') {
      sqlQuery += ` AND c.is_featured = true`;
    }

    // Buscar por nombre o descripción
    if (search) {
      sqlQuery += ` AND (
        c.name ILIKE $${paramIndex} OR 
        c.description ILIKE $${paramIndex} OR 
        c.tags::text ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const circles = result.rows;

    // Aplicar filtros simulados
    let filteredCircles = [...circles];

    if (category) {
      filteredCircles = filteredCircles.filter(circle => circle.category === category);
    }

    if (type) {
      filteredCircles = filteredCircles.filter(circle => circle.type === type);
    }

    if (featured === 'true') {
      filteredCircles = filteredCircles.filter(circle => circle.is_featured);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredCircles = filteredCircles.filter(circle => 
        circle.name.toLowerCase().includes(searchLower) ||
        circle.description.toLowerCase().includes(searchLower) ||
        circle.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Ordenar por featured primero, luego por member_count
    filteredCircles.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.member_count - a.member_count;
    });

    // Paginación
    const total = filteredCircles.length;
    const paginatedCircles = filteredCircles.slice(offset, offset + limit);

    return NextResponse.json({
      circles: paginatedCircles,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error('Error fetching circles:', error);
    return NextResponse.json(
      { error: 'Error al obtener círculos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo círculo (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación básica
    if (!body.name || !body.description || !body.category || !body.type) {
      return NextResponse.json(
        { error: 'Nombre, descripción, categoría y tipo son requeridos' },
        { status: 400 }
      );
    }

    // Generar slug único
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Simular creación de círculo
    const newCircle = {
      id: Date.now().toString(),
      name: body.name,
      slug,
      description: body.description,
      avatar_url: body.avatar_url || null,
      cover_url: body.cover_url || null,
      type: body.type,
      category: body.category,
      location: body.location || null,
      tags: body.tags || [],
      rules: body.rules || '',
      admin_id: '1',
      moderator_ids: [],
      member_count: 1,
      post_count: 0,
      is_featured: false,
      is_verified: false,
      status: 'active',
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      admin_username: 'usuario_actual'
    };

    console.log('Circle created (simulated):', newCircle);

    return NextResponse.json(newCircle, { status: 201 });
  } catch (error) {
    console.error('Error creating circle:', error);
    return NextResponse.json(
      { error: 'Error al crear círculo' },
      { status: 500 }
    );
  }
}
