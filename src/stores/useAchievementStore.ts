import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Achievement } from '@/types';
import { INITIAL_ACHIEVEMENTS } from '@/data/achievements';

interface AchievementState {
    achievements: Achievement[];

    // Actions
    unlockAchievement: (id: string) => void;
    updateProgress: (id: string, progress: number) => void;
    resetAchievements: () => void;

    // Computed (via getters or selector)
    getUnlockedCount: () => number;
    getTotalCount: () => number;
}

export const useAchievementStore = create<AchievementState>()(
    persist(
        (set, get) => ({
            achievements: INITIAL_ACHIEVEMENTS,

            unlockAchievement: (id) => set((state) => ({
                achievements: state.achievements.map((a) =>
                    a.id === id ? { ...a, isUnlocked: true, dateUnlocked: new Date().toLocaleDateString('ru-RU') } : a
                )
            })),

            updateProgress: (id, progress) => set((state) => ({
                achievements: state.achievements.map((a) => {
                    if (a.id !== id) return a;

                    const newProgress = Math.min(progress, a.maxProgress);
                    const isUnlocked = newProgress >= a.maxProgress && !a.isUnlocked;

                    return {
                        ...a,
                        progress: newProgress,
                        isUnlocked: isUnlocked || a.isUnlocked,
                        dateUnlocked: isUnlocked ? new Date().toLocaleDateString('ru-RU') : a.dateUnlocked
                    };
                })
            })),

            resetAchievements: () => set({ achievements: INITIAL_ACHIEVEMENTS }),

            getUnlockedCount: () => get().achievements.filter(a => a.isUnlocked).length,
            getTotalCount: () => get().achievements.length,
        }),
        {
            name: 'rutren-achievement-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
