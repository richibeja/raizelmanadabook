import { NextRequest, NextResponse } from 'next/server';

// Mock data for snippets (in production, this would come from the database)
let snippets = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the snippet by ID
    const snippet = snippets.find(s => s.id === id);
    
    if (!snippet) {
      return NextResponse.json(
        { success: false, error: 'Snippet no encontrado' },
        { status: 404 }
      );
    }

    // Increment view count (in production, this would be done in a separate endpoint)
    snippet.view_count += 1;

    return NextResponse.json({
      success: true,
      data: {
        snippet
      }
    });

  } catch (error) {
    console.error('Error fetching snippet:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
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
    
    // Find the snippet by ID
    const snippetIndex = snippets.findIndex(s => s.id === id);
    
    if (snippetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Snippet no encontrado' },
        { status: 404 }
      );
    }

    const snippet = snippets[snippetIndex];

    // Extract hashtags from description if provided
    let hashtags = snippet.hashtags;
    if (body.description) {
      const hashtagRegex = /#(\w+)/g;
      hashtags = Array.from(body.description.matchAll(hashtagRegex), match => match[1]);
    }

    // Update snippet fields
    const updatedSnippet = {
      ...snippet,
      title: body.title || snippet.title,
      description: body.description || snippet.description,
      thumbnail_url: body.thumbnail_url || snippet.thumbnail_url,
      is_public: body.is_public !== undefined ? body.is_public : snippet.is_public,
      hashtags,
      location: body.location || snippet.location,
      updated_at: new Date()
    };

    // Update the snippet in the array
    snippets[snippetIndex] = updatedSnippet;

    return NextResponse.json({
      success: true,
      data: {
        snippet: updatedSnippet,
        message: 'Snippet actualizado exitosamente'
      }
    });

  } catch (error) {
    console.error('Error updating snippet:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the snippet by ID
    const snippetIndex = snippets.findIndex(s => s.id === id);
    
    if (snippetIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Snippet no encontrado' },
        { status: 404 }
      );
    }

    // Remove the snippet from the array
    const deletedSnippet = snippets.splice(snippetIndex, 1)[0];

    // In a real implementation, you would:
    // 1. Soft delete by setting deleted_at timestamp
    // 2. Remove from processing queue if still processing
    // 3. Clean up associated files (video, thumbnail)
    // 4. Update hashtag usage counts

    return NextResponse.json({
      success: true,
      data: {
        message: 'Snippet eliminado exitosamente',
        snippet_id: id
      }
    });

  } catch (error) {
    console.error('Error deleting snippet:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
