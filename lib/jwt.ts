// lib/jwt.ts - JWT utilities para complementar Firebase Auth
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  role?: 'user' | 'admin' | 'moderator';
  iat?: number;
  exp?: number;
}

// Generar JWT token
export function generateJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  try {
    return jwt.sign(
      payload,
      JWT_SECRET,
      { 
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'raizel-ecosystem',
        audience: 'raizel-users'
      } as any
    );
  } catch (error) {
    console.error('JWT generation error:', error);
    return '';
  }
}

// Verificar JWT token
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'raizel-ecosystem',
      audience: 'raizel-users'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Middleware para verificar autenticación
export function requireAuth(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyJWT(token);
}

// Generar refresh token
export function generateRefreshToken(uid: string): string {
  try {
    return jwt.sign(
      { uid, type: 'refresh' },
      process.env.REFRESH_TOKEN_SECRET || JWT_SECRET,
      { 
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
        issuer: 'raizel-ecosystem'
      } as any
    );
  } catch (error) {
    console.error('Refresh token generation error:', error);
    return '';
  }
}

// Verificar refresh token
export function verifyRefreshToken(token: string): { uid: string } | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET || JWT_SECRET,
      { issuer: 'raizel-ecosystem' }
    ) as any;
    
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return { uid: decoded.uid };
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}