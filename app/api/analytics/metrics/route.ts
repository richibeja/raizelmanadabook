import { NextRequest, NextResponse } from 'next/server';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de métricas de analytics
  const mockMetrics = [
    {
      id: '1',
      metric_name: 'total_users',
      metric_value: 15420,
      metric_unit: 'users',
      date: '2024-01-15',
      period: 'daily',
      category: 'users',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      metric_name: 'active_users',
      metric_value: 8920,
      metric_unit: 'users',
      date: '2024-01-15',
      period: 'daily',
      category: 'engagement',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      metric_name: 'posts_created',
      metric_value: 456,
      metric_unit: 'posts',
      date: '2024-01-15',
      period: 'daily',
      category: 'content',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      metric_name: 'snippets_views',
      metric_value: 12500,
      metric_unit: 'views',
      date: '2024-01-15',
      period: 'daily',
      category: 'video',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      metric_name: 'ad_revenue',
      metric_value: 1250.50,
      metric_unit: 'USD',
      date: '2024-01-15',
      period: 'daily',
      category: 'monetization',
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      metric_name: 'conversion_rate',
      metric_value: 3.2,
      metric_unit: 'percentage',
      date: '2024-01-15',
      period: 'daily',
      category: 'conversion',
      created_at: new Date().toISOString()
    }
  ];

  return {
    rows: mockMetrics,
    rowCount: mockMetrics.length
  };
}

// GET - Obtener métricas de analytics (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metricName = searchParams.get('metric_name');
    const category = searchParams.get('category');
    const period = searchParams.get('period') || 'daily';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        am.id,
        am.metric_name,
        am.metric_value,
        am.metric_unit,
        am.date,
        am.period,
        am.category,
        am.created_at
      FROM analytics_metrics am
      WHERE am.period = $1
    `;

    const params: any[] = [period];
    let paramIndex = 2;

    // Filtrar por nombre de métrica
    if (metricName) {
      sqlQuery += ` AND am.metric_name = $${paramIndex}`;
      params.push(metricName);
      paramIndex++;
    }

    // Filtrar por categoría
    if (category) {
      sqlQuery += ` AND am.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    // Filtrar por rango de fechas
    if (startDate) {
      sqlQuery += ` AND am.date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      sqlQuery += ` AND am.date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const metrics = result.rows;

    // Aplicar filtros simulados
    let filteredMetrics = [...metrics];

    if (metricName) {
      filteredMetrics = filteredMetrics.filter(metric => metric.metric_name === metricName);
    }

    if (category) {
      filteredMetrics = filteredMetrics.filter(metric => metric.category === category);
    }

    if (startDate) {
      filteredMetrics = filteredMetrics.filter(metric => metric.date >= startDate);
    }

    if (endDate) {
      filteredMetrics = filteredMetrics.filter(metric => metric.date <= endDate);
    }

    // Ordenar por fecha descendente
    filteredMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Aplicar paginación
    const total = filteredMetrics.length;
    const paginatedMetrics = filteredMetrics.slice(offset, offset + limit);

    // Agrupar métricas por categoría para el dashboard
    const metricsByCategory = filteredMetrics.reduce((acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = [];
      }
      acc[metric.category].push(metric);
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      success: true,
      data: {
        metrics: paginatedMetrics,
        summary: {
          total_metrics: total,
          categories: Object.keys(metricsByCategory),
          latest_date: filteredMetrics[0]?.date || null
        },
        by_category: metricsByCategory
      },
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching analytics metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar métrica de analytics (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { metric_name, metric_value, metric_unit, date, period, category } = body;
    
    if (!metric_name || metric_value === undefined || !metric_unit || !date || !period || !category) {
      return NextResponse.json(
        { success: false, error: 'All fields are required: metric_name, metric_value, metric_unit, date, period, category' },
        { status: 400 }
      );
    }

    // Simular creación/actualización de métrica
    const newMetric = {
      id: Date.now().toString(),
      metric_name,
      metric_value: parseFloat(metric_value),
      metric_unit,
      date,
      period,
      category,
      created_at: new Date().toISOString()
    };

    console.log('Analytics metric created/updated (simulated):', newMetric);

    return NextResponse.json({
      success: true,
      data: newMetric,
      message: 'Metric created/updated successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating/updating analytics metric:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
