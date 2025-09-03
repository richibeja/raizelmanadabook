import { NextRequest, NextResponse } from 'next/server';
import {
  recordMomentView,
  COLLECTIONS,
  db,
  toDate
} from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// GET - Obtener moment específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: momentId } = params;
    
    // Obtener moment
    const momentRef = doc(db, COLLECTIONS.MOMENTS, momentId);
    const momentDoc = await getDoc(momentRef);
    
    if (!momentDoc.exists()) {
      return NextResponse.json(
        { error: 'Moment no encontrado' },
        { status: 404 }
      );
    }

    const momentData = momentDoc.data();
    
    // Verificar si el moment no ha expirado
    const expiresAt = toDate(momentData.expiresAt);
    const now = new Date();
    
    if (expiresAt <= now || !momentData.isActive) {
      return NextResponse.json(
        { error: 'Moment expirado' },
        { status: 410 } // Gone
      );
    }

    const moment = {
      id: momentDoc.id,
      ...momentData,
      createdAt: toDate(momentData.createdAt).toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: moment,
      source: 'firebase'
    });

  } catch (error) {
    console.error('Error fetching moment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Registrar view/like en moment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: momentId } = params;
    const body = await request.json();
    const { action, userId, completed } = body;

    // TODO: Verificar autenticación
    const viewerId = userId || 'anonymous-user';

    switch (action) {
      case 'view':
        await recordMomentView(momentId, viewerId, completed || false);
        return NextResponse.json({
          success: true,
          message: 'View registrado'
        });

      case 'like':
        // Update moment likes
        const momentRef = doc(db, COLLECTIONS.MOMENTS, momentId);
        const momentDoc = await getDoc(momentRef);
        
        if (!momentDoc.exists()) {
          return NextResponse.json(
            { error: 'Moment no encontrado' },
            { status: 404 }
          );
        }

        const currentLikes = momentDoc.data().stats?.likesCount || 0;
        await updateDoc(momentRef, {
          'stats.likesCount': currentLikes + 1
        });

        return NextResponse.json({
          success: true,
          message: 'Like registrado'
        });

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Error in moment action:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar moment (solo autor)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: momentId } = params;
    const body = await request.json();
    const { userId } = body;

    // Verificar que el moment existe y el usuario es el autor
    const momentRef = doc(db, COLLECTIONS.MOMENTS, momentId);
    const momentDoc = await getDoc(momentRef);
    
    if (!momentDoc.exists()) {
      return NextResponse.json(
        { error: 'Moment no encontrado' },
        { status: 404 }
      );
    }

    const momentData = momentDoc.data();
    if (momentData.authorId !== userId) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este moment' },
        { status: 403 }
      );
    }

    // Marcar como inactivo en lugar de eliminar (para analytics)
    await updateDoc(momentRef, {
      isActive: false,
      deletedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Moment eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting moment:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}