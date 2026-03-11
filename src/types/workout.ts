// Типы тренировок и программ

export type WorkoutSet = {
    id: string;
    weight: string;
    reps: string;
    isCompleted: boolean;
};

export type WorkoutExercise = {
    exerciseId: string; // ссылка на Exercise из exercises.ts
    title: string;
    subtitle: string;
    sets: WorkoutSet[];
};

export type WorkoutProgram = {
    id: string;
    title: string;
    subtitle: string;
    type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
    exercises: WorkoutExercise[];
    order: number;
};

export type ActiveWorkout = {
    programId: string;
    startedAt: number; // timestamp
    duration: number; // секунды
    calories: number;
    exercises: WorkoutExercise[];
};

export type WorkoutHistory = {
    id: string;
    programId: string;
    title: string;
    subtitle: string;
    date: string;
    duration: number; // секунды
    calories: number;
    exercises: WorkoutExercise[];
    totalVolume: number; // кг (общий тоннаж)
};
