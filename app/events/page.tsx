'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Link from 'next/link';
import '../globals.css';

interface Event {
  id: string;
  title: string;
  summary: string;
  date: Date;
  location: string;
  imageUrl?: string;
}

const EventsPageContent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Mostrar eventos futuros, ordenados por fecha mÃ¡s prÃ³xima
        const q = query(collection(db, 'events'), orderBy('date', 'asc'));
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            summary: data.summary,
            date: (data.date as Timestamp).toDate(),
            location: data.location,
            imageUrl: data.imageUrl,
          }
        }).filter(event => event.date >= new Date()); // Filtrar solo eventos futuros
        
        setEvents(eventsData);
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
      <h1>Eventos</h1>
      <div className="events-grid">
        {loading ? (
          <p className="events-empty-message">Cargando eventos...</p>
        ) : events.length === 0 ? (
          <p className="events-empty-message">No hay eventos programados. ¡Anímate a crear el primero!</p>
        ) : (
          events.map(event => (
            <Link key={event.id} href={`/events/${event.id}`} className="event-card">
              {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="event-image"/>}
              <div className="event-info">
                <p className="event-date">{event.date.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-location">{event.location}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
    return <EventsPageContent />;
}




