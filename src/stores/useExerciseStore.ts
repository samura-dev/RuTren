import { create } from 'zustand';
import type { Exercise, MuscleGroup } from '@/types';
import { EXERCISE_DB, MUSCLE_GROUPS } from '@/data/exercises';

type ExerciseState = {
    exercises: Exercise[];
    muscleGroups: MuscleGroup[];

    // Действия
    addExercise: (exercise: Exercise) => void;
    getExerciseById: (id: string) => Exercise | undefined;
    getByMuscleGroup: (group: MuscleGroup) => Exercise[];
    searchExercises: (query: string) => Exercise[];
};

export const useExerciseStore = create<ExerciseState>((set, get) => ({
    exercises: EXERCISE_DB,
    muscleGroups: MUSCLE_GROUPS,

    addExercise: (exercise) =>
        set((state) => ({
            exercises: [...state.exercises, exercise],
        })),

    getExerciseById: (id) => get().exercises.find((e) => e.id === id),

    getByMuscleGroup: (group) =>
        get().exercises.filter((e) => e.muscleGroup === group),

    searchExercises: (query) => {
        const q = query.toLowerCase().trim();
        if (!q) return get().exercises;
        return get().exercises.filter((e) =>
            e.name.toLowerCase().includes(q) || e.muscleGroup.toLowerCase().includes(q)
        );
    },
}));
