import { NextRequest, NextResponse } from 'next/server';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de eventos de analytics
  const mockEvents = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      user_id: '550e8400-e29b-41d4-a716-446655440002',
      session_id: 'session_123',
      event_type: 'page_view',
      event_category: 'navigation',
      event_data: { page: '/home', title: 'Home' },
      page_url: '/home',
      referrer: '/login',
      user_agent: 'Mozilla/5.0...',
      ip_address: '192.168.1.1',
      device_type: 'desktop',
      location_data: { country: 'MX', city: 'CDMX' },
      created_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      user_id: '550e8400-e29b-41d4-a716-446655440002',
      session_id: 'session_123',
      event_type: 'post_create',
      event_category: 'content',
      event_data: { post_id: 'uuid-123', type: 'text', has_media: false },
      page_url: '/create-post',
      referrer: '/home',
      user_agent: 'Mozilla/5.0...',
      ip_address: '192.168.1.1',
      device_type: 'desktop',
      location_data: { country: 'MX', city: 'CDMX' },
      created_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      user_id: '550e8400-e29b-41d4-a716-446655440005',
      session_id: 'session_456',
      event_type: 'snippet_view',
      event_category: 'video',
      event_data: { snippet_id: 'uuid-456', duration: 15, completed: true },
      page_url: '/snippets/123',
      referrer: '/snippets',
      user_agent: 'Mozilla/5.0...',
      ip_address: '192.168.1.2',
      device_type: 'mobile',
      location_data: { country: 'MX', city: 'Guadalajara' },
      created_at: new Date().toISOString()
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      user_id: '550e8400-e29b-41d4-a716-446655440007',
      session_id: 'session_789',
      event_type: 'ad_click',
      event_category: 'monetization',
      event_data: { ad_id: 'uuid-789', campaign_id: 'camp-123', bid_type: 'CPC' },
      page_url: '/ads/123',
      referrer: '/feed',
      user_agent: 'Mozilla/5.0...',
      ip_address: '192.168.1.3',
      device_type: 'desktop',
      location_data: { country: 'MX', city: 'Monterrey' },
      created_at: new Date().toISOString()
    }
  ];

  return {
    rows: mockEvents,
    rowCount: mockEvents.length
  };
}

// GET - Obtener eventos de analytics (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('event_type');
    const eventCategory = searchParams.get('event_category');
    const userId = searchParams.get('user_id');
    const sessionId = searchParams.get('session_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        ae.id,
        ae.user_id,
        ae.session_id,
        ae.event_type,
        ae.event_category,
        ae.event_data,
        ae.page_url,
        ae.referrer,
        ae.user_agent,
        ae.ip_address,
        ae.device_type,
        ae.location_data,
        ae.created_at
      FROM analytics_events ae
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filtrar por tipo de evento
    if (eventType) {
      sqlQuery += ` AND ae.event_type = $${paramIndex}`;
      params.push(eventType);
      paramIndex++;
    }

    // Filtrar por categoría
    if (eventCategory) {
      sqlQuery += ` AND ae.event_category = $${paramIndex}`;
      params.push(eventCategory);
      paramIndex++;
    }

    // Filtrar por usuario
    if (userId) {
      sqlQuery += ` AND ae.user_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    // Filtrar por sesión
    if (sessionId) {
      sqlQuery += ` AND ae.session_id = $${paramIndex}`;
      params.push(sessionId);
      paramIndex++;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const events = result.rows;

    // Aplicar filtros simulados
    let filteredEvents = [...events];

    if (eventType) {
      filteredEvents = filteredEvents.filter(event => event.event_type === eventType);
    }

    if (eventCategory) {
      filteredEvents = filteredEvents.filter(event => event.event_category === eventCategory);
    }

    if (userId) {
      filteredEvents = filteredEvents.filter(event => event.user_id === userId);
    }

    if (sessionId) {
      filteredEvents = filteredEvents.filter(event => event.session_id === sessionId);
    }

    // Ordenar eventos
    filteredEvents.sort((a, b) => {
      const aValue = a[sort as keyof typeof a];
      const bValue = b[sort as keyof typeof b];
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Aplicar paginación
    const total = filteredEvents.length;
    const paginatedEvents = filteredEvents.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedEvents,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching analytics events:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo evento de analytics (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { event_type, event_category, event_data } = body;
    
    if (!event_type || !event_category) {
      return NextResponse.json(
        { success: false, error: 'event_type and event_category are required' },
        { status: 400 }
      );
    }

    // Extraer datos adicionales del request
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Simular creación de evento
    const newEvent = {
      id: `550e8400-e29b-41d4-a716-446655440${Math.random().toString(36).substr(2, 9)}`,
      user_id: body.user_id || null,
      session_id: body.session_id || null,
      event_type,
      event_category,
      event_data: event_data || {},
      page_url: body.page_url || request.url,
      referrer: body.referrer || referer,
      user_agent: body.user_agent || userAgent,
      ip_address: body.ip_address || ipAddress,
      device_type: body.device_type || 'unknown',
      location_data: body.location_data || {},
      created_at: new Date().toISOString()
    };

    console.log('Analytics event tracked (simulated):', newEvent);

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event tracked successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error tracking analytics event:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
