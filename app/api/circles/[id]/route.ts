import { NextRequest, NextResponse } from 'next/server';

// Simulación de base de datos (en producción usar PostgreSQL)
let circles: any[] = [
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
    updated_at: new Date().toISOString()
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
    updated_at: new Date().toISOString()
  }
];

let circleMembers: any[] = [
  {
    id: '1',
    circle_id: '1',
    user_id: '1',
    role: 'admin',
    status: 'active',
    joined_at: new Date().toISOString(),
    invited_by: null,
    invited_at: null,
    accepted_at: new Date().toISOString()
  },
  {
    id: '2',
    circle_id: '2',
    user_id: '1',
    role: 'admin',
    status: 'active',
    joined_at: new Date().toISOString(),
    invited_by: null,
    invited_at: null,
    accepted_at: new Date().toISOString()
  }
];

// GET - Obtener círculo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const circle = circles.find(c => c.id === id);
    
    if (!circle) {
      return NextResponse.json(
        { error: 'Círculo no encontrado' },
        { status: 404 }
      );
    }

    // Obtener miembros del círculo
    const members = circleMembers.filter(cm => cm.circle_id === id);

    return NextResponse.json({
      ...circle,
      members
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener círculo' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar círculo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const circleIndex = circles.findIndex(c => c.id === id);
    
    if (circleIndex === -1) {
      return NextResponse.json(
        { error: 'Círculo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos (en producción, verificar JWT)
    const circle = circles[circleIndex];
    if (circle.admin_id !== '1') { // En producción, obtener del token JWT
      return NextResponse.json(
        { error: 'No tienes permisos para editar este círculo' },
        { status: 403 }
      );
    }

    // Actualizar campos permitidos
    const updatedCircle = {
      ...circle,
      ...body,
      updated_at: new Date().toISOString()
    };

    circles[circleIndex] = updatedCircle;

    return NextResponse.json(updatedCircle);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar círculo' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar círculo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const circleIndex = circles.findIndex(c => c.id === id);
    
    if (circleIndex === -1) {
      return NextResponse.json(
        { error: 'Círculo no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos (en producción, verificar JWT)
    const circle = circles[circleIndex];
    if (circle.admin_id !== '1') { // En producción, obtener del token JWT
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este círculo' },
        { status: 403 }
      );
    }

    // Soft delete - cambiar status a deleted
    circles[circleIndex] = {
      ...circle,
      status: 'deleted',
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({ message: 'Círculo eliminado exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar círculo' },
      { status: 500 }
    );
  }
}
