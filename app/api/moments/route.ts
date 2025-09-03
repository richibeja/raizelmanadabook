import { NextRequest, NextResponse } from 'next/server';
import {
  subscribeToMoments,
  createMoment,
  recordMomentView,
  cleanupExpiredMoments,
  Moment,
  COLLECTIONS,
  db,
  toDate
} from '@/lib/firebase';
import { 
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  QueryConstraint
} from 'firebase/firestore';
import { requireAuth } from '@/lib/jwt';

// GET - Obtener moments activos (no expirados)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('author_id');
    const circleId = searchParams.get('circle_id');
    const limitParam = parseInt(searchParams.get('limit') || '20');

    // Construir query Firebase con filtro TTL
    const constraints: QueryConstraint[] = [];
    
    // Solo moments activos
    constraints.push(where('isActive', '==', true));
    
    // Filtrar por no expirado
    const now = new Date();
    constraints.push(where('expiresAt', '>', now));
    
    // Filtros adicionales
    if (authorId) {
      constraints.push(where('authorId', '==', authorId));
    }
    
    if (circleId) {
      constraints.push(where('circleId', '==', circleId));
    }
    
    // Ordenar por más recientes
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(firestoreLimit(limitParam));

    const momentsQuery = query(collection(db, COLLECTIONS.MOMENTS), ...constraints);
    const querySnapshot = await getDocs(momentsQuery);

    // Convertir documentos Firebase
    const moments: Moment[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: toDate(data.createdAt),
        expiresAt: toDate(data.expiresAt)
      } as Moment;
    });

    // Double-check expiration client-side
    const activeMoments = moments.filter(moment => moment.expiresAt > new Date());
    
    return NextResponse.json({
      success: true,
      data: activeMoments,
      total: activeMoments.length,
      source: 'firebase'
    });

  } catch (error) {
    console.error('Error fetching moments:', error);
    
    // Fallback mock data (moments que expiran pronto)
    const now = new Date();
    const mockMoments = [
      {
        id: '1',
        authorId: 'user1',
        content: 'Mi perro Max probando el nuevo Choribarf de Raízel! 🐕💖',
        mediaUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop',
        mediaType: 'image',
        tags: ['raizel', 'perros', 'choribarf'],
        stats: {
          viewsCount: 47,
          likesCount: 12,
          reactionsCount: 3
        },
        isActive: true,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2h ago
        expiresAt: new Date(now.getTime() + 22 * 60 * 60 * 1000)  // 22h remaining
      },
      {
        id: '2',
        authorId: 'user2',
        content: '🐱 Luna disfrutando de su dieta BARF Raízel en Medellín',
        mediaUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=600&fit=crop',
        mediaType: 'image',
        tags: ['raizel', 'gatos', 'medellin'],
        stats: {
          viewsCount: 23,
          likesCount: 8,
          reactionsCount: 2
        },
        isActive: true,
        createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30min ago
        expiresAt: new Date(now.getTime() + 23.5 * 60 * 60 * 1000) // 23.5h remaining
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: mockMoments,
      total: mockMoments.length,
      source: 'mock',
      message: 'Datos de ejemplo - Firebase no disponible'
    });
  }
}

// POST - Crear nuevo moment o registrar view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, momentId, ...momentData } = body;

    // TODO: Verificar autenticación
    // const auth = requireAuth(request);
    const userId = body.userId || 'current-user';

    if (action === 'view') {
      // Registrar view del moment
      if (!momentId) {
        return NextResponse.json(
          { error: 'momentId es requerido para registrar view' },
          { status: 400 }
        );
      }

      await recordMomentView(momentId, userId, body.completed || false);
      
      return NextResponse.json({
        success: true,
        message: 'View registrado exitosamente'
      });
    }

    // Crear nuevo moment
    const { content, mediaUrl, mediaType, duration, circleId, tags } = momentData;
    
    if (!mediaUrl || !mediaType) {
      return NextResponse.json(
        { error: 'mediaUrl y mediaType son requeridos' },
        { status: 400 }
      );
    }

    // Preparar datos del moment
    const newMomentData = {
      authorId: userId,
      content: content || '',
      mediaUrl,
      mediaType,
      duration: duration || undefined,
      circleId: circleId || undefined,
      tags: tags || []
    };

    // Crear moment en Firebase (auto-expire 24h)
    const newMomentId = await createMoment(newMomentData);
    
    // Convertir para respuesta
    const now = new Date();
    const newMoment = {
      id: newMomentId,
      ...newMomentData,
      stats: {
        viewsCount: 0,
        likesCount: 0,
        reactionsCount: 0
      },
      isActive: true,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newMoment,
      message: 'Moment creado exitosamente (expira en 24h)'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in moments operation:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Cleanup job para moments expirados
export async function DELETE(request: NextRequest) {
  try {
    // Esta función debería ser llamada por un cron job o worker
    await cleanupExpiredMoments();
    
    return NextResponse.json({
      success: true,
      message: 'Cleanup de moments expirados completado'
    });
  } catch (error) {
    console.error('Error in cleanup:', error);
    return NextResponse.json(
      { error: 'Error en cleanup' },
      { status: 500 }
    );
  }
}