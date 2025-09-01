import { NextRequest, NextResponse } from 'next/server';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de reportes
  const mockReports = [
    {
      id: '1',
      reporter_id: '550e8400-e29b-41d4-a716-446655440001',
      reported_user_id: '550e8400-e29b-41d4-a716-446655440002',
      reported_content_id: 'post-123',
      content_type: 'post',
      reason: 'spam',
      description: 'Este usuario está publicando contenido comercial no autorizado',
      evidence_urls: ['https://example.com/evidence1.jpg'],
      status: 'pending',
      priority: 'medium',
      moderator_id: null,
      moderator_notes: null,
      action_taken: null,
      action_date: null,
      created_at: new Date('2024-01-15T10:30:00Z'),
      updated_at: new Date('2024-01-15T10:30:00Z'),
      reporter_username: 'usuario_reporter',
      reported_username: 'usuario_reportado',
      moderator_username: null
    },
    {
      id: '2',
      reporter_id: '550e8400-e29b-41d4-a716-446655440003',
      reported_user_id: '550e8400-e29b-41d4-a716-446655440004',
      reported_content_id: 'snippet-456',
      content_type: 'snippet',
      reason: 'inappropriate_content',
      description: 'El video contiene contenido inapropiado para menores',
      evidence_urls: ['https://example.com/evidence2.mp4'],
      status: 'reviewed',
      priority: 'high',
      moderator_id: '550e8400-e29b-41d4-a716-446655440005',
      moderator_notes: 'Contenido removido por violar las políticas de la comunidad',
      action_taken: 'content_removed',
      action_date: new Date('2024-01-15T14:20:00Z'),
      created_at: new Date('2024-01-15T09:15:00Z'),
      updated_at: new Date('2024-01-15T14:20:00Z'),
      reporter_username: 'moderador_activo',
      reported_username: 'usuario_problema',
      moderator_username: 'admin_moderator'
    },
    {
      id: '3',
      reporter_id: '550e8400-e29b-41d4-a716-446655440006',
      reported_user_id: '550e8400-e29b-41d4-a716-446655440007',
      reported_content_id: 'comment-789',
      content_type: 'comment',
      reason: 'harassment',
      description: 'Comentarios ofensivos y acoso hacia otros usuarios',
      evidence_urls: ['https://example.com/evidence3.png'],
      status: 'resolved',
      priority: 'high',
      moderator_id: '550e8400-e29b-41d4-a716-446655440005',
      moderator_notes: 'Usuario suspendido por 7 días por violaciones repetidas',
      action_taken: 'user_suspended',
      action_date: new Date('2024-01-14T16:45:00Z'),
      created_at: new Date('2024-01-14T12:30:00Z'),
      updated_at: new Date('2024-01-14T16:45:00Z'),
      reporter_username: 'usuario_victima',
      reported_username: 'usuario_acosador',
      moderator_username: 'admin_moderator'
    }
  ];

  return {
    rows: mockReports,
    rowCount: mockReports.length
  };
}

// GET - Obtener reportes (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const contentType = searchParams.get('content_type');
    const reason = searchParams.get('reason');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        r.id,
        r.reporter_id,
        r.reported_user_id,
        r.reported_content_id,
        r.content_type,
        r.reason,
        r.description,
        r.evidence_urls,
        r.status,
        r.priority,
        r.moderator_id,
        r.moderator_notes,
        r.action_taken,
        r.action_date,
        r.created_at,
        r.updated_at,
        u1.username as reporter_username,
        u2.username as reported_username,
        u3.username as moderator_username
      FROM reports r
      LEFT JOIN users u1 ON r.reporter_id = u1.id
      LEFT JOIN users u2 ON r.reported_user_id = u2.id
      LEFT JOIN users u3 ON r.moderator_id = u3.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filtrar por estado
    if (status) {
      sqlQuery += ` AND r.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Filtrar por prioridad
    if (priority) {
      sqlQuery += ` AND r.priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    // Filtrar por tipo de contenido
    if (contentType) {
      sqlQuery += ` AND r.content_type = $${paramIndex}`;
      params.push(contentType);
      paramIndex++;
    }

    // Filtrar por razón
    if (reason) {
      sqlQuery += ` AND r.reason = $${paramIndex}`;
      params.push(reason);
      paramIndex++;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const reports = result.rows;

    // Aplicar filtros simulados
    let filteredReports = [...reports];

    if (status) {
      filteredReports = filteredReports.filter(report => report.status === status);
    }

    if (priority) {
      filteredReports = filteredReports.filter(report => report.priority === priority);
    }

    if (contentType) {
      filteredReports = filteredReports.filter(report => report.content_type === contentType);
    }

    if (reason) {
      filteredReports = filteredReports.filter(report => report.reason === reason);
    }

    // Ordenar reportes
    filteredReports.sort((a, b) => {
      let aValue: any = a[sort as keyof typeof a];
      let bValue: any = b[sort as keyof typeof b];

      if (sort === 'created_at' || sort === 'updated_at' || sort === 'action_date') {
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
    const total = filteredReports.length;
    const paginatedReports = filteredReports.slice(offset, offset + limit);

    // Calcular estadísticas
    const stats = {
      total: total,
      pending: filteredReports.filter(r => r.status === 'pending').length,
      reviewed: filteredReports.filter(r => r.status === 'reviewed').length,
      resolved: filteredReports.filter(r => r.status === 'resolved').length,
      high_priority: filteredReports.filter(r => r.priority === 'high').length
    };

    return NextResponse.json({
      success: true,
      data: {
        reports: paginatedReports,
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
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo reporte (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { reported_user_id, reported_content_id, content_type, reason, description } = body;
    
    if (!reported_user_id || !reported_content_id || !content_type || !reason) {
      return NextResponse.json(
        { success: false, error: 'reported_user_id, reported_content_id, content_type, and reason are required' },
        { status: 400 }
      );
    }

    // Determinar prioridad basada en la razón
    const priorityMap: Record<string, string> = {
      'harassment': 'high',
      'inappropriate_content': 'high',
      'spam': 'medium',
      'fake_news': 'medium',
      'copyright': 'medium',
      'other': 'low'
    };

    const priority = priorityMap[reason] || 'low';

    // Simular creación de reporte
    const newReport = {
      id: Date.now().toString(),
      reporter_id: body.reporter_id || 'anonymous-user',
      reported_user_id,
      reported_content_id,
      content_type,
      reason,
      description: description || '',
      evidence_urls: body.evidence_urls || [],
      status: 'pending',
      priority,
      moderator_id: null,
      moderator_notes: null,
      action_taken: null,
      action_date: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reporter_username: 'usuario_anonimo',
      reported_username: 'usuario_reportado',
      moderator_username: null
    };

    console.log('Report created (simulated):', newReport);

    return NextResponse.json({
      success: true,
      data: newReport,
      message: 'Report submitted successfully. Our moderation team will review it.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
