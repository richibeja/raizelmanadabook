import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simulación de base de datos (en producción usar PostgreSQL)
let users: any[] = [];
let sessions: any[] = [];

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    
    // Validación básica
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = users.find(u => u.email === body.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(body.password, user.password_hash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar si el usuario está activo
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Cuenta suspendida o eliminada' },
        { status: 403 }
      );
    }

    // Generar JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        role: user.role 
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Crear sesión
    const session = {
      id: Date.now().toString(),
      user_id: user.id,
      token_hash: token, // En producción, hashear el token
      refresh_token_hash: 'refresh-token-placeholder',
      device_info: {},
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent'),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      last_used_at: new Date().toISOString()
    };

    sessions.push(session);

    // Actualizar último login
    user.last_login_at = new Date().toISOString();
    user.login_count = (user.login_count || 0) + 1;

    // Retornar respuesta sin datos sensibles
    const { password_hash, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Login exitoso',
      user: userWithoutPassword,
      token,
      expires_in: 7 * 24 * 60 * 60 // 7 días en segundos
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
