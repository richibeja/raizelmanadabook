'use client';

interface Challenge {
  title: string;
  description: string;
  reward: string;
  type: 'community' | 'action';
}

import './ChallengeCard.css';

interface ChallengeCardProps {
    challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {

  const handleParticipate = () => {
    // En una implementación futura, esto podría registrar el intento del usuario
    // o redirigirlo a la sección correspondiente para completar el reto.
    alert(`¡Aceptaste el reto "${challenge.title}"!

Para completarlo: ${challenge.description}`);
  };

  return (
    <div className="challenge-card">
      <div className={`challenge-type-banner type-${challenge.type}`}>
        {challenge.type === 'community' ? 'Comunidad' : 'Acción'}
      </div>
      <div className="challenge-content">
        <h3>{challenge.title}</h3>
        <p>{challenge.description}</p>
        <div className="challenge-reward">
            <strong>Recompensa:</strong> {challenge.reward}
        </div>
        <button onClick={handleParticipate} className="participate-button">¡Acepto el Reto!</button>
      </div>
    </div>
  );
}
