import { NextRequest, NextResponse } from 'next/server';

// Mock data (referencia a los datos del archivo principal)
let ads: any[] = [
  {
    id: '1',
    owner_id: 'user-1',
    title: 'Alimento Premium para Perros',
    description: 'La mejor nutrición para tu mascota',
    creative_type: 'image',
    creative_urls: ['https://images.unsplash.com/photo-1601758228041-3caa3d3d3c1c?w=400'],
    target_audience: { pet_species: ['perro'] },
    budget_amount: 500.00,
    budget_currency: 'USD',
    bid_type: 'cpm',
    bid_amount: 2.50,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    status: 'active',
    payment_status: 'paid',
    total_impressions: 1250,
    total_clicks: 45,
    total_spent: 125.00,
    ctr: 0.036,
    cpm: 2.50,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    owner_username: 'petstore_mx',
    owner_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  },
  {
    id: '2',
    owner_id: 'user-2',
    title: 'Veterinaria 24/7',
    description: 'Atención veterinaria de emergencia',
    creative_type: 'video',
    creative_urls: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400'],
    target_audience: { location: ['Ciudad de México'] },
    budget_amount: 300.00,
    budget_currency: 'USD',
    bid_type: 'cpc',
    bid_amount: 1.50,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-06-30T23:59:59Z',
    status: 'active',
    payment_status: 'paid',
    total_impressions: 800,
    total_clicks: 120,
    total_spent: 180.00,
    ctr: 0.150,
    cpm: 3.75,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    owner_username: 'vet_emergency',
    owner_avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'
  },
  {
    id: '3',
    owner_id: 'user-3',
    title: 'Juguetes para Gatos',
    description: 'Juguetes interactivos para tu felino',
    creative_type: 'carousel',
    creative_urls: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400'
    ],
    target_audience: { pet_species: ['gato'] },
    budget_amount: 200.00,
    budget_currency: 'USD',
    bid_type: 'cpm',
    bid_amount: 1.80,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-03-31T23:59:59Z',
    status: 'pending',
    payment_status: 'pending',
    total_impressions: 0,
    total_clicks: 0,
    total_spent: 0.00,
    ctr: 0,
    cpm: 0,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    owner_username: 'cat_toys_store',
    owner_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
  }
];

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const ad = ads.find(a => a.id === id);
    
    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Anuncio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { ad } });
  } catch (error) {
    console.error('Error fetching ad:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const adIndex = ads.findIndex(a => a.id === id);
    if (adIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Anuncio no encontrado' },
        { status: 404 }
      );
    }

    const currentAd = ads[adIndex];
    
    // Solo permitir actualizar ciertos campos
    const allowedFields = [
      'title', 'description', 'creative_urls', 'target_audience',
      'budget_amount', 'bid_amount', 'start_date', 'end_date'
    ];

    const updatedAd = { ...currentAd };
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updatedAd[field] = body[field];
      }
    }

    updatedAd.updated_at = new Date().toISOString();

    // Validaciones adicionales
    if (body.start_date && body.end_date && new Date(body.start_date) >= new Date(body.end_date)) {
      return NextResponse.json(
        { success: false, error: 'La fecha de inicio debe ser anterior a la fecha de fin' },
        { status: 400 }
      );
    }

    ads[adIndex] = updatedAd;

    return NextResponse.json({
      success: true,
      data: { ad: updatedAd, message: 'Anuncio actualizado exitosamente' }
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const adIndex = ads.findIndex(a => a.id === id);
    
    if (adIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Anuncio no encontrado' },
        { status: 404 }
      );
    }

    const deletedAd = ads[adIndex];
    ads.splice(adIndex, 1);

    return NextResponse.json({
      success: true,
      data: { message: 'Anuncio eliminado exitosamente', ad_id: id }
    });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para procesar pago del anuncio
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, payment_intent_id } = body;

    const adIndex = ads.findIndex(a => a.id === id);
    if (adIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Anuncio no encontrado' },
        { status: 404 }
      );
    }

    const ad = ads[adIndex];

    switch (action) {
      case 'approve':
        if (ad.status !== 'pending') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden aprobar anuncios pendientes' },
            { status: 400 }
          );
        }
        ad.status = 'approved';
        ad.approved_at = new Date().toISOString();
        ad.approved_by = 'admin-1'; // Mock admin ID
        break;

      case 'reject':
        if (ad.status !== 'pending') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden rechazar anuncios pendientes' },
            { status: 400 }
          );
        }
        ad.status = 'rejected';
        ad.rejection_reason = body.rejection_reason || 'No especificado';
        break;

      case 'process_payment':
        if (ad.payment_status !== 'pending') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden procesar pagos pendientes' },
            { status: 400 }
          );
        }
        ad.payment_status = 'paid';
        ad.stripe_payment_intent_id = payment_intent_id;
        ad.status = 'active'; // Activar automáticamente después del pago
        break;

      case 'pause':
        if (ad.status !== 'active') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden pausar anuncios activos' },
            { status: 400 }
          );
        }
        ad.status = 'paused';
        break;

      case 'resume':
        if (ad.status !== 'paused') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden reanudar anuncios pausados' },
            { status: 400 }
          );
        }
        ad.status = 'active';
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }

    ad.updated_at = new Date().toISOString();
    ads[adIndex] = ad;

    return NextResponse.json({
      success: true,
      data: { 
        ad, 
        message: `Anuncio ${action === 'approve' ? 'aprobado' : 
                   action === 'reject' ? 'rechazado' : 
                   action === 'process_payment' ? 'pagado y activado' :
                   action === 'pause' ? 'pausado' : 'reanudado'} exitosamente` 
      }
    });
  } catch (error) {
    console.error('Error processing ad action:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
