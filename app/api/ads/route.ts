import { NextRequest, NextResponse } from 'next/server';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de anuncios
  const mockAds = [
    {
      id: '1',
      owner_id: '550e8400-e29b-41d4-a716-446655440001',
      campaign_name: 'Promoción Veterinaria Premium',
      ad_type: 'banner',
      target_audience: {
        species: ['perro', 'gato'],
        age_range: ['adulto', 'senior'],
        location: ['Madrid', 'Barcelona'],
        interests: ['salud', 'nutrición']
      },
      budget: 500.00,
      bid_type: 'CPM',
      bid_amount: 2.50,
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      status: 'active',
      approval_status: 'approved',
      impressions: 12500,
      clicks: 234,
      ctr: 1.87,
      spend: 312.50,
      creative: {
        title: 'Consulta Veterinaria Gratuita',
        description: 'Primera consulta sin costo para tu mascota',
        image_url: 'https://example.com/ads/vet-promo.jpg',
        cta_text: 'Reservar Ahora',
        landing_url: 'https://vet-clinic.com/promo'
      },
      created_at: new Date('2024-01-01T09:00:00Z'),
      updated_at: new Date('2024-01-15T14:30:00Z'),
      owner_username: 'vet_clinic_madrid',
      owner_verified: true
    },
    {
      id: '2',
      owner_id: '550e8400-e29b-41d4-a716-446655440002',
      campaign_name: 'Adopción de Mascotas',
      ad_type: 'story',
      target_audience: {
        species: ['perro', 'gato'],
        age_range: ['cachorro', 'joven'],
        location: ['Valencia', 'Sevilla'],
        interests: ['adopción', 'rescate']
      },
      budget: 300.00,
      bid_type: 'CPC',
      bid_amount: 1.20,
      start_date: '2024-01-10',
      end_date: '2024-01-25',
      status: 'active',
      approval_status: 'approved',
      impressions: 8900,
      clicks: 156,
      ctr: 1.75,
      spend: 187.20,
      creative: {
        title: 'Adopta un Amigo para Siempre',
        description: 'Mascotas rescatadas buscando un hogar amoroso',
        image_url: 'https://example.com/ads/adoption-campaign.jpg',
        cta_text: 'Ver Mascotas',
        landing_url: 'https://refugio.org/adopciones'
      },
      created_at: new Date('2024-01-10T11:00:00Z'),
      updated_at: new Date('2024-01-15T16:45:00Z'),
      owner_username: 'refugio_animales',
      owner_verified: true
    },
    {
      id: '3',
      owner_id: '550e8400-e29b-41d4-a716-446655440003',
      campaign_name: 'Productos Premium para Mascotas',
      ad_type: 'feed',
      target_audience: {
        species: ['perro', 'gato'],
        age_range: ['adulto'],
        location: ['Barcelona', 'Madrid'],
        interests: ['premium', 'nutrición']
      },
      budget: 1000.00,
      bid_type: 'CPM',
      bid_amount: 3.00,
      start_date: '2024-01-05',
      end_date: '2024-02-05',
      status: 'paused',
      approval_status: 'approved',
      impressions: 15600,
      clicks: 289,
      ctr: 1.85,
      spend: 468.00,
      creative: {
        title: 'Alimento Premium 20% OFF',
        description: 'La mejor nutrición para tu mascota con descuento especial',
        image_url: 'https://example.com/ads/premium-food.jpg',
        cta_text: 'Comprar Ahora',
        landing_url: 'https://petstore.com/premium-offer'
      },
      created_at: new Date('2024-01-05T08:30:00Z'),
      updated_at: new Date('2024-01-15T12:15:00Z'),
      owner_username: 'pet_store_premium',
      owner_verified: false
    }
  ];

  return {
    rows: mockAds,
    rowCount: mockAds.length
  };
}

// GET - Obtener anuncios (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('owner_id');
    const status = searchParams.get('status');
    const approvalStatus = searchParams.get('approval_status');
    const adType = searchParams.get('ad_type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        a.id,
        a.owner_id,
        a.campaign_name,
        a.ad_type,
        a.target_audience,
        a.budget,
        a.bid_type,
        a.bid_amount,
        a.start_date,
        a.end_date,
        a.status,
        a.approval_status,
        a.impressions,
        a.clicks,
        a.ctr,
        a.spend,
        a.creative,
        a.created_at,
        a.updated_at,
        u.username as owner_username,
        u.is_verified as owner_verified
      FROM ads a
      LEFT JOIN users u ON a.owner_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filtrar por propietario
    if (ownerId) {
      sqlQuery += ` AND a.owner_id = $${paramIndex}`;
      params.push(ownerId);
      paramIndex++;
    }

    // Filtrar por estado
    if (status) {
      sqlQuery += ` AND a.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Filtrar por estado de aprobación
    if (approvalStatus) {
      sqlQuery += ` AND a.approval_status = $${paramIndex}`;
      params.push(approvalStatus);
      paramIndex++;
    }

    // Filtrar por tipo de anuncio
    if (adType) {
      sqlQuery += ` AND a.ad_type = $${paramIndex}`;
      params.push(adType);
      paramIndex++;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const ads = result.rows;

    // Aplicar filtros simulados
    let filteredAds = [...ads];

    if (ownerId) {
      filteredAds = filteredAds.filter(ad => ad.owner_id === ownerId);
    }

    if (status) {
      filteredAds = filteredAds.filter(ad => ad.status === status);
    }

    if (approvalStatus) {
      filteredAds = filteredAds.filter(ad => ad.approval_status === approvalStatus);
    }

    if (adType) {
      filteredAds = filteredAds.filter(ad => ad.ad_type === adType);
    }

    // Ordenar anuncios
    filteredAds.sort((a, b) => {
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
    const total = filteredAds.length;
    const paginatedAds = filteredAds.slice(offset, offset + limit);

    // Calcular estadísticas
    const stats = {
      total: total,
      active: filteredAds.filter(a => a.status === 'active').length,
      paused: filteredAds.filter(a => a.status === 'paused').length,
      pending_approval: filteredAds.filter(a => a.approval_status === 'pending').length,
      total_spend: filteredAds.reduce((sum, ad) => sum + (ad.spend || 0), 0),
      total_impressions: filteredAds.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
      total_clicks: filteredAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0),
      avg_ctr: filteredAds.length > 0 ? 
        filteredAds.reduce((sum, ad) => sum + (ad.ctr || 0), 0) / filteredAds.length : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        ads: paginatedAds,
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
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo anuncio (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { campaign_name, ad_type, target_audience, budget, bid_type, bid_amount, start_date, end_date, creative } = body;
    
    if (!campaign_name || !ad_type || !target_audience || !budget || !bid_type || !bid_amount || !start_date || !end_date || !creative) {
      return NextResponse.json(
        { success: false, error: 'All fields are required: campaign_name, ad_type, target_audience, budget, bid_type, bid_amount, start_date, end_date, creative' },
        { status: 400 }
      );
    }

    // Validar fechas
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const now = new Date();

    if (startDate < now) {
      return NextResponse.json(
        { success: false, error: 'Start date cannot be in the past' },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { success: false, error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Simular creación de anuncio
    const newAd = {
      id: Date.now().toString(),
      owner_id: body.owner_id || 'current-user-id',
      campaign_name,
      ad_type,
      target_audience,
      budget: parseFloat(budget),
      bid_type,
      bid_amount: parseFloat(bid_amount),
      start_date,
      end_date,
      status: 'pending',
      approval_status: 'pending',
      impressions: 0,
      clicks: 0,
      ctr: 0.00,
      spend: 0.00,
      creative,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_username: 'usuario_actual',
      owner_verified: false
    };

    console.log('Ad created (simulated):', newAd);

    return NextResponse.json({
      success: true,
      data: newAd,
      message: 'Ad campaign created successfully. It will be reviewed by our team.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
