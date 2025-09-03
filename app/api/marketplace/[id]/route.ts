import { NextRequest, NextResponse } from 'next/server';
import {
  updateMarketplaceItemStatus,
  addToFavorites,
  removeFromFavorites,
  COLLECTIONS,
  db,
  toDate
} from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-08-27.basil'
});

// GET - Obtener artículo específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itemId } = await params;
    
    // Obtener artículo
    const itemRef = doc(db, COLLECTIONS.MARKETPLACE, itemId);
    const itemDoc = await getDoc(itemRef);
    
    if (!itemDoc.exists()) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    const itemData = itemDoc.data();
    const item = {
      id: itemDoc.id,
      ...itemData,
      createdAt: toDate(itemData.createdAt).toISOString(),
      updatedAt: toDate(itemData.updatedAt).toISOString(),
      soldAt: itemData.soldAt ? toDate(itemData.soldAt).toISOString() : undefined
    };

    // Incrementar views
    const currentViews = itemData.stats?.viewsCount || 0;
    await updateDoc(itemRef, {
      'stats.viewsCount': currentViews + 1
    });

    return NextResponse.json({
      success: true,
      data: item,
      source: 'firebase'
    });

  } catch (error) {
    console.error('Error fetching marketplace item:', error);
    
    // Fallback mock data
    const { id: itemId } = await params;
    const mockItem = {
      id: itemId,
      title: 'Artículo de Ejemplo',
      description: 'Artículo de ejemplo para ManadaBook Marketplace',
      category: 'accessories',
      price: 50000,
      currency: 'COP',
      photos: ['/api/placeholder/400/300'],
      seller: { name: 'Usuario Ejemplo', avatar: '/api/placeholder/40/40' },
      status: 'active'
    };
    
    return NextResponse.json({
      success: true,
      data: mockItem,
      source: 'mock'
    });
  }
}

// POST - Operaciones artículo (favorite, purchase, inquiry)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itemId } = await params;
    const body = await request.json();
    const { action, userId, message } = body;

    // TODO: Verificar autenticación
    const currentUserId = userId || 'current-user';

    switch (action) {
      case 'favorite':
        await addToFavorites(itemId, currentUserId);
        return NextResponse.json({
          success: true,
          message: 'Agregado a favoritos'
        });

      case 'unfavorite':
        await removeFromFavorites(itemId, currentUserId);
        return NextResponse.json({
          success: true,
          message: 'Removido de favoritos'
        });

      case 'purchase-initiate':
        // Obtener item para Stripe checkout
        const itemRef = doc(db, COLLECTIONS.MARKETPLACE, itemId);
        const itemDoc = await getDoc(itemRef);
        
        if (!itemDoc.exists()) {
          return NextResponse.json(
            { error: 'Artículo no encontrado' },
            { status: 404 }
          );
        }

        const itemData = itemDoc.data();
        
        if (itemData.status !== 'active') {
          return NextResponse.json(
            { error: 'Artículo no disponible para compra' },
            { status: 400 }
          );
        }

        // Crear Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: itemData.currency.toLowerCase(),
                product_data: {
                  name: itemData.title,
                  description: itemData.description,
                  images: itemData.photos.slice(0, 8), // Stripe max 8 images
                  metadata: {
                    itemId,
                    sellerId: itemData.sellerId,
                    source: 'manadabook-marketplace'
                  }
                },
                unit_amount: Math.round(itemData.price * 100), // Convert to cents
              },
              quantity: 1,
            },
          ],
          metadata: {
            itemId,
            buyerId: currentUserId,
            sellerId: itemData.sellerId,
            platform: 'manadabook'
          },
          mode: 'payment',
          success_url: `${request.headers.get('origin')}/marketplace/${itemId}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${request.headers.get('origin')}/marketplace/${itemId}`,
          automatic_tax: { enabled: false }, // Configure based on Colombian tax requirements
        });

        // Mark item as reserved temporarily
        await updateDoc(itemRef, {
          status: 'reserved',
          reservedBy: currentUserId,
          reservedAt: new Date(),
          stripeSessionId: session.id
        });

        return NextResponse.json({
          success: true,
          data: {
            sessionId: session.id,
            checkoutUrl: session.url,
            itemId
          },
          message: 'Checkout iniciado exitosamente'
        });

      case 'inquiry':
        if (!message) {
          return NextResponse.json(
            { error: 'Mensaje es requerido para consulta' },
            { status: 400 }
          );
        }

        // TODO: Create inquiry record
        // await createMarketplaceInquiry({
        //   itemId,
        //   buyerId: currentUserId,
        //   sellerId: itemData.sellerId,
        //   message
        // });

        return NextResponse.json({
          success: true,
          message: 'Consulta enviada al vendedor'
        });

      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Error in marketplace operation:', error);
    
    // Special handling for Stripe errors
    if (error.type === 'StripeError') {
      return NextResponse.json(
        { success: false, error: 'Error de procesamiento de pago: ' + error.message },
        { status: 402 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado del artículo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: itemId } = await params;
    const body = await request.json();
    const { status, userId } = body;

    // TODO: Verificar autenticación
    const sellerId = userId || 'current-user';

    await updateMarketplaceItemStatus(itemId, status, sellerId);
    
    return NextResponse.json({
      success: true,
      message: `Artículo marcado como ${status}`
    });

  } catch (error: any) {
    console.error('Error updating marketplace item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}