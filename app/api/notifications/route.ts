import { NextRequest, NextResponse } from 'next/server';

// Mock data para demostración
let notifications = [
  {
    id: 'notif_001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'message',
    title: 'Nuevo mensaje',
    message: 'Tienes un nuevo mensaje de Juan',
    data: { conversation_id: '550e8400-e29b-41d4-a716-446655440001' },
    priority: 'normal',
    is_read: false,
    read_at: null,
    created_at: '2024-01-15T12:30:00Z',
    expires_at: null,
    action_url: '/conversations/550e8400-e29b-41d4-a716-446655440001'
  },
  {
    id: 'notif_002',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    type: 'group_invite',
    title: 'Invitación a grupo',
    message: 'Te invitaron al grupo "Amantes de Perros"',
    data: { group_id: '550e8400-e29b-41d4-a716-446655440002' },
    priority: 'normal',
    is_read: false,
    read_at: null,
    created_at: '2024-01-15T11:00:00Z',
    expires_at: '2024-01-22T11:00:00Z',
    action_url: '/circles/550e8400-e29b-41d4-a716-446655440002'
  },
  {
    id: 'notif_003',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    type: 'like',
    title: 'Nuevo like',
    message: 'A María le gustó tu foto',
    data: { post_id: '550e8400-e29b-41d4-a716-446655440001' },
    priority: 'low',
    is_read: true,
    read_at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:25:00Z',
    expires_at: null,
    action_url: '/posts/550e8400-e29b-41d4-a716-446655440001'
  },
  {
    id: 'notif_004',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    type: 'urgent',
    title: 'Mascota perdida',
    message: 'Se reportó una mascota perdida cerca de tu ubicación',
    data: { location: 'Centro de la ciudad', pet_type: 'perro' },
    priority: 'urgent',
    is_read: false,
    read_at: null,
    created_at: '2024-01-15T09:00:00Z',
    expires_at: '2024-01-16T09:00:00Z',
    action_url: '/lost-pets'
  },
  {
    id: 'notif_005',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    type: 'comment',
    title: 'Nuevo comentario',
    message: 'Carlos comentó en tu publicación',
    data: { post_id: '550e8400-e29b-41d4-a716-446655440002', comment_id: 'comment_001' },
    priority: 'normal',
    is_read: false,
    read_at: null,
    created_at: '2024-01-15T08:45:00Z',
    expires_at: null,
    action_url: '/posts/550e8400-e29b-41d4-a716-446655440002'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const isRead = searchParams.get('is_read');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // Filtrar notificaciones del usuario
    let filteredNotifications = notifications.filter(notif => 
      notif.user_id === userId
    );

    // Filtrar por tipo si se especifica
    if (type) {
      filteredNotifications = filteredNotifications.filter(notif => notif.type === type);
    }

    // Filtrar por prioridad si se especifica
    if (priority) {
      filteredNotifications = filteredNotifications.filter(notif => notif.priority === priority);
    }

    // Filtrar por estado de lectura si se especifica
    if (isRead !== null) {
      const readStatus = isRead === 'true';
      filteredNotifications = filteredNotifications.filter(notif => notif.is_read === readStatus);
    }

    // Filtrar notificaciones expiradas
    const now = new Date();
    filteredNotifications = filteredNotifications.filter(notif => 
      !notif.expires_at || new Date(notif.expires_at) > now
    );

    // Ordenar
    filteredNotifications.sort((a, b) => {
      const aValue = a[sort as keyof typeof a];
      const bValue = b[sort as keyof typeof b];
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Paginación
    const total = filteredNotifications.length;
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    // Contar notificaciones no leídas
    const unreadCount = notifications.filter(notif => 
      notif.user_id === userId && 
      !notif.is_read && 
      (!notif.expires_at || new Date(notif.expires_at) > now)
    ).length;

    // Contar notificaciones urgentes
    const urgentCount = notifications.filter(notif => 
      notif.user_id === userId && 
      !notif.is_read && 
      notif.priority === 'urgent' &&
      (!notif.expires_at || new Date(notif.expires_at) > now)
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          total,
          limit,
          offset,
          hasMore
        },
        summary: {
          unread_count: unreadCount,
          urgent_count: urgentCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, type, title, message, data, priority, expires_at, action_url } = body;

    // Validaciones básicas
    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Tipo de notificación requerido' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Título requerido' },
        { status: 400 }
      );
    }

    if (priority && !['low', 'normal', 'high', 'urgent'].includes(priority)) {
      return NextResponse.json(
        { success: false, error: 'Prioridad inválida' },
        { status: 400 }
      );
    }

    // Crear nueva notificación
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id,
      type,
      title,
      message: message || null,
      data: data || {},
      priority: priority || 'normal',
      is_read: false,
      read_at: null,
      created_at: new Date().toISOString(),
      expires_at: expires_at ? new Date(expires_at).toISOString() : null,
      action_url: action_url || null
    };

    notifications.unshift(newNotification);

    // En producción aquí se enviaría la notificación por WebSocket
    // y se enviaría push notification si está configurado

    return NextResponse.json({
      success: true,
      data: { 
        notification: newNotification,
        message: 'Notificación creada exitosamente'
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, user_id, notification_ids } = body;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'mark_read':
        // Marcar notificaciones como leídas
        if (notification_ids && Array.isArray(notification_ids)) {
          // Marcar notificaciones específicas
          notification_ids.forEach((id: string) => {
            const notif = notifications.find(n => n.id === id && n.user_id === user_id);
            if (notif) {
              notif.is_read = true;
              notif.read_at = new Date().toISOString();
            }
          });
        } else {
          // Marcar todas las notificaciones del usuario como leídas
          notifications.forEach(notif => {
            if (notif.user_id === user_id && !notif.is_read) {
              notif.is_read = true;
              notif.read_at = new Date().toISOString();
            }
          });
        }
        break;

      case 'delete':
        // Eliminar notificaciones
        if (notification_ids && Array.isArray(notification_ids)) {
          notifications = notifications.filter(notif => 
            !(notification_ids.includes(notif.id) && notif.user_id === user_id)
          );
        } else {
          // Eliminar todas las notificaciones del usuario
          notifications = notifications.filter(notif => notif.user_id !== user_id);
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: { 
        message: `Acción ${action} ejecutada exitosamente`
      }
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
