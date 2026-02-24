'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from '../contexts/AuthContext';
import '../globals.css';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  
  const { signIn, register, signInGoogle, error, loading } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await register(email, password, { 
          username: email.split('@')[0],
          displayName: email.split('@')[0] 
        });
      }
      router.push("/");
    } catch (err) {
      // Error handling is managed by the auth context
      console.error('Auth error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInGoogle();
      router.push("/");
    } catch (err) {
      console.error('Google auth error:', err);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>{isLogin ? "Iniciar Sesión" : "Registrarse"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : (isLogin ? "Iniciar Sesión" : "Registrarse")}
        </button>
      </form>
      
      {/* Google Login */}
      <button 
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{ 
          marginTop: '10px', 
          backgroundColor: '#4285f4', 
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '4px',
          width: '100%'
        }}
      >
        🔍 Continuar con Google
      </button>
      
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      
      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '10px' }}>
        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </div>
  );
}




