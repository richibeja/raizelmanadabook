import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simulación de base de datos (en producción usar PostgreSQL)
let users: any[] = [];
let sessions: any[] = [];

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();
    
    // Validación básica
    if (!body.username || !body.email || !body.password || !body.first_name || !body.last_name) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben estar presentes' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(
      user => user.email === body.email || user.username === body.username
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email o username ya está registrado' },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    // Crear usuario
    const newUser = {
      id: Date.now().toString(),
      username: body.username,
      email: body.email,
      password_hash: passwordHash,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone || null,
      location: body.location || null,
      avatar_url: null,
      bio: null,
      is_verified: false,
      is_public: true,
      role: 'user',
      status: 'active',
      preferences: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);

    // Generar JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        username: newUser.username,
        role: newUser.role 
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Crear sesión
    const session = {
      id: Date.now().toString(),
      user_id: newUser.id,
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

    // Retornar respuesta sin datos sensibles
    const { password_hash, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword,
      token,
      expires_in: 7 * 24 * 60 * 60 // 7 días en segundos
    }, { status: 201 });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
