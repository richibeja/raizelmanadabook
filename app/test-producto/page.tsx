'use client';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

const TestProductoPageContent = () => {
  const [selectedProduct, setSelectedProduct] = useState('alimento-perros');

  const products = [
    {
      id: 'alimento-perros',
      name: 'Alimento Natural para Perros',
      price: 45000,
      description: 'Alimento 100% natural para perros adultos',
      imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop'
    },
    {
      id: 'alimento-gatos',
      name: 'Alimento Natural para Gatos',
      price: 38000,
      description: 'Alimento 100% natural para gatos adultos',
      imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop'
    },
    {
      id: 'juguetes',
      name: 'Juguetes para Mascotas',
      price: 15000,
      description: 'Set de juguetes interactivos',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    }
  ];

  const currentProduct = products.find(p => p.id === selectedProduct);

  return (
    <div className="test-producto-page">
      <Header />
      <div className="test-producto-content">
        <h1>Prueba de Producto</h1>
        
        <div className="product-selector">
          <h2>Selecciona un producto:</h2>
          <div className="product-options">
            {products.map(product => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`product-option ${selectedProduct === product.id ? 'selected' : ''}`}
              >
                {product.name}
              </button>
            ))}
          </div>
        </div>

        {currentProduct && (
          <div className="product-display">
            <div className="product-image">
              <img src={currentProduct.imageUrl} alt={currentProduct.name} />
            </div>
            <div className="product-info">
              <h2>{currentProduct.name}</h2>
              <p className="product-description">{currentProduct.description}</p>
              <div className="product-price">${currentProduct.price.toLocaleString()}</div>
              <button className="add-to-cart-button">Agregar al Carrito</button>
            </div>
          </div>
        )}

        <div className="test-features">
          <h2>Características de Prueba</h2>
          <ul>
            <li>✅ Selección de productos</li>
            <li>✅ Visualización de detalles</li>
            <li>✅ Precios dinámicos</li>
            <li>✅ Interfaz responsiva</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function TestProductoPage() {
    return <TestProductoPageContent />;
}