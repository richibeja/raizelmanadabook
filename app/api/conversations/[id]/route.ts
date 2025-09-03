import { NextRequest, NextResponse } from 'next/server';

// Mock data para demostración
let conversations = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'direct',
    title: null,
    description: null,
    avatar_url: null,
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    last_message_at: '2024-01-15T12:30:00Z',
    is_active: true,
    metadata: {},
    participants: [
      { user_id: '550e8400-e29b-41d4-a716-446655440001', role: 'member', unread_count: 0 },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', role: 'member', unread_count: 2 }
    ],
    last_message: {
      content: '¡Muy bien! Acaba de comer',
      sender_name: 'María',
      created_at: '2024-01-15T12:30:00Z'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    type: 'group',
    title: 'Amantes de Perros',
    description: 'Grupo para compartir fotos de perros',
    avatar_url: '/api/placeholder/64/64',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    created_at: '2024-01-14T15:00:00Z',
    updated_at: '2024-01-15T11:45:00Z',
    last_message_at: '2024-01-15T11:45:00Z',
    is_active: true,
    metadata: {},
    participants: [
      { user_id: '550e8400-e29b-41d4-a716-446655440001', role: 'admin', unread_count: 0 },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', role: 'member', unread_count: 1 },
      { user_id: '550e8400-e29b-41d4-a716-446655440003', role: 'member', unread_count: 0 }
    ],
    last_message: {
      content: 'Aquí está mi golden retriever',
      sender_name: 'Carlos',
      created_at: '2024-01-15T11:45:00Z'
    }
  }
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const conversation = conversations.find(conv => conv.id === id);

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { conversation }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, avatar_url } = body;

    const conversationIndex = conversations.findIndex(conv => conv.id === id);
    if (conversationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    const conversation = conversations[conversationIndex];

    // Solo permitir actualizar grupos
    if (conversation.type === 'direct') {
      return NextResponse.json(
        { success: false, error: 'No se pueden editar conversaciones directas' },
        { status: 400 }
      );
    }

    // Actualizar campos permitidos
    if (title !== undefined) conversation.title = title;
    if (description !== undefined) conversation.description = description;
    if (avatar_url !== undefined) conversation.avatar_url = avatar_url;
    
    conversation.updated_at = new Date().toISOString();
    conversations[conversationIndex] = conversation;

    return NextResponse.json({
      success: true,
      data: { 
        conversation,
        message: 'Conversación actualizada exitosamente'
      }
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const conversationIndex = conversations.findIndex(conv => conv.id === id);

    if (conversationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    // Marcar como inactiva en lugar de eliminar
    conversations[conversationIndex].is_active = false;
    conversations[conversationIndex].updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: { 
        message: 'Conversación eliminada exitosamente'
      }
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, user_id, role } = body;

    const conversationIndex = conversations.findIndex(conv => conv.id === id);
    if (conversationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    const conversation = conversations[conversationIndex];

    switch (action) {
      case 'join':
        // Agregar usuario a la conversación
        if (!conversation.participants.find(p => p.user_id === user_id)) {
          conversation.participants.push({
            user_id,
            role: role || 'member',
            unread_count: 0
          });
          conversation.updated_at = new Date().toISOString();
        }
        break;

      case 'leave':
        // Remover usuario de la conversación
        conversation.participants = conversation.participants.filter(p => p.user_id !== user_id);
        conversation.updated_at = new Date().toISOString();
        break;

      case 'update_role':
        // Actualizar rol de usuario
        const participant = conversation.participants.find(p => p.user_id === user_id);
        if (participant && role) {
          participant.role = role;
          conversation.updated_at = new Date().toISOString();
        }
        break;

      case 'mark_read':
        // Marcar conversación como leída
        const userParticipant = conversation.participants.find(p => p.user_id === user_id);
        if (userParticipant) {
          userParticipant.unread_count = 0;
          conversation.updated_at = new Date().toISOString();
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }

    conversations[conversationIndex] = conversation;

    return NextResponse.json({
      success: true,
      data: { 
        conversation,
        message: `Acción ${action} ejecutada exitosamente`
      }
    });
  } catch (error) {
    console.error('Error executing conversation action:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
