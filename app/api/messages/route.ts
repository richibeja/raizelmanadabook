import { NextRequest, NextResponse } from 'next/server';

// Mock data para demostración
let messages = [
  {
    id: 'msg_001',
    conversation_id: '550e8400-e29b-41d4-a716-446655440001',
    sender_id: '550e8400-e29b-41d4-a716-446655440001',
    sender_name: 'Juan',
    sender_avatar: '/api/placeholder/32/32',
    content: '¡Hola! ¿Cómo está tu mascota?',
    message_type: 'text',
    media_urls: [],
    reply_to_id: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    is_edited: false,
    is_deleted: false
  },
  {
    id: 'msg_002',
    conversation_id: '550e8400-e29b-41d4-a716-446655440001',
    sender_id: '550e8400-e29b-41d4-a716-446655440002',
    sender_name: 'María',
    sender_avatar: '/api/placeholder/32/32',
    content: '¡Muy bien! Acaba de comer',
    message_type: 'text',
    media_urls: [],
    reply_to_id: null,
    created_at: '2024-01-15T12:30:00Z',
    updated_at: '2024-01-15T12:30:00Z',
    is_edited: false,
    is_deleted: false
  },
  {
    id: 'msg_003',
    conversation_id: '550e8400-e29b-41d4-a716-446655440002',
    sender_id: '550e8400-e29b-41d4-a716-446655440001',
    sender_name: 'Juan',
    sender_avatar: '/api/placeholder/32/32',
    content: '¡Compartan fotos de sus perros!',
    message_type: 'text',
    media_urls: [],
    reply_to_id: null,
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
    is_edited: false,
    is_deleted: false
  },
  {
    id: 'msg_004',
    conversation_id: '550e8400-e29b-41d4-a716-446655440002',
    sender_id: '550e8400-e29b-41d4-a716-446655440002',
    sender_name: 'Carlos',
    sender_avatar: '/api/placeholder/32/32',
    content: 'Aquí está mi golden retriever',
    message_type: 'image',
    media_urls: ['/api/placeholder/400/300'],
    reply_to_id: 'msg_003',
    created_at: '2024-01-15T11:45:00Z',
    updated_at: '2024-01-15T11:45:00Z',
    is_edited: false,
    is_deleted: false
  },
  {
    id: 'msg_005',
    conversation_id: '550e8400-e29b-41d4-a716-446655440003',
    sender_id: '550e8400-e29b-41d4-a716-446655440002',
    sender_name: 'Ana',
    sender_avatar: '/api/placeholder/32/32',
    content: 'Los gatos son los mejores',
    message_type: 'text',
    media_urls: [],
    reply_to_id: null,
    created_at: '2024-01-15T09:20:00Z',
    updated_at: '2024-01-15T09:20:00Z',
    is_edited: false,
    is_deleted: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'ID de conversación requerido' },
        { status: 400 }
      );
    }

    // Filtrar mensajes por conversación
    let filteredMessages = messages.filter(msg => 
      msg.conversation_id === conversationId && !msg.is_deleted
    );

    // Ordenar
    filteredMessages.sort((a, b) => {
      const aValue = a[sort as keyof typeof a];
      const bValue = b[sort as keyof typeof b];
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Paginación
    const total = filteredMessages.length;
    const paginatedMessages = filteredMessages.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      success: true,
      data: {
        messages: paginatedMessages,
        pagination: {
          total,
          limit,
          offset,
          hasMore
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation_id, sender_id, content, message_type, media_urls, reply_to_id } = body;

    // Validaciones básicas
    if (!conversation_id) {
      return NextResponse.json(
        { success: false, error: 'ID de conversación requerido' },
        { status: 400 }
      );
    }

    if (!sender_id) {
      return NextResponse.json(
        { success: false, error: 'ID del remitente requerido' },
        { status: 400 }
      );
    }

    if (!content && (!media_urls || media_urls.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Contenido o medios requeridos' },
        { status: 400 }
      );
    }

    if (message_type && !['text', 'image', 'video', 'audio', 'file', 'location', 'sticker'].includes(message_type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de mensaje inválido' },
        { status: 400 }
      );
    }

    // Verificar que el mensaje al que se responde existe
    if (reply_to_id) {
      const replyMessage = messages.find(msg => msg.id === reply_to_id);
      if (!replyMessage) {
        return NextResponse.json(
          { success: false, error: 'Mensaje de respuesta no encontrado' },
          { status: 400 }
        );
      }
    }

    // Crear nuevo mensaje
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversation_id,
      sender_id,
      sender_name: 'Usuario', // En producción se obtendría de la base de datos
      sender_avatar: '/api/placeholder/32/32',
      content: content || '',
      message_type: message_type || 'text',
      media_urls: media_urls || [],
      reply_to_id: reply_to_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_edited: false,
      is_deleted: false
    };

    messages.unshift(newMessage);

    // En producción aquí se enviaría la notificación por WebSocket
    // y se actualizaría el contador de mensajes no leídos

    return NextResponse.json({
      success: true,
      data: { 
        message: newMessage,
        message_sent: 'Mensaje enviado exitosamente'
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
