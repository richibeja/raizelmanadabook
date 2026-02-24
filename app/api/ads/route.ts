import { NextRequest, NextResponse } from 'next/server';
import { 
  db, 
  COLLECTIONS, 
  Ad, 
  AdsFilters, 
  createAd, 
  toDate 
} from '../../../lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  QueryConstraint 
} from 'firebase/firestore';

// GET - Obtener anuncios desde Firestore
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('owner_id');
    const status = searchParams.get('status');
    const approvalStatus = searchParams.get('approval_status');
    const adType = searchParams.get('ad_type');
    const limitParam = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Construir query de Firestore
    const constraints: QueryConstraint[] = [];

    // Aplicar filtros
    if (ownerId) {
      constraints.push(where('ownerId', '==', ownerId));
    }
    if (status && status !== 'all') {
      constraints.push(where('status', '==', status));
    }
    if (approvalStatus && approvalStatus !== 'all') {
      constraints.push(where('approvalStatus', '==', approvalStatus));
    }
    if (adType && adType !== 'all') {
      constraints.push(where('adType', '==', adType));
    }

    // Ordenar y limitar
    constraints.push(orderBy(sort, order as 'asc' | 'desc'));
    constraints.push(firestoreLimit(limitParam + offset)); // Obtenemos más para manejar offset

    const adsQuery = query(collection(db, COLLECTIONS.ADS), ...constraints);
    const querySnapshot = await getDocs(adsQuery);

    // Convertir documentos a objetos Ad
    const allAds: Ad[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ownerId: data.ownerId,
        campaignName: data.campaignName,
        adType: data.adType,
        targetAudience: data.targetAudience,
        budget: data.budget,
        bidType: data.bidType,
        bidAmount: data.bidAmount,
        startDate: toDate(data.startDate),
        endDate: toDate(data.endDate),
        status: data.status,
        approvalStatus: data.approvalStatus,
        impressions: data.impressions || 0,
        clicks: data.clicks || 0,
        ctr: data.ctr || 0,
        spend: data.spend || 0,
        creative: data.creative,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        ownerUsername: data.ownerUsername || 'Usuario',
        ownerVerified: data.ownerVerified || false,
        rejectionReason: data.rejectionReason
      } as Ad;
    });

    // Aplicar paginación manual (offset)
    const paginatedAds = allAds.slice(offset, offset + limitParam);
    const total = allAds.length;

    // Calcular estadísticas
    const stats = {
      total: total,
      active: allAds.filter(a => a.status === 'active').length,
      paused: allAds.filter(a => a.status === 'paused').length,
      pending_approval: allAds.filter(a => a.approvalStatus === 'pending').length,
      total_spend: allAds.reduce((sum, ad) => sum + (ad.spend || 0), 0),
      total_impressions: allAds.reduce((sum, ad) => sum + (ad.impressions || 0), 0),
      total_clicks: allAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0),
      avg_ctr: allAds.length > 0 ? 
        allAds.reduce((sum, ad) => sum + (ad.ctr || 0), 0) / allAds.length : 0
    };

    // Mapear a formato legado para compatibilidad con frontend
    const legacyAds = paginatedAds.map(ad => ({
      id: ad.id,
      title: ad.creative.title,
      description: ad.creative.description,
      image_url: ad.creative.imageUrl,
      target_audience: ad.targetAudience.species?.[0] || 'general',
      budget: ad.budget,
      start_date: ad.startDate.toISOString(),
      end_date: ad.endDate.toISOString(), 
      status: ad.status,
      impressions: ad.impressions,
      clicks: ad.clicks,
      ctr: ad.ctr,
      cpc: ad.bidAmount,
      total_spent: ad.spend,
      payment_status: ad.status === 'active' ? 'paid' : 'pending',
      creative_type: ad.adType,
      campaign_name: ad.campaignName,
      owner_username: ad.ownerUsername,
      owner_verified: ad.ownerVerified
    }));

    return NextResponse.json({
      success: true,
      data: legacyAds,
      stats,
      pagination: {
        total,
        limit: limitParam,
        offset,
        hasMore: offset + limitParam < total
      }
    });

  } catch (error) {
    console.error('Error fetching ads from Firestore:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo anuncio en Firestore  
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { 
      campaignName, 
      adType, 
      targetAudience, 
      budget, 
      bidType, 
      bidAmount, 
      startDate, 
      endDate, 
      creative,
      ownerId = 'current-user-id', // TODO: Obtener del token de auth
      ownerUsername = 'usuario_actual' // TODO: Obtener de la sesión
    } = body;
    
    if (!campaignName || !adType || !targetAudience || !budget || !bidType || !bidAmount || !startDate || !endDate || !creative) {
      return NextResponse.json(
        { success: false, error: 'Todos los campos son requeridos: campaignName, adType, targetAudience, budget, bidType, bidAmount, startDate, endDate, creative' },
        { status: 400 }
      );
    }

    // Validar fechas
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const now = new Date();

    if (startDateObj < now) {
      return NextResponse.json(
        { success: false, error: 'La fecha de inicio no puede ser en el pasado' },
        { status: 400 }
      );
    }

    if (endDateObj <= startDateObj) {
      return NextResponse.json(
        { success: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio' },
        { status: 400 }
      );
    }

    // Crear anuncio en Firestore
    const newAdData: Omit<Ad, 'id' | 'createdAt' | 'updatedAt'> = {
      ownerId,
      campaignName,
      adType,
      targetAudience,
      budget: parseFloat(budget),
      bidType,
      bidAmount: parseFloat(bidAmount),
      startDate: startDateObj,
      endDate: endDateObj,
      status: 'pending',
      approvalStatus: 'pending',
      impressions: 0,
      clicks: 0,
      ctr: 0.00,
      spend: 0.00,
      creative,
      ownerUsername,
      ownerVerified: false
    };

    const adId = await createAd(newAdData);

    return NextResponse.json({
      success: true,
      data: { id: adId, ...newAdData },
      message: 'Campaña publicitaria creada exitosamente. Será revisada por nuestro equipo.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating ad in Firestore:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
