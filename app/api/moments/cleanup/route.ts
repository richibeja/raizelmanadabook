import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredMoments } from '@/lib/firebase';

// POST - Cleanup job para moments expirados (llamado por cron/worker)
export async function POST(request: NextRequest) {
  try {
    // Verificar que la llamada venga de un worker autorizado
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.WORKER_SECRET_TOKEN || 'worker-secret-123';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    console.log('🧹 Iniciando cleanup de moments expirados...');
    
    // Ejecutar cleanup
    await cleanupExpiredMoments();
    
    const timestamp = new Date().toISOString();
    
    return NextResponse.json({
      success: true,
      message: 'Cleanup de moments expirados completado',
      timestamp,
      jobType: 'moments-cleanup',
      source: 'worker'
    });

  } catch (error) {
    console.error('Error in cleanup worker:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error en cleanup job',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// GET - Health check del worker
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    service: 'moments-cleanup-worker',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Worker de cleanup moments operacional'
  });
}