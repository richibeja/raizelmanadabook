import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, no hemos podido encontrar la página que buscas.</p>
      <br />
      <Link href="/">Volver a la página de inicio</Link>
    </div>
  );
}



