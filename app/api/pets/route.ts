import { NextRequest, NextResponse } from 'next/server';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de mascotas
  const mockPets = [
    {
      id: '1',
      name: 'Luna',
      species: 'Gato',
      breed: 'Siamés',
      date_of_birth: '2020-03-15',
      gender: 'hembra',
      weight: 4.2,
      color: 'Crema con puntos marrones',
      bio: 'Luna es una gata muy cariñosa y juguetona.',
      avatar_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=face',
      is_sterilized: true,
      vaccines: ['Triple felina', 'Leucemia felina', 'Rabia'],
      medical_notes: 'Revisión anual en marzo',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_username: 'maria_garcia',
      followers_count: 1247,
      posts_count: 89,
      age_years: 3,
      age_months: 8,
      age_estimated: '3 años y 8 meses',
      personality: 'Juguetona',
      interests: ['Dormir', 'Jugar con láser', 'Cepillado'],
      pet_location: 'Madrid, España',
      microchip: 'ES123456789',
      adoption_date: '2020-05-20',
      special_needs: 'Alergia leve a ciertos tipos de arena',
      favorite_food: 'Salmón fresco',
      favorite_activities: 'Perseguir luces láser',
      social_media_handle: '@luna_siamesa',
    },
    {
      id: '2',
      name: 'Max',
      species: 'Perro',
      breed: 'Golden Retriever',
      date_of_birth: '2019-07-10',
      gender: 'macho',
      weight: 28.5,
      color: 'Dorado',
      bio: 'Max es un perro muy sociable y le encanta jugar en el parque.',
      avatar_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face',
      is_sterilized: true,
      vaccines: ['Parvovirus', 'Rabia', 'Leptospirosis'],
      medical_notes: 'Saludable',
      privacy_level: 'public',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_username: 'carlos_rodriguez',
      followers_count: 892,
      posts_count: 156,
      age_years: 4,
      age_months: 2,
      age_estimated: '4 años y 2 meses',
      personality: 'Sociable',
      interests: ['Jugar', 'Pasear', 'Nadar'],
      pet_location: 'Barcelona, España',
      microchip: 'ES987654321',
      adoption_date: '2019-09-15',
      special_needs: 'Ninguna',
      favorite_food: 'Pollo cocido',
      favorite_activities: 'Jugar con la pelota',
      social_media_handle: '@max_golden',
    }
  ];

  return {
    rows: mockPets,
    rowCount: mockPets.length
  };
}

// GET - Obtener todas las mascotas (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const species = searchParams.get('species');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        p.id,
        p.name,
        p.species,
        p.breed,
        p.date_of_birth,
        p.gender,
        p.weight,
        p.color,
        p.bio,
        p.avatar_url,
        p.is_sterilized,
        p.vaccines,
        p.medical_notes,
        p.privacy_level,
        p.created_at,
        p.updated_at,
        u.first_name,
        u.last_name,
        u.username as owner_username
      FROM pets p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.privacy_level = 'public'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filtrar por especie
    if (species) {
      sqlQuery += ` AND p.species = $${paramIndex}`;
      params.push(species);
      paramIndex++;
    }

    // Buscar por nombre, especie o raza
    if (search) {
      sqlQuery += ` AND (
        p.name ILIKE $${paramIndex} OR 
        p.species ILIKE $${paramIndex} OR 
        p.breed ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const pets = result.rows;

    // Aplicar filtros simulados
    let filteredPets = [...pets];

    if (species) {
      filteredPets = filteredPets.filter(pet => pet.species === species);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPets = filteredPets.filter(pet => 
        pet.name.toLowerCase().includes(searchLower) ||
        pet.species.toLowerCase().includes(searchLower) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchLower))
      );
    }

    // Paginación
    const total = filteredPets.length;
    const paginatedPets = filteredPets.slice(offset, offset + limit);

    return NextResponse.json({
      pets: paginatedPets,
      total,
      limit,
      offset,
      hasMore: offset + limit < total
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json(
      { error: 'Error al obtener mascotas' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva mascota (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación básica
    if (!body.name || !body.species || !body.gender) {
      return NextResponse.json(
        { error: 'Nombre, especie y género son requeridos' },
        { status: 400 }
      );
    }

    // Simular creación de mascota
    const newPet = {
      id: Date.now().toString(),
      ...body,
      followers_count: 0,
      posts_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      age_years: body.date_of_birth ? Math.floor((new Date().getTime() - new Date(body.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365)) : null,
      age_months: body.date_of_birth ? Math.floor((new Date().getTime() - new Date(body.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 30)) % 12 : null,
      age_estimated: body.date_of_birth ? `${Math.floor((new Date().getTime() - new Date(body.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365))} años` : 'Estimado',
      personality: body.bio ? body.bio.substring(0, 50) + '...' : 'Amigable',
      interests: ['Jugar', 'Pasear', 'Dormir'],
      pet_location: 'Madrid, España',
      microchip: 'ES123456789',
      adoption_date: body.date_of_birth,
      special_needs: body.medical_notes || 'Ninguna',
      favorite_food: 'Comida premium',
      favorite_activities: 'Jugar y pasear',
      social_media_handle: `@${body.name.toLowerCase()}`,
    };

    console.log('Pet created (simulated):', newPet);

    return NextResponse.json(newPet, { status: 201 });
  } catch (error) {
    console.error('Error creating pet:', error);
    return NextResponse.json(
      { error: 'Error al crear mascota' },
      { status: 500 }
    );
  }
}
