import { NextRequest, NextResponse } from 'next/server';

// Mock data para acciones de moderación
const mockModerationActions = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    moderator_id: '550e8400-e29b-41d4-a716-446655440005',
    target_user_id: '550e8400-e29b-41d4-a716-446655440002',
    action_type: 'warning',
    target_type: 'user',
    target_id: null,
    reason: 'Contenido inapropiado repetido',
    duration_hours: null,
    evidence_urls: [],
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    moderator_id: '550e8400-e29b-41d4-a716-446655440005',
    target_user_id: '550e8400-e29b-41d4-a716-446655440004',
    action_type: 'temporary_ban',
    target_type: 'user',
    target_id: null,
    reason: 'Acoso a otros usuarios',
    duration_hours: 72,
    evidence_urls: ['https://example.com/evidence1.jpg'],
    created_at: '2024-01-15T09:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const target_user_id = searchParams.get('target_user_id');
    const action_type = searchParams.get('action_type');
    const moderator_id = searchParams.get('moderator_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filtrar acciones
    let filteredActions = mockModerationActions;

    if (target_user_id) {
      filteredActions = filteredActions.filter(action => action.target_user_id === target_user_id);
    }

    if (action_type) {
      filteredActions = filteredActions.filter(action => action.action_type === action_type);
    }

    if (moderator_id) {
      filteredActions = filteredActions.filter(action => action.moderator_id === moderator_id);
    }

    // Ordenar por fecha de creación (más reciente primero)
    filteredActions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Paginar
    const paginatedActions = filteredActions.slice(offset, offset + limit);

    return NextResponse.json({
      actions: paginatedActions,
      total: filteredActions.length,
      limit,
      offset,
      hasMore: offset + limit < filteredActions.length
    });
  } catch (error) {
    console.error('Error fetching moderation actions:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      moderator_id,
      target_user_id,
      action_type,
      target_type,
      target_id,
      reason,
      duration_hours,
      evidence_urls = []
    } = body;

    // Validación básica
    if (!moderator_id || !target_user_id || !action_type || !target_type || !reason) {
      return NextResponse.json(
        { error: 'moderator_id, target_user_id, action_type, target_type y reason son requeridos' },
        { status: 400 }
      );
    }

    // Validar tipos de acción
    const validActionTypes = [
      'warning', 'content_removal', 'temporary_ban', 'permanent_ban', 'unban'
    ];

    if (!validActionTypes.includes(action_type)) {
      return NextResponse.json(
        { error: 'Tipo de acción inválido' },
        { status: 400 }
      );
    }

    // Validar tipos de target
    const validTargetTypes = [
      'user', 'post', 'message', 'snippet', 'ad'
    ];

    if (!validTargetTypes.includes(target_type)) {
      return NextResponse.json(
        { error: 'Tipo de target inválido' },
        { status: 400 }
      );
    }

    // Validar duration_hours para bans temporales
    if (action_type === 'temporary_ban' && (!duration_hours || duration_hours <= 0)) {
      return NextResponse.json(
        { error: 'duration_hours es requerido para bans temporales' },
        { status: 400 }
      );
    }

    // Crear nueva acción de moderación
    const newAction = {
      id: `550e8400-e29b-41d4-a716-${Math.random().toString(36).substr(2, 12)}`,
      moderator_id,
      target_user_id,
      action_type,
      target_type,
      target_id,
      reason,
      duration_hours,
      evidence_urls,
      created_at: new Date().toISOString()
    };

    // En producción, aquí se insertaría en la base de datos
    // const actionId = await createModerationAction(newAction);

    // Aquí también se aplicarían las acciones correspondientes:
    // - Para content_removal: eliminar el contenido específico
    // - Para temporary_ban: marcar usuario como temporalmente baneado
    // - Para permanent_ban: marcar usuario como permanentemente baneado
    // - Para unban: remover ban del usuario

    return NextResponse.json({
      message: 'Acción de moderación aplicada exitosamente',
      action: newAction
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating moderation action:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
