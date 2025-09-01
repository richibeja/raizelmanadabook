// components/SponsorsCarousel.tsx
import React, { useEffect, useState } from 'react';
import { getSponsors, Sponsor } from '../lib/firebase';

const SponsorsCarousel: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSponsors = async () => {
      const fetchedSponsors = await getSponsors();
      setSponsors(fetchedSponsors);
    };
    fetchSponsors();
  }, []);

  useEffect(() => {
    if (sponsors.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sponsors.length);
      }, 5000); // Change sponsor every 5 seconds
      return () => clearInterval(interval);
    }
  }, [sponsors]);

  if (sponsors.length === 0) {
    return null; // Don't render if no sponsors
  }

  const currentSponsor = sponsors[currentIndex];

  return (
    <div className="sponsors-carousel-container">
      <h2>Nuestros Patrocinadores</h2>
      <div className="sponsor-card">
        <a href={currentSponsor.websiteUrl} target="_blank" rel="noopener noreferrer">
          <img src={currentSponsor.logoUrl} alt={currentSponsor.name} className="sponsor-logo" />
          <h3>{currentSponsor.name}</h3>
        </a>
        <p>{currentSponsor.description}</p>
      </div>
      <style jsx>{`
        .sponsors-carousel-container {
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          background-color: #f0f2f5;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .sponsor-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 15px;
        }
        .sponsor-logo {
          max-width: 150px;
          max-height: 100px;
          object-fit: contain;
          margin-bottom: 10px;
        }
        .sponsor-card h3 {
          margin: 0 0 5px 0;
          color: #333;
        }
        .sponsor-card p {
          color: #666;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default SponsorsCarousel;

