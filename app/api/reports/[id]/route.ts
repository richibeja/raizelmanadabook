import { NextRequest, NextResponse } from 'next/server';

// Mock data para reports
const mockReports = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    reporter_id: '550e8400-e29b-41d4-a716-446655440001',
    reported_user_id: '550e8400-e29b-41d4-a716-446655440002',
    reported_post_id: null,
    reported_message_id: null,
    reported_snippet_id: null,
    reported_ad_id: null,
    report_type: 'spam',
    reason: 'Usuario publicando contenido repetitivo',
    evidence_urls: [],
    status: 'pending',
    priority: 'normal',
    assigned_moderator_id: null,
    resolution_notes: null,
    action_taken: null,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    resolved_at: null
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    reporter_id: '550e8400-e29b-41d4-a716-446655440003',
    reported_user_id: '550e8400-e29b-41d4-a716-446655440004',
    reported_post_id: null,
    reported_message_id: null,
    reported_snippet_id: null,
    reported_ad_id: null,
    report_type: 'harassment',
    reason: 'Comentarios ofensivos y acoso',
    evidence_urls: ['https://example.com/evidence1.jpg'],
    status: 'reviewing',
    priority: 'urgent',
    assigned_moderator_id: '550e8400-e29b-41d4-a716-446655440005',
    resolution_notes: 'En revisión por moderador',
    action_taken: null,
    created_at: '2024-01-15T09:30:00Z',
    updated_at: '2024-01-15T09:45:00Z',
    resolved_at: null
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const report = mockReports.find(r => r.id === id);

    if (!report) {
      return NextResponse.json(
        { error: 'Reporte no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const reportIndex = mockReports.findIndex(r => r.id === id);

    if (reportIndex === -1) {
      return NextResponse.json(
        { error: 'Reporte no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar reporte
    const updatedReport = {
      ...mockReports[reportIndex],
      ...body,
      updated_at: new Date().toISOString()
    };

    // En producción, aquí se actualizaría en la base de datos
    // await updateReport(id, updatedReport);

    return NextResponse.json({
      message: 'Reporte actualizado exitosamente',
      report: updatedReport
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, moderator_id, resolution_notes, action_taken } = body;

    const reportIndex = mockReports.findIndex(r => r.id === id);

    if (reportIndex === -1) {
      return NextResponse.json(
        { error: 'Reporte no encontrado' },
        { status: 404 }
      );
    }

    const report = mockReports[reportIndex];

    // Procesar acciones de moderación
    switch (action) {
      case 'assign':
        if (!moderator_id) {
          return NextResponse.json(
            { error: 'moderator_id es requerido para asignar' },
            { status: 400 }
          );
        }
        report.assigned_moderator_id = moderator_id;
        report.status = 'reviewing';
        break;

      case 'resolve':
        if (!action_taken) {
          return NextResponse.json(
            { error: 'action_taken es requerido para resolver' },
            { status: 400 }
          );
        }
        report.status = 'resolved';
        report.action_taken = action_taken;
        report.resolution_notes = resolution_notes;
        report.resolved_at = new Date().toISOString();
        break;

      case 'dismiss':
        report.status = 'dismissed';
        report.resolution_notes = resolution_notes || 'Reporte descartado';
        report.resolved_at = new Date().toISOString();
        break;

      case 'reopen':
        report.status = 'pending';
        report.assigned_moderator_id = null;
        report.resolved_at = null;
        break;

      default:
        return NextResponse.json(
          { error: 'Acción inválida' },
          { status: 400 }
        );
    }

    report.updated_at = new Date().toISOString();

    // En producción, aquí se actualizaría en la base de datos
    // await updateReport(id, report);

    return NextResponse.json({
      message: 'Acción aplicada exitosamente',
      report
    });
  } catch (error) {
    console.error('Error processing moderation action:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
