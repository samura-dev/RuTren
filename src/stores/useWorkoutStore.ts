import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkoutProgram, ActiveWorkout, WorkoutHistory, WorkoutExercise } from '@/types';
import { INITIAL_PROGRAMS, INITIAL_HISTORY, WORKOUT_DATES } from '@/data/workouts';
import pb from '@/lib/pocketbase';

type WorkoutState = {
    programs: WorkoutProgram[];
    activeWorkout: ActiveWorkout | null;
    history: WorkoutHistory[];
    workoutDates: string[];
    loading: boolean;
    error: string | null;

    syncWorkouts: () => Promise<void>;

    // Программы
    addProgram: (program: Omit<WorkoutProgram, 'id'>) => Promise<void>;
    updateProgram: (id: string, data: Partial<WorkoutProgram>) => Promise<void>;
    deleteProgram: (id: string) => Promise<void>;
    reorderPrograms: (programs: WorkoutProgram[]) => Promise<void>;

    // Активная тренировка
    startWorkout: (programId: string) => void;
    updateActiveExercises: (exercises: WorkoutExercise[]) => void;
    updateActiveDuration: (duration: number) => void;
    updateActiveCalories: (calories: number) => void;
    finishWorkout: () => Promise<WorkoutHistory | null>;
    cancelWorkout: () => void;

    // Геттеры
    getProgramById: (id: string) => WorkoutProgram | undefined;
    getHistoryById: (id: string) => WorkoutHistory | undefined;
};

// Get Telegram user ID safely for namespacing stores
const getUserId = () => {
    const w = window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number } } } } };
    if (typeof window !== 'undefined' && w.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        return w.Telegram.WebApp.initDataUnsafe.user.id.toString();
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
            loading: false,
            error: null,

            syncWorkouts: async () => {
                const authRecord = pb.authStore.record;
                if (!authRecord) {
                    set({ error: 'Not authenticated in PocketBase' });
                    return;
                }

                try {
                    set({ loading: true, error: null });

                    // Загружаем программы и историю параллельно
                    const [programsRes, historyRes] = await Promise.all([
                        pb.collection('programs').getFullList({ filter: `user="${authRecord.id}"`, sort: 'order' }),
                        pb.collection('history').getFullList({ filter: `user="${authRecord.id}"`, sort: '-created' })
                    ]);

                    let loadedPrograms = programsRes.map(p => ({
                        id: p.id,
                        title: p.title,
                        subtitle: p.subtitle,
                        type: p.type as any,
                        exercises: p.exercises,
                        order: p.order,
                    }));

                    // Если программ нет, сидируем дефолтные для нового юзера (опционально)
                    if (loadedPrograms.length === 0) {
                        for (const prog of INITIAL_PROGRAMS) {
                            const newProg = await pb.collection('programs').create({
                                user: authRecord.id,
                                title: prog.title,
                                subtitle: prog.subtitle,
                                type: prog.type,
                                exercises: prog.exercises,
                                order: prog.order
                            });
                            loadedPrograms.push({
                                id: newProg.id,
                                title: newProg.title,
                                subtitle: newProg.subtitle,
                                type: newProg.type as any,
                                exercises: newProg.exercises,
                                order: newProg.order
                            });
                        }
                    }

                    const loadedHistory = historyRes.map(h => ({
                        id: h.id,
                        programId: h.programId,
                        title: h.title,
                        subtitle: h.subtitle,
                        date: h.date,
                        duration: h.duration,
                        calories: h.calories,
                        totalVolume: h.totalVolume,
                        exercises: h.exercises,
                    }));

                    const dates = [...new Set(loadedHistory.map(h => h.date))];

                    set({
                        programs: loadedPrograms,
                        history: loadedHistory,
                        workoutDates: dates,
                        loading: false
                    });
                } catch (err: any) {
                    console.error('Failed to sync workouts from PB', err);
                    set({ error: err.message, loading: false });
                }
            },

            addProgram: async (program) => {
                const authRecord = pb.authStore.record;
                if (!authRecord) return;
                
                try {
                    const created = await pb.collection('programs').create({
                        ...program,
                        user: authRecord.id
                    });
                    
                    const newProg: WorkoutProgram = {
                        ...program,
                        id: created.id
                    };

                    set(state => ({
                        programs: [...state.programs, newProg]
                    }));
                } catch (e) {
                    console.error('Failed to create program in PB', e);
                }
            },

            updateProgram: async (id, data) => {
                // Optimistic UI
                set((state) => ({
                    programs: state.programs.map((p) => p.id === id ? { ...p, ...data } : p),
                }));

                const authRecord = pb.authStore.record;
                if (authRecord) {
                    try {
                        await pb.collection('programs').update(id, data);
                    } catch (e) {
                        console.error('Failed to update program in PB', e);
                    }
                }
            },

            deleteProgram: async (id) => {
                // Optimistic UI
                set((state) => ({
                    programs: state.programs.filter((p) => p.id !== id),
                }));

                const authRecord = pb.authStore.record;
                if (authRecord) {
                    try {
                        await pb.collection('programs').delete(id);
                    } catch (e) {
                        console.error('Failed to delete program in PB', e);
                    }
                }
            },

            reorderPrograms: async (programs) => {
                set({ programs });
                
                const authRecord = pb.authStore.record;
                if (authRecord) {
                    try {
                        // Оптимизация: можно обновлять пачкой, но PB пока поддерживает только по одному или батчами
                        // Если программ мало, можно через Promise.all
                        await Promise.all(programs.map((p, index) => 
                           pb.collection('programs').update(p.id, { order: index })
                        ));
                    } catch (e) {
                        console.error('Failed to reorder programs in PB', e);
                    }
                }
            },

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
                    activeWorkout: state.activeWorkout ? { ...state.activeWorkout, exercises } : null,
                })),

            updateActiveDuration: (duration) =>
                set((state) => ({
                    activeWorkout: state.activeWorkout ? { ...state.activeWorkout, duration } : null,
                })),

            updateActiveCalories: (calories) =>
                set((state) => ({
                    activeWorkout: state.activeWorkout ? { ...state.activeWorkout, calories } : null,
                })),

            finishWorkout: async () => {
                const { activeWorkout, history, workoutDates, programs } = get();
                if (!activeWorkout) return null;

                const program = programs.find((p) => p.id === activeWorkout.programId);
                const today = new Date().toISOString().split('T')[0];

                let totalVolume = 0;
                activeWorkout.exercises.forEach((ex) => {
                    ex.sets.forEach((s) => {
                        if (s.isCompleted) {
                            totalVolume += (parseFloat(s.weight) || 0) * (parseInt(s.reps) || 0);
                        }
                    });
                });

                const authRecord = pb.authStore.record;
                let recordId = `history-${Date.now()}`;

                if (authRecord) {
                    try {
                        const created = await pb.collection('history').create({
                            user: authRecord.id,
                            programId: activeWorkout.programId,
                            title: program?.title || 'Тренировка',
                            subtitle: `Завершено • ${Math.round(activeWorkout.duration / 60)} мин`,
                            date: today,
                            duration: activeWorkout.duration,
                            calories: activeWorkout.calories,
                            totalVolume,
                            exercises: activeWorkout.exercises
                        });
                        recordId = created.id;
                    } catch (e) {
                        console.error('Failed to save history in PB', e);
                    }
                }

                const record: WorkoutHistory = {
                    id: recordId,
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

            getProgramById: (id) => get().programs.find((p) => p.id === id),
            getHistoryById: (id) => get().history.find((h) => h.id === id),
        }),
        {
            name: `workout-storage-${getUserId()}`, // unique name
        }
    )
);
