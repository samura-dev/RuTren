/**
 * Расчет процента жира в организме
 * Использует формулу флота США (US Navy Method) как наиболее точную для домашних условий.
 * Если данных для нее нет (шея, талия), использует формулу на основе ИМТ (менее точная).
 */

type BodyFatParams = {
    gender: 'male' | 'female';
    age: number;
    height: number; // см
    weight: number; // кг
    waist?: number; // см
    neck?: number; // см
    hips?: number; // см (только для женщин)
};

export const calculateBodyFat = ({ gender, age, height, weight, waist, neck, hips }: BodyFatParams): number | null => {
    // 1. Попытка расчета по методу флота США (US Navy Method)
    if (waist && neck && height) {
        if (gender === 'male') {
            // Формула для мужчин: 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
            const abdomen = waist; // Часто используют талию как abdomen
            if (abdomen > neck) {
                const fat = 86.010 * Math.log10(abdomen - neck) - 70.041 * Math.log10(height) + 36.76;
                return parseFloat(fat.toFixed(1));
            }
        } else if (gender === 'female' && hips) {
            // Формула для женщин: 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
            const fat = 163.205 * Math.log10(waist + hips - neck) - 97.684 * Math.log10(height) - 78.387;
            return parseFloat(fat.toFixed(1));
        }
    }

    // 2. Фоллбэк: Формула на основе ИМТ (BMI)
    // Body Fat % = (1.20 * BMI) + (0.23 * Age) - (10.8 * sex) - 5.4
    // sex: 1 for men, 0 for women
    if (height && weight && age) {
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        const sexCoefficient = gender === 'male' ? 1 : 0;

        const fat = (1.20 * bmi) + (0.23 * age) - (10.8 * sexCoefficient) - 5.4;

        // Ограничиваем разумными рамками (хотя формула может давать и отрицательные значения теоретически)
        return parseFloat(Math.max(2, fat).toFixed(1));
    }

    return null;
};
