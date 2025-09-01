import { NextRequest, NextResponse } from 'next/server';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de conversaciones
  const mockConversations = [
    {
      id: '1',
      type: 'direct',
      title: null,
      avatar_url: null,
      is_group: false,
      created_by: '550e8400-e29b-41d4-a716-446655440001',
      created_at: new Date('2024-01-10T10:30:00Z'),
      updated_at: new Date('2024-01-15T14:20:00Z'),
      last_message_id: 'msg-123',
      last_message_content: '¡Hola! ¿Cómo está tu mascota?',
      last_message_sender_id: '550e8400-e29b-41d4-a716-446655440002',
      last_message_timestamp: new Date('2024-01-15T14:20:00Z'),
      unread_count: 2,
      participants: [
        {
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          username: 'maria_garcia',
          avatar_url: 'https://example.com/avatars/maria.jpg',
          is_online: true,
          last_seen: new Date().toISOString()
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440002',
          username: 'carlos_rodriguez',
          avatar_url: 'https://example.com/avatars/carlos.jpg',
          is_online: false,
          last_seen: new Date('2024-01-15T14:20:00Z')
        }
      ]
    },
    {
      id: '2',
      type: 'group',
      title: 'Amantes de Perros',
      avatar_url: 'https://example.com/avatars/group-dogs.jpg',
      is_group: true,
      created_by: '550e8400-e29b-41d4-a716-446655440003',
      created_at: new Date('2024-01-05T09:15:00Z'),
      updated_at: new Date('2024-01-15T16:45:00Z'),
      last_message_id: 'msg-456',
      last_message_content: '¿Alguien tiene experiencia con Golden Retrievers?',
      last_message_sender_id: '550e8400-e29b-41d4-a716-446655440004',
      last_message_timestamp: new Date('2024-01-15T16:45:00Z'),
      unread_count: 5,
      participants: [
        {
          user_id: '550e8400-e29b-41d4-a716-446655440003',
          username: 'admin_group',
          avatar_url: 'https://example.com/avatars/admin.jpg',
          is_online: true,
          last_seen: new Date().toISOString(),
          role: 'admin'
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440004',
          username: 'dog_lover',
          avatar_url: 'https://example.com/avatars/dog_lover.jpg',
          is_online: false,
          last_seen: new Date('2024-01-15T16:45:00Z'),
          role: 'member'
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440005',
          username: 'pet_trainer',
          avatar_url: 'https://example.com/avatars/trainer.jpg',
          is_online: true,
          last_seen: new Date().toISOString(),
          role: 'member'
        }
      ]
    },
    {
      id: '3',
      type: 'direct',
      title: null,
      avatar_url: null,
      is_group: false,
      created_by: '550e8400-e29b-41d4-a716-446655440006',
      created_at: new Date('2024-01-12T11:20:00Z'),
      updated_at: new Date('2024-01-15T12:30:00Z'),
      last_message_id: 'msg-789',
      last_message_content: 'Gracias por el consejo sobre la alimentación',
      last_message_sender_id: '550e8400-e29b-41d4-a716-446655440007',
      last_message_timestamp: new Date('2024-01-15T12:30:00Z'),
      unread_count: 0,
      participants: [
        {
          user_id: '550e8400-e29b-41d4-a716-446655440006',
          username: 'veterinario_juan',
          avatar_url: 'https://example.com/avatars/vet.jpg',
          is_online: false,
          last_seen: new Date('2024-01-15T12:30:00Z')
        },
        {
          user_id: '550e8400-e29b-41d4-a716-446655440007',
          username: 'cliente_mascota',
          avatar_url: 'https://example.com/avatars/client.jpg',
          is_online: true,
          last_seen: new Date().toISOString()
        }
      ]
    }
  ];

  return {
    rows: mockConversations,
    rowCount: mockConversations.length
  };
}

// GET - Obtener conversaciones (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'updated_at';
    const order = searchParams.get('order') || 'desc';

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        c.id,
        c.type,
        c.title,
        c.avatar_url,
        c.is_group,
        c.created_by,
        c.created_at,
        c.updated_at,
        c.last_message_id,
        c.last_message_content,
        c.last_message_sender_id,
        c.last_message_timestamp,
        COUNT(m.id) FILTER (WHERE m.read_at IS NULL AND m.sender_id != $1) as unread_count
      FROM conversations c
      LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE cp.user_id = $1
      GROUP BY c.id, c.type, c.title, c.avatar_url, c.is_group, c.created_by, 
               c.created_at, c.updated_at, c.last_message_id, c.last_message_content,
               c.last_message_sender_id, c.last_message_timestamp
    `;

    const params: any[] = [userId || 'current-user-id'];
    let paramIndex = 2;

    // Filtrar por tipo
    if (type) {
      sqlQuery += ` AND c.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const conversations = result.rows;

    // Aplicar filtros simulados
    let filteredConversations = [...conversations];

    if (type) {
      filteredConversations = filteredConversations.filter(conv => conv.type === type);
    }

    // Filtrar por usuario participante (simulado)
    if (userId) {
      filteredConversations = filteredConversations.filter(conv => 
        conv.participants.some(p => p.user_id === userId)
      );
    }

    // Ordenar conversaciones
    filteredConversations.sort((a, b) => {
      let aValue: any = a[sort as keyof typeof a];
      let bValue: any = b[sort as keyof typeof b];

      if (sort === 'created_at' || sort === 'updated_at' || sort === 'last_message_timestamp') {
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
    const total = filteredConversations.length;
    const paginatedConversations = filteredConversations.slice(offset, offset + limit);

    // Calcular estadísticas
    const stats = {
      total: total,
      direct: filteredConversations.filter(c => c.type === 'direct').length,
      groups: filteredConversations.filter(c => c.type === 'group').length,
      unread_total: filteredConversations.reduce((sum, c) => sum + (c.unread_count || 0), 0)
    };

    return NextResponse.json({
      success: true,
      data: {
        conversations: paginatedConversations,
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
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva conversación (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { type, participants, title } = body;
    
    if (!type || !participants || participants.length < 2) {
      return NextResponse.json(
        { success: false, error: 'type and at least 2 participants are required' },
        { status: 400 }
      );
    }

    // Validar tipo de conversación
    if (type === 'group' && !title) {
      return NextResponse.json(
        { success: false, error: 'title is required for group conversations' },
        { status: 400 }
      );
    }

    // Simular creación de conversación
    const newConversation = {
      id: Date.now().toString(),
      type,
      title: type === 'group' ? title : null,
      avatar_url: body.avatar_url || null,
      is_group: type === 'group',
      created_by: body.created_by || 'current-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message_id: null,
      last_message_content: null,
      last_message_sender_id: null,
      last_message_timestamp: null,
      unread_count: 0,
      participants: participants.map((p: any) => ({
        user_id: p.user_id,
        username: p.username || 'usuario',
        avatar_url: p.avatar_url || null,
        is_online: p.is_online || false,
        last_seen: p.last_seen || new Date().toISOString(),
        role: type === 'group' ? (p.role || 'member') : null
      }))
    };

    console.log('Conversation created (simulated):', newConversation);

    return NextResponse.json({
      success: true,
      data: newConversation,
      message: 'Conversation created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
