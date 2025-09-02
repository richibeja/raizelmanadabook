import { NextRequest, NextResponse } from 'next/server';
import { registerUser, createUserProfile } from '@/lib/firebase';
import { generateJWT } from '@/lib/jwt';

// POST - Registro complementando Firebase Auth
export async function POST(request: NextRequest) {
  try {
    const { email, password, username, displayName, location } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { success: false, error: 'Email, contraseña y username son requeridos' },
        { status: 400 }
      );
    }

    // Registrar en Firebase Auth (función existente)
    const firebaseUser = await registerUser(email, password, { username, displayName });
    
    // Crear perfil completo en Firestore  
    const profileData = {
      uid: firebaseUser.uid,
      username,
      email,
      displayName: displayName || username,
      photoURL: firebaseUser.photoURL || null,
      bio: '',
      location: location || { city: '', country: 'Colombia' },
      preferences: {
        privacy: 'public' as const,
        notifications: true,
        language: 'es'
      },
      stats: {
        followersCount: 0,
        followingCount: 0,
        petsCount: 0,
        postsCount: 0
      },
      isVerified: false
    };

    const profileId = await createUserProfile(profileData);
    
    // Generar JWT token
    const jwtToken = generateJWT({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username,
          displayName: displayName || username,
          profileId
        },
        token: jwtToken
      },
      message: 'Usuario registrado exitosamente en el ecosistema Raízel'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al registrar usuario' 
      },
      { status: 400 }
    );
  }
}