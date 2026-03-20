import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Habit, HabitIconId } from '@/types';
import { INITIAL_HABITS } from '@/data/habits';
import pb from '@/lib/pocketbase';

type HabitState = {
    habits: Habit[];
    loading: boolean;
    error: string | null;

    syncHabits: () => Promise<void>;
    toggleHabit: (id: string) => Promise<void>;
    addHabit: (title: string, iconId: HabitIconId, color: string) => Promise<void>;
    deleteHabit: (id: string) => Promise<void>;

    completedCount: () => number;
    progress: () => number;
};

const getUserId = () => {
    const w = window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number } } } } };
    if (typeof window !== 'undefined' && w.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        return w.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    return 'default';
};

export const useHabitStore = create<HabitState>()(
    persist(
        (set, get) => ({
            habits: INITIAL_HABITS,
            loading: false,
            error: null,

            syncHabits: async () => {
                const authRecord = pb.authStore.record;
                if (!authRecord) return;
                
                try {
                    set({ loading: true, error: null });
                    const records = await pb.collection('habits').getFullList({
                        filter: `user="${authRecord.id}"`,
                        sort: 'order'
                    });

                    const today = new Date().toISOString().split('T')[0];

                    if (records.length === 0) {
                        // Seed defaults
                        const mapped: Habit[] = [];
                        for (let i = 0; i < INITIAL_HABITS.length; i++) {
                            const initial = INITIAL_HABITS[i];
                            const created = await pb.collection('habits').create({
                                user: authRecord.id,
                                title: initial.title,
                                description: '',
                                icon: initial.iconId,
                                color: initial.color,
                                completedDates: [],
                                order: i
                            });
                            mapped.push({
                                id: created.id,
                                title: created.title,
                                iconId: created.icon as HabitIconId,
                                streak: 0,
                                completed: false,
                                color: created.color
                            });
                        }
                        set({ habits: mapped, loading: false });
                        return;
                    }

                    const mapped = records.map((r): Habit => {
                        const dates: string[] = Array.isArray(r.completedDates) ? r.completedDates : [];
                        return {
                            id: r.id,
                            title: r.title,
                            iconId: r.icon as HabitIconId,
                            color: r.color,
                            streak: dates.length, // Simplified streak (total completed)
                            completed: dates.includes(today)
                        };
                    });

                    set({ habits: mapped, loading: false });
                } catch (err: any) {
                    console.error('Failed to sync habits', err);
                    set({ error: err.message, loading: false });
                }
            },

            toggleHabit: async (id) => {
                const today = new Date().toISOString().split('T')[0];
                let newCompletedState = false;

                // Optimistic UI
                set((state) => ({
                    habits: state.habits.map((h) => {
                        if (h.id === id) {
                            newCompletedState = !h.completed;
                            return { 
                                ...h, 
                                completed: newCompletedState,
                                streak: newCompletedState ? h.streak + 1 : Math.max(0, h.streak - 1)
                            };
                        }
                        return h;
                    }),
                }));

                const authRecord = pb.authStore.record;
                if (authRecord) {
                    try {
                        const record = await pb.collection('habits').getOne(id);
                        let dates: string[] = Array.isArray(record.completedDates) ? record.completedDates : [];
                        
                        if (newCompletedState && !dates.includes(today)) {
                            dates.push(today);
                        } else if (!newCompletedState) {
                            dates = dates.filter(d => d !== today);
                        }

                        await pb.collection('habits').update(id, { completedDates: dates });
                    } catch (e) {
                        console.error('Failed to toggle habit in PB', e);
                    }
                }
            },

            addHabit: async (title, iconId, color) => {
                const authRecord = pb.authStore.record;
                if (!authRecord) return;

                const initialHabit: Habit = {
                    id: Date.now().toString(),
                    title,
                    iconId,
                    streak: 0,
                    completed: false,
                    color
                };

                // Optimistic insertion (might replace ID after PB returns)
                set(state => ({ habits: [...state.habits, initialHabit] }));

                try {
                    const created = await pb.collection('habits').create({
                        user: authRecord.id,
                        title,
                        description: '',
                        icon: iconId,
                        color,
                        completedDates: [],
                        order: 0
                    });

                    set(state => ({
                        habits: state.habits.map(h => 
                            h.id === initialHabit.id ? { ...h, id: created.id } : h
                        )
                    }));
                } catch (e) {
                    console.error('Failed to add habit in PB', e);
                    // Revert optimism if needed
                    set(state => ({
                        habits: state.habits.filter(h => h.id !== initialHabit.id)
                    }));
                }
            },

            deleteHabit: async (id) => {
                set((state) => ({
                    habits: state.habits.filter((h) => h.id !== id),
                }));

                const authRecord = pb.authStore.record;
                if (authRecord) {
                    try {
                        await pb.collection('habits').delete(id);
                    } catch (e) {
                        console.error('Failed to delete habit in PB', e);
                    }
                }
            },

            completedCount: () => get().habits.filter((h) => h.completed).length,

            progress: () => {
                const habits = get().habits;
                if (habits.length === 0) return 0;
                return Math.round((habits.filter((h) => h.completed).length / habits.length) * 100);
            },
        }),
        {
            name: `habit-storage-${getUserId()}`
        }
    )
);
