'use client';

import Link from 'next/link';
import '../HomePage.css'; // Crearemos este archivo de estilos

export default function HomePage() {
  return (
    <div className="home-page-container">
      <header className="home-header">
        <h1>Bienvenido a Raízel</h1>
        <p>El ecosistema completo para el bienestar de tu mascota.</p>
      </header>

      <div className="modules-grid">
        <Link href="/products" className="module-card">
          <div className="module-icon">🛍️</div>
          <h2>Catálogo de Productos</h2>
          <p>Descubre nuestra línea de alimentos naturales Vital BARF y Vital Pellets.</p>
        </Link>

        <Link href="/calculator" className="module-card">
          <div className="module-icon">⚖️</div>
          <h2>Calculadora de Porciones</h2>
          <p>Encuentra la ración diaria perfecta para tu compañero.</p>
        </Link>
        
        <Link href="/product-test" className="module-card">
          <div className="module-icon">🧪</div>
          <h2>Test de Producto</h2>
          <p>¿No sabes por dónde empezar? Te ayudamos a elegir.</p>
        </Link>

        <Link href="/education" className="module-card">
          <div className="module-icon">📚</div>
          <h2>Consejos de Alimentación</h2>
          <p>Aprende todo sobre nutrición y cuidado para tu mascota.</p>
        </Link>

        <Link href="/pedidos" className="module-card">
          <div className="module-icon">🛒</div>
          <h2>Hacer un Pedido</h2>
          <p>Contacta con nosotros para agendar la entrega de tus productos.</p>
        </Link>
      </div>

      <div className="manadabook-promo-section">
        <div className="manadabook-promo-content">
            <h2>Únete a la Manada</h2>
            <p>Explora ManadaBook, nuestra red social exclusiva para mascotas, y conecta con una comunidad que comparte tu misma pasión.</p>
            <Link href="/dashboard" className="manadabook-promo-button">Ir a ManadaBook 🐾</Link>
        </div>
      </div>
    </div>
  );
}