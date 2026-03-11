import { create } from 'zustand';
import type { Habit, HabitIconId } from '@/types';
import { INITIAL_HABITS } from '@/data/habits';

type HabitState = {
    habits: Habit[];

    // Действия
    toggleHabit: (id: string) => void;
    addHabit: (title: string, iconId: HabitIconId, color: string) => void;
    deleteHabit: (id: string) => void;

    // Вычисляемые
    completedCount: () => number;
    progress: () => number;
};

export const useHabitStore = create<HabitState>((set, get) => ({
    habits: INITIAL_HABITS,

    toggleHabit: (id) =>
        set((state) => ({
            habits: state.habits.map((h) =>
                h.id === id ? { ...h, completed: !h.completed } : h
            ),
        })),

    addHabit: (title, iconId, color) =>
        set((state) => ({
            habits: [
                ...state.habits,
                {
                    id: Date.now().toString(),
                    title,
                    iconId,
                    streak: 0,
                    completed: false,
                    color,
                },
            ],
        })),

    deleteHabit: (id) =>
        set((state) => ({
            habits: state.habits.filter((h) => h.id !== id),
        })),

    completedCount: () => get().habits.filter((h) => h.completed).length,

    progress: () => {
        const habits = get().habits;
        if (habits.length === 0) return 0;
        return Math.round(
            (habits.filter((h) => h.completed).length / habits.length) * 100
        );
    },
}));
