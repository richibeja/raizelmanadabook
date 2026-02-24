import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Función para simular conexión a base de datos
async function query(text: string, params?: any[]) {
  // Simulación de base de datos para desarrollo
  console.log('Simulated query:', text, params);
  
  // Simular datos de snippets
  const mockSnippets = [
    {
      id: '1',
      author_id: 'admin-user-id',
      title: 'Mi perro aprendiendo a dar la pata',
      description: 'Después de semanas de entrenamiento, finalmente lo logró! 🐾',
      video_url: 'https://example.com/videos/dog-trick.mp4',
      thumbnail_url: 'https://example.com/thumbnails/dog-trick.jpg',
      duration_seconds: 45,
      file_size_bytes: 5242880,
      video_format: 'mp4',
      resolution_width: 1920,
      resolution_height: 1080,
      processing_status: 'completed',
      is_public: true,
      is_featured: false,
      is_verified: false,
      view_count: 1250,
      like_count: 89,
      comment_count: 23,
      share_count: 12,
      engagement_score: 45.67,
      hashtags: ['perro', 'adiestramiento', 'truco'],
      mentions: [],
      location: 'Madrid, España',
      created_at: new Date('2024-01-15T10:30:00Z'),
      updated_at: new Date('2024-01-15T10:30:00Z'),
      author_username: 'admin',
      author_avatar: 'https://example.com/avatars/admin.jpg',
      author_verified: true,
      is_recent: true,
      is_trending: true
    },
    {
      id: '2',
      author_id: 'admin-user-id',
      title: 'Gato durmiendo en posiciones extrañas',
      description: '¿Cómo puede ser tan cómodo? 😸',
      video_url: 'https://example.com/videos/cat-sleeping.mp4',
      thumbnail_url: 'https://example.com/thumbnails/cat-sleeping.jpg',
      duration_seconds: 30,
      file_size_bytes: 3145728,
      video_format: 'mp4',
      resolution_width: 1280,
      resolution_height: 720,
      processing_status: 'completed',
      is_public: true,
      is_featured: true,
      is_verified: false,
      view_count: 3420,
      like_count: 156,
      comment_count: 45,
      share_count: 28,
      engagement_score: 78.90,
      hashtags: ['gato', 'dormir', 'gracioso'],
      mentions: [],
      location: 'Barcelona, España',
      created_at: new Date('2024-01-14T15:45:00Z'),
      updated_at: new Date('2024-01-14T15:45:00Z'),
      author_username: 'admin',
      author_avatar: 'https://example.com/avatars/admin.jpg',
      author_verified: true,
      is_recent: true,
      is_trending: true
    },
    {
      id: '3',
      author_id: 'admin-user-id',
      title: 'Consejos para cuidar a tu mascota',
      description: 'Tips básicos que todo dueño debe conocer 🐕',
      video_url: 'https://example.com/videos/pet-care-tips.mp4',
      thumbnail_url: 'https://example.com/thumbnails/pet-care-tips.jpg',
      duration_seconds: 120,
      file_size_bytes: 8388608,
      video_format: 'mp4',
      resolution_width: 1920,
      resolution_height: 1080,
      processing_status: 'completed',
      is_public: true,
      is_featured: false,
      is_verified: true,
      view_count: 890,
      like_count: 67,
      comment_count: 18,
      share_count: 9,
      engagement_score: 32.45,
      hashtags: ['cuidado', 'mascotas', 'consejos'],
      mentions: [],
      location: 'Valencia, España',
      created_at: new Date('2024-01-13T09:15:00Z'),
      updated_at: new Date('2024-01-13T09:15:00Z'),
      author_username: 'admin',
      author_avatar: 'https://example.com/avatars/admin.jpg',
      author_verified: true,
      is_recent: false,
      is_trending: false
    }
  ];

  return {
    rows: mockSnippets,
    rowCount: mockSnippets.length
  };
}

// GET - Obtener snippets (versión simulada)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extraer parámetros de consulta
    const category = searchParams.get('category');
    const hashtag = searchParams.get('hashtag');
    const author = searchParams.get('author');
    const featured = searchParams.get('featured');
    const trending = searchParams.get('trending');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    // Simular query SQL
    let sqlQuery = `
      SELECT 
        s.id,
        s.author_id,
        s.title,
        s.description,
        s.video_url,
        s.thumbnail_url,
        s.duration_seconds,
        s.file_size_bytes,
        s.video_format,
        s.resolution_width,
        s.resolution_height,
        s.processing_status,
        s.is_public,
        s.is_featured,
        s.is_verified,
        s.view_count,
        s.like_count,
        s.comment_count,
        s.share_count,
        s.engagement_score,
        s.hashtags,
        s.mentions,
        s.location,
        s.created_at,
        s.updated_at,
        u.username as author_username,
        u.avatar_url as author_avatar,
        u.is_verified as author_verified
      FROM snippets s
      LEFT JOIN users u ON s.author_id = u.id
      WHERE s.is_public = true AND s.processing_status = 'completed'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Filtrar por categoría
    if (category) {
      sqlQuery += ` AND s.hashtags::text ILIKE $${paramIndex}`;
      params.push(`%${category}%`);
      paramIndex++;
    }

    // Filtrar por hashtag
    if (hashtag) {
      sqlQuery += ` AND s.hashtags::text ILIKE $${paramIndex}`;
      params.push(`%${hashtag}%`);
      paramIndex++;
    }

    // Filtrar por autor
    if (author) {
      sqlQuery += ` AND u.username ILIKE $${paramIndex}`;
      params.push(`%${author}%`);
      paramIndex++;
    }

    // Filtrar por featured
    if (featured === 'true') {
      sqlQuery += ` AND s.is_featured = true`;
    }

    // Filtrar por trending (snippets con alta engagement)
    if (trending === 'true') {
      sqlQuery += ` AND s.engagement_score > 50`;
    }

    // Simular resultado de la base de datos
    const result = await query(sqlQuery, params);
    const snippets = result.rows;

    // Aplicar filtros simulados
    let filteredSnippets = [...snippets];

    if (category) {
      filteredSnippets = filteredSnippets.filter(snippet => 
        snippet.hashtags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
      );
    }

    if (hashtag) {
      filteredSnippets = filteredSnippets.filter(snippet => 
        snippet.hashtags.some(tag => tag.toLowerCase().includes(hashtag.toLowerCase()))
      );
    }

    if (author) {
      filteredSnippets = filteredSnippets.filter(snippet => 
        snippet.author_username.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (featured === 'true') {
      filteredSnippets = filteredSnippets.filter(snippet => snippet.is_featured);
    }

    if (trending === 'true') {
      filteredSnippets = filteredSnippets.filter(snippet => snippet.is_trending);
    }

    // Ordenar snippets
    filteredSnippets.sort((a, b) => {
      let aValue: any = a[sort as keyof typeof a];
      let bValue: any = b[sort as keyof typeof b];

      if (sort === 'created_at' || sort === 'updated_at') {
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
    const total = filteredSnippets.length;
    const paginatedSnippets = filteredSnippets.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      success: true,
      data: {
        snippets: paginatedSnippets,
        pagination: {
          total,
          limit,
          offset,
          hasMore
        }
      }
    });

  } catch (error) {
    console.error('Error fetching snippets:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo snippet (versión simulada)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { title, description, video_url, author_id } = body;
    
    if (!title || !video_url || !author_id) {
      return NextResponse.json(
        { success: false, error: 'Título, URL del video y autor son requeridos' },
        { status: 400 }
      );
    }

    // Extraer hashtags de la descripción
    const hashtagRegex = /#(\w+)/g;
    const hashtags = Array.from(description.matchAll(hashtagRegex), match => match[1]);

    // Simular creación de snippet
    const newSnippet = {
      id: uuidv4(),
      author_id,
      title,
      description,
      video_url,
      thumbnail_url: body.thumbnail_url || null,
      duration_seconds: body.duration_seconds || null,
      file_size_bytes: body.file_size_bytes || null,
      video_format: body.video_format || 'mp4',
      resolution_width: body.resolution_width || null,
      resolution_height: body.resolution_height || null,
      processing_status: 'pending',
      is_public: body.is_public !== false,
      is_featured: false,
      is_verified: false,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      share_count: 0,
      engagement_score: 0.00,
      hashtags,
      mentions: body.mentions || [],
      location: body.location || null,
      created_at: new Date(),
      updated_at: new Date(),
      author_username: 'admin',
      author_avatar: 'https://example.com/avatars/admin.jpg',
      author_verified: true,
      is_recent: true,
      is_trending: false
    };

    console.log('Snippet created (simulated):', newSnippet);

    return NextResponse.json({
      success: true,
      data: {
        snippet: newSnippet,
        message: 'Snippet creado exitosamente. El video está siendo procesado.'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating snippet:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
