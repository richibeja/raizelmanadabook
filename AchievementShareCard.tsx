
'use client';

import React from 'react';

interface AchievementShareCardProps {
  badgeName: string;
  badgeDescription: string;
  userName: string;
  // Puedes añadir imageUrl para el avatar del usuario o un icono de la medalla
}

export default function AchievementShareCard({ badgeName, badgeDescription, userName }: AchievementShareCardProps) {
  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>¡Nuevo Logro en ManadaBook!</h2>
      <div style={badgeIconStyle}>🏅</div>
      <h3 style={badgeNameStyle}>{badgeName}</h3>
      <p style={descriptionStyle}>{badgeDescription}</p>
      <p style={userStyle}>¡Felicidades a {userName}!</p>
      <p style={ctaStyle}>Únete a ManadaBook y gana tus propias medallas.</p>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f0f8ff',
  border: '2px solid #4CAF50',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  maxWidth: '350px',
  margin: '20px auto',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  color: '#333',
};

const titleStyle: React.CSSProperties = {
  color: '#4CAF50',
  fontSize: '22px',
  marginBottom: '15px',
};

const badgeIconStyle: React.CSSProperties = {
  fontSize: '60px',
  marginBottom: '10px',
};

const badgeNameStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px',
};

const descriptionStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#555',
  marginBottom: '20px',
};

const userStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#007bff',
  marginBottom: '10px',
};

const ctaStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#777',
};
