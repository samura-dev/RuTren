import { create } from 'zustand';
import type { WorkoutProgram, ActiveWorkout, WorkoutHistory, WorkoutExercise } from '@/types';
import { INITIAL_PROGRAMS, INITIAL_HISTORY, WORKOUT_DATES } from '@/data/workouts';

type WorkoutState = {
    // Данные
    programs: WorkoutProgram[];
    activeWorkout: ActiveWorkout | null;
    history: WorkoutHistory[];
    workoutDates: string[];

    // Программы
    addProgram: (program: WorkoutProgram) => void;
    updateProgram: (id: string, data: Partial<WorkoutProgram>) => void;
    deleteProgram: (id: string) => void;
    reorderPrograms: (programs: WorkoutProgram[]) => void;

    // Активная тренировка
    startWorkout: (programId: string) => void;
    updateActiveExercises: (exercises: WorkoutExercise[]) => void;
    updateActiveDuration: (duration: number) => void;
    updateActiveCalories: (calories: number) => void;
    finishWorkout: () => WorkoutHistory | null;
    cancelWorkout: () => void;

    // Геттеры
    getProgramById: (id: string) => WorkoutProgram | undefined;
    getHistoryById: (id: string) => WorkoutHistory | undefined;
};

import { persist } from 'zustand/middleware';

// Get Telegram user ID safely for namespacing stores
const getUserId = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        return (window as any).Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    return 'default';
};

export const useWorkoutStore = create<WorkoutState>()(
    persist(
        (set, get) => ({
            programs: INITIAL_PROGRAMS,
            activeWorkout: null,
            history: INITIAL_HISTORY,
            workoutDates: WORKOUT_DATES,

            // === Программы ===

            addProgram: (program) =>
                set((state) => ({
                    programs: [...state.programs, program],
                })),

            updateProgram: (id, data) =>
                set((state) => ({
                    programs: state.programs.map((p) =>
                        p.id === id ? { ...p, ...data } : p
                    ),
                })),

            deleteProgram: (id) =>
                set((state) => ({
                    programs: state.programs.filter((p) => p.id !== id),
                })),

            reorderPrograms: (programs) => set({ programs }),

            // === Активная тренировка ===

            startWorkout: (programId) => {
                const program = get().programs.find((p) => p.id === programId);
                if (!program) return;

                set({
                    activeWorkout: {
                        programId,
                        startedAt: Date.now(),
                        duration: 0,
                        calories: 0,
                        exercises: program.exercises.map((ex) => ({
                            ...ex,
                            sets: ex.sets.length > 0
                                ? ex.sets
                                : [{ id: '1', weight: '', reps: '', isCompleted: false }],
                        })),
                    },
                });
            },

            updateActiveExercises: (exercises) =>
                set((state) => ({
                    activeWorkout: state.activeWorkout
                        ? { ...state.activeWorkout, exercises }
                        : null,
                })),

            updateActiveDuration: (duration) =>
                set((state) => ({
                    activeWorkout: state.activeWorkout
                        ? { ...state.activeWorkout, duration }
                        : null,
                })),

            updateActiveCalories: (calories) =>
                set((state) => ({
                    activeWorkout: state.activeWorkout
                        ? { ...state.activeWorkout, calories }
                        : null,
                })),

            finishWorkout: () => {
                const { activeWorkout, history, workoutDates, programs } = get();
                if (!activeWorkout) return null;

                const program = programs.find((p) => p.id === activeWorkout.programId);
                const today = new Date().toISOString().split('T')[0];

                // Считаем общий тоннаж
                let totalVolume = 0;
                activeWorkout.exercises.forEach((ex) => {
                    ex.sets.forEach((s) => {
                        if (s.isCompleted) {
                            totalVolume += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
                        }
                    });
                });

                const record: WorkoutHistory = {
                    id: `history-${Date.now()}`,
                    programId: activeWorkout.programId,
                    title: program?.title || 'Тренировка',
                    subtitle: `Завершено • ${Math.round(activeWorkout.duration / 60)} мин`,
                    date: today,
                    duration: activeWorkout.duration,
                    calories: activeWorkout.calories,
                    exercises: activeWorkout.exercises,
                    totalVolume,
                };

                set({
                    activeWorkout: null,
                    history: [record, ...history],
                    workoutDates: workoutDates.includes(today) ? workoutDates : [...workoutDates, today],
                });

                return record;
            },

            cancelWorkout: () => set({ activeWorkout: null }),

            // === Геттеры ===

            getProgramById: (id) => get().programs.find((p) => p.id === id),
            getHistoryById: (id) => get().history.find((h) => h.id === id),
        }),
        {
            name: `workout-storage-${getUserId()}`, // unique name
        }
    )
);
