'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

const PaymentSuccessPageContent = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Mock order details
    const mockOrder = {
      orderNumber: 'ORD-001',
      total: 95000,
      items: [
        {
          name: 'Alimento Natural para Perros',
          quantity: 2,
          price: 45000
        }
      ],
      shippingAddress: 'Calle 123 #45-67, Bogotá'
    };
    setOrderDetails(mockOrder);
  }, []);

  const handleContinueShopping = () => {
    router.push('/catalogo');
  };

  const handleViewOrders = () => {
    router.push('/orders');
  };

  return (
    <div className="payment-success-page">
      <Header />
      <div className="payment-success-content">
        <div className="success-container">
          <div className="success-icon">
            <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="success-title">¡Pago Exitoso!</h1>
          <p className="success-message">
            Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación pronto.
          </p>

          {orderDetails && (
            <div className="order-summary">
              <h2>Resumen del Pedido</h2>
              <div className="order-details">
                <p><strong>Número de pedido:</strong> {orderDetails.orderNumber}</p>
                <p><strong>Total:</strong> ${orderDetails.total.toLocaleString()}</p>
                <p><strong>Dirección de envío:</strong> {orderDetails.shippingAddress}</p>
              </div>
              
              <div className="order-items">
                <h3>Productos:</h3>
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="order-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="success-actions">
            <button onClick={handleContinueShopping} className="continue-shopping-button">
              Seguir Comprando
            </button>
            <button onClick={handleViewOrders} className="view-orders-button">
              Ver Mis Pedidos
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default function PaymentSuccessPage() {
    return <PaymentSuccessPageContent />;
}