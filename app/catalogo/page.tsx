'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string;
  description?: string;
}

const CatalogoPageContent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mock data since Firebase is not available
        const mockProducts = [
          {
            id: '1',
            name: 'Alimento Natural para Perros',
            price: 45000,
            category: 'alimentos',
            description: 'Alimento 100% natural para perros adultos',
            imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop'
          },
          {
            id: '2',
            name: 'Alimento Natural para Gatos',
            price: 38000,
            category: 'alimentos',
            description: 'Alimento 100% natural para gatos adultos',
            imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop'
          },
          {
            id: '3',
            name: 'Juguetes para Mascotas',
            price: 15000,
            category: 'juguetes',
            description: 'Set de juguetes interactivos',
            imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'
          }
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'alimentos', label: 'Alimentos' },
    { value: 'juguetes', label: 'Juguetes' },
    { value: 'accesorios', label: 'Accesorios' }
  ];

  return (
    <div className="catalogo-page-container">
      <Header />
      <div className="catalogo-content">
        <h1>Catálogo de Productos</h1>
        
        <div className="catalogo-filters">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`filter-button ${selectedCategory === category.value ? 'active' : ''}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className="catalogo-grid">
          {loading ? (
            <p className="catalogo-empty-message">Cargando productos...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="catalogo-empty-message">No hay productos disponibles en esta categoría.</p>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image" style={{ backgroundImage: `url(${product.imageUrl || 'https://via.placeholder.com/300x300.png?text=Producto'})` }} />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  {product.description && <p className="product-description">{product.description}</p>}
                  <div className="product-price">${product.price.toLocaleString()}</div>
                  <button className="add-to-cart-button">Agregar al carrito</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function CatalogoPage() {
    return <CatalogoPageContent />;
}