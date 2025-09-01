'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../globals.css';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  category: string;
}

const EventsPageContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Mock data since Firebase is not available
        const mockEvents = [
          {
            id: '1',
            title: 'Adopción de Mascotas',
            description: 'Evento de adopción de mascotas rescatadas',
            date: '2024-02-15',
            location: 'Parque Central, Bogotá',
            imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop',
            category: 'adopcion'
          },
          {
            id: '2',
            title: 'Taller de Cuidado de Mascotas',
            description: 'Aprende sobre el cuidado básico de mascotas',
            date: '2024-02-20',
            location: 'Centro Comercial, Medellín',
            imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=200&fit=crop',
            category: 'educacion'
          }
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error("Error fetching events: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-page-container">
      <Header />
      <div className="events-content">
        <h1>Eventos para Mascotas</h1>
        
        <div className="events-grid">
          {loading ? (
            <p className="events-empty-message">Cargando eventos...</p>
          ) : events.length === 0 ? (
            <p className="events-empty-message">No hay eventos programados en este momento.</p>
          ) : (
            events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image" style={{ backgroundImage: `url(${event.imageUrl || 'https://via.placeholder.com/300x200.png?text=Evento'})` }} />
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Ubicación:</strong> {event.location}</p>
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

export default function EventsPage() {
    return <EventsPageContent />;
}