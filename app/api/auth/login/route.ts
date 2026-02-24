import { NextRequest, NextResponse } from 'next/server';
import { signInUser } from '@/lib/firebase';
import { generateJWT } from '@/lib/jwt';

// POST - Login con email/password (complementa Firebase Auth)
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Usar Firebase Auth existente
    const firebaseUser = await signInUser(email, password);
    
    // Generar JWT complementario para APIs
    const jwtToken = generateJWT({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified
    });

    // Buscar perfil usuario en Firestore
    // TODO: Implementar getUserProfile() en lib/firebase.ts
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        },
        token: jwtToken
      },
      message: 'Login exitoso'
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      },
      { status: 401 }
    );
  }
}