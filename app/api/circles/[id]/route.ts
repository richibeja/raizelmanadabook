import { NextRequest, NextResponse } from 'next/server';
import {
  joinCircle,
  leaveCircle,
  subscribeToCircleMembers,
  updateMemberRole,
  kickMember,
  Circle as FirebaseCircle,
  CircleMember,
  COLLECTIONS,
  db,
  toDate
} from '@/lib/firebase';
import { 
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { requireAuth } from '@/lib/jwt';

// GET - Obtener círculo específico + miembros
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: circleId } = await params;
    
    // Obtener círculo
    const circleRef = doc(db, COLLECTIONS.CIRCLES, circleId);
    const circleDoc = await getDoc(circleRef);
    
    if (!circleDoc.exists()) {
      return NextResponse.json(
        { error: 'Círculo no encontrado' },
        { status: 404 }
      );
    }

    const circleData = circleDoc.data();
    const firebaseCircle: FirebaseCircle = {
      id: circleDoc.id,
      ...circleData,
      createdAt: toDate(circleData.createdAt),
      updatedAt: toDate(circleData.updatedAt)
    } as FirebaseCircle;

    // Obtener miembros
    const membersQuery = query(
      collection(db, COLLECTIONS.CIRCLE_MEMBERS),
      where('circleId', '==', circleId),
      where('status', '==', 'active')
    );
    const membersSnapshot = await getDocs(membersQuery);
    
    const members: CircleMember[] = membersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        joinedAt: toDate(data.joinedAt)
      } as CircleMember;
    });

    // Mapear a formato legacy
    const legacyCircle = {
      id: firebaseCircle.id,
      name: firebaseCircle.name,
      description: firebaseCircle.description,
      category: firebaseCircle.tags[0] || 'general',
      member_count: firebaseCircle.stats.membersCount,
      is_private: firebaseCircle.isPrivate,
      created_by: firebaseCircle.createdBy,
      created_at: firebaseCircle.createdAt.toISOString(),
      updated_at: firebaseCircle.updatedAt.toISOString(),
      location: firebaseCircle.location ? `${firebaseCircle.location.city}, ${firebaseCircle.location.country}` : null,
      tags: firebaseCircle.tags,
      rules: firebaseCircle.rules?.join('\n') || '',
      settings: firebaseCircle.settings,
      members: members.map(member => ({
        id: member.id,
        user_id: member.userId,
        role: member.role,
        status: member.status,
        joined_at: member.joinedAt.toISOString(),
        permissions: member.permissions
      }))
    };

    return NextResponse.json({
      success: true,
      data: legacyCircle,
      source: 'firebase'
    });

  } catch (error) {
    console.error('Error fetching circle:', error);
    
    // Fallback mock data
    const { id: circleId } = await params;
    const mockCircle = {
      id: circleId,
      name: 'Círculo Ejemplo',
      description: 'Círculo de ejemplo con funcionalidad ManadaBook',
      category: 'general',
      member_count: 1,
      is_private: false,
      created_by: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      members: []
    };
    
    return NextResponse.json({
      success: true,
      data: mockCircle,
      source: 'mock'
    });
  }
}

// POST - Operaciones círculo (join, leave, invite, kick)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: circleId } = await params;
    const body = await request.json();
    const { action, userId, targetUserId, newRole } = body;

    // TODO: Verificar autenticación
    // const auth = requireAuth(request);
    const currentUserId = userId || 'current-user';

    switch (action) {
      case 'join':
        await joinCircle(circleId, currentUserId);
        return NextResponse.json({
          success: true,
          message: 'Te has unido al círculo exitosamente'
        });

      case 'leave':
        await leaveCircle(circleId, currentUserId);
        return NextResponse.json({
          success: true,
          message: 'Has salido del círculo'
        });

      case 'kick':
        if (!targetUserId) {
          return NextResponse.json(
            { error: 'targetUserId es requerido para expulsar' },
            { status: 400 }
          );
        }
        
        // Get current user role
        const memberQuery = query(
          collection(db, COLLECTIONS.CIRCLE_MEMBERS),
          where('circleId', '==', circleId),
          where('userId', '==', currentUserId),
          where('status', '==', 'active')
        );
        const memberDoc = await getDocs(memberQuery);
        
        if (memberDoc.empty) {
          return NextResponse.json(
            { error: 'No eres miembro de este círculo' },
            { status: 403 }
          );
        }
        
        const currentUserRole = memberDoc.docs[0].data().role;
        
        // Find target member
        const targetQuery = query(
          collection(db, COLLECTIONS.CIRCLE_MEMBERS),
          where('circleId', '==', circleId),
          where('userId', '==', targetUserId)
        );
        const targetDoc = await getDocs(targetQuery);
        
        if (targetDoc.empty) {
          return NextResponse.json(
            { error: 'Usuario no encontrado en el círculo' },
            { status: 404 }
          );
        }
        
        await kickMember(circleId, targetDoc.docs[0].id, currentUserRole);
        return NextResponse.json({
          success: true,
          message: 'Usuario expulsado del círculo'
        });

      case 'update_role':
        if (!targetUserId || !newRole) {
          return NextResponse.json(
            { error: 'targetUserId y newRole son requeridos' },
            { status: 400 }
          );
        }
        
        // Get current user role
        const roleQuery = query(
          collection(db, COLLECTIONS.CIRCLE_MEMBERS),
          where('circleId', '==', circleId),
          where('userId', '==', currentUserId),
          where('status', '==', 'active')
        );
        const roleDoc = await getDocs(roleQuery);
        
        if (roleDoc.empty) {
          return NextResponse.json(
            { error: 'No eres miembro de este círculo' },
            { status: 403 }
          );
        }
        
        const currentRole = roleDoc.docs[0].data().role;
        
        // Find target member to update
        const updateQuery = query(
          collection(db, COLLECTIONS.CIRCLE_MEMBERS),
          where('circleId', '==', circleId),
          where('userId', '==', targetUserId)
        );
        const updateDoc = await getDocs(updateQuery);
        
        if (updateDoc.empty) {
          return NextResponse.json(
            { error: 'Usuario no encontrado en el círculo' },
            { status: 404 }
          );
        }
        
        await updateMemberRole(circleId, updateDoc.docs[0].id, newRole, currentRole);
        return NextResponse.json({
          success: true,
          message: 'Rol actualizado exitosamente'
        });

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Error in circle operation:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}