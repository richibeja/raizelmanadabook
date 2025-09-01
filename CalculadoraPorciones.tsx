
'use client';

import { useState, FormEvent } from 'react';
import './CalculadoraPorciones.css'; // Importar el archivo CSS

// Estructura para los datos del formulario
interface PetData {
  weight: string;
  age: string; // en meses
  activityLevel: 'low' | 'medium' | 'high';
  isSterilized: boolean;
}

export default function CalculadoraPorciones() {
  const [petData, setPetData] = useState<PetData>({
    weight: '',
    age: '',
    activityLevel: 'medium',
    isSterilized: false,
  });
  const [recommendedPortion, setRecommendedPortion] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setPetData(prevData => ({
      ...prevData,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const calculatePortion = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { weight, age, activityLevel, isSterilized } = petData;
    const weightKg = parseFloat(weight);
    const ageMonths = parseInt(age);

    if (isNaN(weightKg) || isNaN(ageMonths) || weightKg <= 0 || ageMonths <= 0) {
        setError("Por favor, introduce un peso y edad válidos (mayores que cero).");
        setRecommendedPortion(null);
        return;
    }
    setError(null);

    // --- Lógica de Cálculo de Porción ---
    // Esta es una fórmula generalizada. Puede ser reemplazada por la específica de Raízel.
    // RER (Resting Energy Requirement) = 70 * (peso_kg ^ 0.75)
    // DER (Daily Energy Requirement) = RER * Factor
    const RER = 70 * Math.pow(weightKg, 0.75);
    let factor = 1.6; // Adulto promedio

    if (ageMonths < 4) factor = 3.0; // Cachorro joven
    else if (ageMonths < 12) factor = 2.0; // Cachorro mayor
    else if (isSterilized) factor = 1.4; // Adulto esterilizado

    if (activityLevel === 'high') factor *= 1.2;
    if (activityLevel === 'low') factor *= 0.8;

    const DER = RER * factor;

    // Asumiendo una densidad calórica promedio del alimento (ej. 400 kcal/100g)
    const foodCaloriesPerGram = 4.0; 
    const dailyGrams = DER / foodCaloriesPerGram;

    setRecommendedPortion(Math.round(dailyGrams));
  };

  return (
    <div className="calculator-container">
      <h2>Calculadora de Porciones Diarias</h2>
      <form onSubmit={calculatePortion} className="calculator-form">
        <div>
          <label htmlFor="weight">Peso de tu mascota (kg):</label>
          <input type="number" id="weight" name="weight" value={petData.weight} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="age">Edad de tu mascota (meses):</label>
          <input type="number" id="age" name="age" value={petData.age} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="activityLevel">Nivel de actividad:</label>
          <select id="activityLevel" name="activityLevel" value={petData.activityLevel} onChange={handleInputChange}>
            <option value="low">Bajo (Paseos cortos, duerme mucho)</option>
            <option value="medium">Medio (Paseos diarios, juega)</option>
            <option value="high">Alto (Muy activo, corre, entrena)</option>
          </select>
        </div>
        <div>
          <label>
            <input type="checkbox" name="isSterilized" checked={petData.isSterilized} onChange={handleInputChange} />
            ¿Está esterilizado?
          </label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Calcular Porción</button>
      </form>

      {recommendedPortion !== null && (
        <div className="calculator-result">
          <h3>Porción Diaria Recomendada:</h3>
          <p>{recommendedPortion} gramos</p>
          <small>Divide esta cantidad en 2 o 3 comidas a lo largo del día.</small>
        </div>
      )}
    </div>
  );
}
