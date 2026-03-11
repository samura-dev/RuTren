/**
 * Calculates calories burned based on MET value, weight, and duration.
 * Formula: Calories = (MET * 3.5 * Weight / 200) * durationInMinutes
 * 
 * @param durationSeconds Duration of activity in seconds
 * @param weightKg User weight in kg (default: 75)
 * @param intensity 'low' | 'medium' | 'high' (default: 'medium')
 * @returns Total calories burned
 */
export const calculateCalories = (
    durationSeconds: number,
    weightKg: number = 75,
    intensity: 'low' | 'medium' | 'high' = 'medium'
): number => {
    const durationMinutes = durationSeconds / 60;

    // MET values for weight training
    // Low: 3.5 (Light effort)
    // Medium: 5.0 (Moderate effort)
    // High: 6.0 (Vigorous effort)
    const metValues = {
        low: 3.5,
        medium: 5.0,
        high: 6.0
    };

    const met = metValues[intensity];
    const caloriesPerMinute = (met * 3.5 * weightKg) / 200;

    return Math.round(caloriesPerMinute * durationMinutes);
};
