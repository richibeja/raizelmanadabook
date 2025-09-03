import { NextRequest, NextResponse } from 'next/server';
import { 
  db, 
  COLLECTIONS, 
  updateAd, 
  deleteAd, 
  approveAd, 
  rejectAd, 
  pauseAd, 
  resumeAd, 
  toDate 
} from '../../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const adRef = doc(db, COLLECTIONS.ADS, id);
    const adSnapshot = await getDoc(adRef);
    
    if (!adSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Anuncio no encontrado' },
        { status: 404 }
      );
    }

    const adData = adSnapshot.data();
    const ad = {
      id: adSnapshot.id,
      ...adData,
      startDate: toDate(adData.startDate),
      endDate: toDate(adData.endDate),
      createdAt: toDate(adData.createdAt),
      updatedAt: toDate(adData.updatedAt)
    };

    return NextResponse.json({ success: true, data: { ad } });
  } catch (error) {
    console.error('Error fetching ad from Firestore:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Verificar que el anuncio existe
    const adRef = doc(db, COLLECTIONS.ADS, id);
    const adSnapshot = await getDoc(adRef);
    
    if (!adSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Anuncio no encontrado' },
        { status: 404 }
      );
    }

    // Solo permitir actualizar ciertos campos
    const allowedFields = [
      'campaignName', 'targetAudience', 'budget', 
      'bidAmount', 'startDate', 'endDate', 'creative'
    ];

    const updates: any = {};
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'startDate' || field === 'endDate') {
          updates[field] = new Date(body[field]);
        } else {
          updates[field] = body[field];
        }
      }
    }

    // Validaciones adicionales
    if (body.startDate && body.endDate && new Date(body.startDate) >= new Date(body.endDate)) {
      return NextResponse.json(
        { success: false, error: 'La fecha de inicio debe ser anterior a la fecha de fin' },
        { status: 400 }
      );
    }

    await updateAd(id, updates);

    // Obtener anuncio actualizado
    const updatedSnapshot = await getDoc(adRef);
    const updatedData = updatedSnapshot.data();
    const updatedAd = {
      id: updatedSnapshot.id,
      ...updatedData,
      startDate: toDate(updatedData?.startDate),
      endDate: toDate(updatedData?.endDate),
      createdAt: toDate(updatedData?.createdAt),
      updatedAt: toDate(updatedData?.updatedAt)
    };

    return NextResponse.json({
      success: true,
      data: { ad: updatedAd, message: 'Anuncio actualizado exitosamente' }
    });
  } catch (error) {
    console.error('Error updating ad in Firestore:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Verificar que el anuncio existe antes de eliminarlo
    const adRef = doc(db, COLLECTIONS.ADS, id);
    const adSnapshot = await getDoc(adRef);
    
    if (!adSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Anuncio no encontrado' },
        { status: 404 }
      );
    }

    await deleteAd(id);

    return NextResponse.json({
      success: true,
      data: { message: 'Anuncio eliminado exitosamente', ad_id: id }
    });
  } catch (error) {
    console.error('Error deleting ad from Firestore:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PATCH - Procesar acciones del anuncio (aprobar, rechazar, pausar, etc.)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, rejection_reason, payment_intent_id } = body;

    // Verificar que el anuncio existe
    const adRef = doc(db, COLLECTIONS.ADS, id);
    const adSnapshot = await getDoc(adRef);
    
    if (!adSnapshot.exists()) {
      return NextResponse.json(
        { success: false, error: 'Anuncio no encontrado' },
        { status: 404 }
      );
    }

    const adData = adSnapshot.data();

    switch (action) {
      case 'approve':
        if (adData.status !== 'pending') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden aprobar anuncios pendientes' },
            { status: 400 }
          );
        }
        await approveAd(id);
        break;

      case 'reject':
        if (adData.status !== 'pending') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden rechazar anuncios pendientes' },
            { status: 400 }
          );
        }
        await rejectAd(id, rejection_reason || 'No especificado');
        break;

      case 'process_payment':
        if (adData.status !== 'pending') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden procesar pagos pendientes' },
            { status: 400 }
          );
        }
        await updateAd(id, {
          status: 'active',
          stripePaymentIntentId: payment_intent_id
        });
        break;

      case 'pause':
        if (adData.status !== 'active') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden pausar anuncios activos' },
            { status: 400 }
          );
        }
        await pauseAd(id);
        break;

      case 'resume':
        if (adData.status !== 'paused') {
          return NextResponse.json(
            { success: false, error: 'Solo se pueden reanudar anuncios pausados' },
            { status: 400 }
          );
        }
        await resumeAd(id);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }

    // Obtener anuncio actualizado
    const updatedSnapshot = await getDoc(adRef);
    const updatedData = updatedSnapshot.data();
    const updatedAd = {
      id: updatedSnapshot.id,
      ...updatedData,
      startDate: toDate(updatedData?.startDate),
      endDate: toDate(updatedData?.endDate),
      createdAt: toDate(updatedData?.createdAt),
      updatedAt: toDate(updatedData?.updatedAt)
    };

    const actionMessages = {
      approve: 'aprobado',
      reject: 'rechazado',
      process_payment: 'pagado y activado',
      pause: 'pausado',
      resume: 'reanudado'
    };

    return NextResponse.json({
      success: true,
      data: { 
        ad: updatedAd, 
        message: `Anuncio ${actionMessages[action as keyof typeof actionMessages]} exitosamente` 
      }
    });
  } catch (error) {
    console.error('Error processing ad action in Firestore:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}