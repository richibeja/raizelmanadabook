'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutForm from '../components/CheckoutForm';
import '../globals.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const CheckoutPageContent = () => {
  const router = useRouter();
  const [cartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Alimento Natural para Perros',
      price: 45000,
      quantity: 2,
      imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop'
    }
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  const handleCheckout = (formData: any) => {
    console.log('Processing checkout with:', formData);
    // Here you would process the payment
    router.push('/payment-success');
  };

  return (
    <div className="checkout-page-container">
      <Header />
      <div className="checkout-content">
        <h1>Finalizar Compra</h1>
        
        <div className="checkout-grid">
          <div className="checkout-form-section">
            <CheckoutForm />
          </div>
          
          <div className="order-summary-section">
            <h2>Resumen del Pedido</h2>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Cantidad: {item.quantity}</p>
                    <p>Precio: ${item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="total-line">
                <span>Envío:</span>
                <span>${shipping.toLocaleString()}</span>
              </div>
              <div className="total-line total">
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function CheckoutPage() {
    return <CheckoutPageContent />;
}