"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Input } from "../../Input";
import { Button } from "../../Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: user.email?.split('@')[0] || `user_${Date.now()}`,
        email: user.email,
        followersCount: 0,
        followingCount: 0,
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">ManadaBook</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          </div>
          <div className="mb-6">
            <label htmlFor="password">Contraseña</label>
            <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex items-center justify-between gap-2">
            <Button onClick={handleSignIn} type="submit" variant="primary" disabled={loading}>{loading ? "..." : "Iniciar Sesión"}</Button>
            <Button onClick={handleSignUp} type="button" variant="secondary" disabled={loading}>{loading ? "..." : "Registrarse"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
