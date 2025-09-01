'use client';

import { useState } from 'react';
import Link from 'next/link';
import './ProductRecommender.css';

const questions = [
  {
    questionText: '¿Cuál es la edad de tu mascota?',
    answerOptions: [
      { answerText: 'Cachorro (Menos de 1 año)', value: 'puppy' },
      { answerText: 'Adulto (1-7 años)', value: 'adult' },
      { answerText: 'Senior (Más de 7 años)', value: 'senior' },
    ],
  },
  {
    questionText: '¿Cuál es su nivel de actividad diario?',
    answerOptions: [
      { answerText: 'Bajo (Paseos tranquilos, duerme mucho)', value: 'low' },
      { answerText: 'Medio (Paseos diarios y juegos)', value: 'medium' },
      { answerText: 'Alto (Corre, entrena o es muy activo)', value: 'high' },
    ],
  },
  {
    questionText: '¿Prefieres máxima nutrición o máxima conveniencia?',
    answerOptions: [
      { answerText: 'Máxima nutrición (Dieta cruda BARF)', value: 'barf' },
      { answerText: 'Máxima conveniencia (Alimento seco natural)', value: 'pellets' },
    ],
  },
];

const recommendations = {
    'Vital BARF Pollo': {
        id: 'PRODUCT_ID_POLLO', // Reemplazar con el ID real del producto en Firestore
        description: 'Ideal para una digestión suave y un pelaje brillante. La mejor opción para empezar con la dieta BARF.'
    },
    'Vital BARF Res': {
        id: 'PRODUCT_ID_RES', // Reemplazar con el ID real del producto en Firestore
        description: 'Perfecto para perros activos y deportistas, rico en hierro y proteínas para un máximo rendimiento.'
    },
    'Vital Pellets': {
        id: 'PRODUCT_ID_PELLETS', // Reemplazar con el ID real del producto en Firestore
        description: 'La nutrición de ingredientes naturales con la facilidad de un alimento seco. Prensado en frío para conservar nutrientes.'
    }
};

export default function ProductRecommender() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ name: string; data: { id: string; description: string; } } | null>(null);

  const handleAnswerOptionClick = (value: string) => {
    const nextQuestion = currentQuestion + 1;
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      calculateResult(newAnswers);
      setShowResult(true);
    }
  };

  const calculateResult = (finalAnswers: { [key: number]: string }) => {
    // Lógica de recomendación
    if (finalAnswers[2] === 'pellets') {
        setResult({ name: 'Vital Pellets', data: recommendations['Vital Pellets'] });
        return;
    }
    
    if (finalAnswers[1] === 'high' || finalAnswers[0] === 'puppy') {
        setResult({ name: 'Vital BARF Res', data: recommendations['Vital BARF Res'] });
    } else {
        setResult({ name: 'Vital BARF Pollo', data: recommendations['Vital BARF Pollo'] });
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  }

  return (
    <div className="recommender-container">
      {showResult && result ? (
        <div className="result-section">
          <h2>El producto ideal para tu mascota es:</h2>
          <h3>{result.name}</h3>
          <p>{result.data.description}</p>
          <div className="result-actions">
            <Link href={`/products/${result.data.id}`} className="result-button primary">Ver Producto</Link>
            <button onClick={handleReset} className="result-button secondary">Hacer el test de nuevo</button>
          </div>
        </div>
      ) : (
        <div className="question-section">
          <div className="question-count">
            <span>Pregunta {currentQuestion + 1}</span>/{questions.length}
          </div>
          <div className="question-text">{questions[currentQuestion].questionText}</div>
          <div className="answer-options">
            {questions[currentQuestion].answerOptions.map((option, index) => (
              <button key={index} onClick={() => handleAnswerOptionClick(option.value)}>
                {option.answerText}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
