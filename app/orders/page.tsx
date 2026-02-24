'use client';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: OrderItem[];
  createdAt: string;
  shippingAddress: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const OrdersPageContent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Mock data since Firebase is not available
        const mockOrders = [
          {
            id: '1',
            orderNumber: 'ORD-001',
            status: 'completed',
            total: 95000,
            items: [
              {
                id: '1',
                name: 'Alimento Natural para Perros',
                price: 45000,
                quantity: 2,
                imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop'
              }
            ],
            createdAt: '2024-01-15',
            shippingAddress: 'Calle 123 #45-67, Bogotá'
          }
        ];
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="orders-page-container">
      <Header />
      <div className="orders-content">
        <h1>Mis Pedidos</h1>
        
        <div className="orders-list">
          {loading ? (
            <p className="orders-empty-message">Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <p className="orders-empty-message">No tienes pedidos realizados.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order.orderNumber}</h3>
                    <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                
                <div className="order-items">
                  {order.items.map(item => (
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
                
                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.total.toLocaleString()}</strong>
                  </div>
                  <div className="order-actions">
                    <button className="view-details-button">Ver Detalles</button>
                    <button className="track-order-button">Rastrear Pedido</button>
                  </div>
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

export default function OrdersPage() {
    return <OrdersPageContent />;
}