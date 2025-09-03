import { NextRequest, NextResponse } from 'next/server';

// Simulación de base de datos (en producción esto vendría de PostgreSQL)
let pets = [
  {
    id: '1',
    name: 'Luna',
    species: 'Gato',
    breed: 'Siamés',
    date_of_birth: '2020-03-15',
    age_years: 3,
    age_months: 8,
    age_estimated: '3 años y 8 meses',
    gender: 'hembra',
    weight: 4.2,
    color: 'Crema con puntos marrones',
    bio: 'Luna es una gata muy cariñosa y juguetona.',
    personality: 'Juguetona',
    interests: ['Dormir', 'Jugar con láser', 'Cepillado'],
    pet_location: 'Madrid, España',
    microchip: 'ES123456789',
    adoption_date: '2020-05-20',
    special_needs: 'Alergia leve a ciertos tipos de arena',
    favorite_food: 'Salmón fresco',
    favorite_activities: 'Perseguir luces láser',
    social_media_handle: '@luna_siamesa',
    is_sterilized: true,
    vaccines: ['Triple felina', 'Leucemia felina', 'Rabia'],
    medical_notes: 'Revisión anual en marzo',
    privacy_level: 'public',
    avatar_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop&crop=face',
    followers_count: 1247,
    posts_count: 89,
    owner_id: '1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// GET - Obtener mascota por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const pet = pets.find(p => p.id === id);
    
    if (!pet) {
      return NextResponse.json(
        { error: 'Mascota no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(pet);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener mascota' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar mascota
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const petIndex = pets.findIndex(p => p.id === id);
    
    if (petIndex === -1) {
      return NextResponse.json(
        { error: 'Mascota no encontrada' },
        { status: 404 }
      );
    }

    // Validación básica
    if (!body.name || !body.species || !body.gender) {
      return NextResponse.json(
        { error: 'Nombre, especie y género son requeridos' },
        { status: 400 }
      );
    }

    // Actualizar mascota
    pets[petIndex] = {
      ...pets[petIndex],
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(pets[petIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar mascota' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar mascota
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const petIndex = pets.findIndex(p => p.id === id);
    
    if (petIndex === -1) {
      return NextResponse.json(
        { error: 'Mascota no encontrada' },
        { status: 404 }
      );
    }

    const deletedPet = pets[petIndex];
    pets.splice(petIndex, 1);

    return NextResponse.json(
      { message: 'Mascota eliminada correctamente', pet: deletedPet }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar mascota' },
      { status: 500 }
    );
  }
}
