// Типы упражнений — реэкспорт из data/exercises.ts

export type MuscleGroup =
    | 'Грудь'
    | 'Спина'
    | 'Ноги'
    | 'Плечи'
    | 'Руки'
    | 'Пресс'
    | 'Кардио'
    | 'Другое';

export type Exercise = {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    description?: string;
    equipment?: string;
    instructions?: string[];
    imageUrl?: string;
    gifUrl?: string;
};
