import { NextRequest, NextResponse } from 'next/server';

// Simulación de base de datos para desarrollo local
// En producción, esto se conectaría a PostgreSQL
const mockAffiliates = [
  {
    id: '1',
    name: 'Mascotas Naturales Bogotá',
    contact_type: 'WhatsApp',
    contact_value: '+57 300 123 4567',
    region: 'Bogotá',
    description: 'Distribuidor autorizado en la capital',
    logo_url: null,
    is_active: true,
    created_at: '2024-12-19T10:00:00Z',
    updated_at: '2024-12-19T10:00:00Z'
  },
  {
    id: '2',
    name: 'Pet Shop Medellín',
    contact_type: 'Email',
    contact_value: 'info@petshopmedellin.com',
    region: 'Medellín',
    description: 'Tienda especializada en productos naturales',
    logo_url: null,
    is_active: true,
    created_at: '2024-12-19T10:00:00Z',
    updated_at: '2024-12-19T10:00:00Z'
  },
  {
    id: '3',
    name: 'Veterinaria Cali Natural',
    contact_type: 'Teléfono',
    contact_value: '+57 2 123 4567',
    region: 'Cali',
    description: 'Clínica veterinaria con productos Raízel',
    logo_url: null,
    is_active: true,
    created_at: '2024-12-19T10:00:00Z',
    updated_at: '2024-12-19T10:00:00Z'
  },
  {
    id: '4',
    name: 'Mascotas Barranquilla',
    contact_type: 'Web',
    contact_value: 'https://mascotasbarranquilla.com',
    region: 'Barranquilla',
    description: 'Tienda online de productos naturales',
    logo_url: null,
    is_active: true,
    created_at: '2024-12-19T10:00:00Z',
    updated_at: '2024-12-19T10:00:00Z'
  },
  {
    id: '5',
    name: 'Pet Store Bucaramanga',
    contact_type: 'WhatsApp',
    contact_value: '+57 300 987 6543',
    region: 'Bucaramanga',
    description: 'Distribuidor en Santander',
    logo_url: null,
    is_active: true,
    created_at: '2024-12-19T10:00:00Z',
    updated_at: '2024-12-19T10:00:00Z'
  }
];

// Función simulada de consulta a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de delay de base de datos
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // En producción, aquí se ejecutaría la consulta real a PostgreSQL
  // const result = await pool.query(text, params);
  // return result;
  
  return { rows: mockAffiliates };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const contactType = searchParams.get('contact_type');
    
    // Simular consulta con filtros
    let affiliates = mockAffiliates;
    
    if (region) {
      affiliates = affiliates.filter(affiliate => 
        affiliate.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    if (contactType) {
      affiliates = affiliates.filter(affiliate => 
        affiliate.contact_type === contactType
      );
    }
    
    // Solo retornar aliados activos
    affiliates = affiliates.filter(affiliate => affiliate.is_active);
    
    // Ordenar por región y nombre
    affiliates.sort((a, b) => {
      if (a.region < b.region) return -1;
      if (a.region > b.region) return 1;
      return a.name.localeCompare(b.name);
    });
    
    return NextResponse.json({
      success: true,
      data: affiliates,
      total: affiliates.length,
      message: 'Aliados obtenidos exitosamente'
    });
    
  } catch (error) {
    console.error('Error al obtener afiliados:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        message: 'No se pudieron obtener los aliados'
      },
      { status: 500 }
    );
  }
}

// POST, PUT, DELETE solo para administradores (protegido)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'Método no permitido',
      message: 'Solo administradores pueden crear aliados'
    },
    { status: 405 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'Método no permitido',
      message: 'Solo administradores pueden actualizar aliados'
    },
    { status: 405 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'Método no permitido',
      message: 'Solo administradores pueden eliminar aliados'
    },
    { status: 405 }
  );
}
