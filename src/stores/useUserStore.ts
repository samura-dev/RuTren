import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserProfile, UserSettings, OnboardingData } from '@/types';
import pb from '@/lib/pocketbase';

// Дефолтный юзер (мок/fallback)
const DEFAULT_USER: User = {
    id: 'user-1',
    profile: {
        name: 'Даниил',
        age: 22,
        weight: 78.5,
        height: 180,
        gender: 'male',
        goal: 'gain_muscle',
        experience: 'intermediate',
    },
    settings: {
        darkTheme: true,
        notifications: true,
        language: 'ru',
        units: 'metric',
    },
    isOnboarded: false,
    level: 1,
    xp: 0,
    streakDays: 0,
    joinedAt: new Date().toISOString().split('T')[0],
};

type UserState = {
    user: User;
    loading: boolean;
    error: string | null;

    // Свойство для хранения ID профиля в PocketBase
    pbProfileId: string | null;

    // Действия
    syncProfile: () => Promise<void>;
    setUser: (user: User) => void;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    updateSettings: (data: Partial<UserSettings>) => Promise<void>;
    completeOnboarding: (data: OnboardingData) => Promise<void>;
    addXP: (amount: number) => Promise<void>;
    logout: () => void;
};

// Get Telegram user ID safely for namespacing stores
const getUserId = () => {
    const w = window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number } } } } };
    if (typeof window !== 'undefined' && w.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
        return w.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    return 'default';
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: DEFAULT_USER,
            loading: false,
            error: null,
            pbProfileId: null,

            syncProfile: async () => {
                const authRecord = pb.authStore.record;
                if (!authRecord) {
                    set({ error: 'Not authenticated in PocketBase' });
                    return;
                }

                try {
                    set({ loading: true, error: null });
                    // Пытаемся найти профиль для текущего authRecord
                    let profileRecord;
                    try {
                        profileRecord = await pb.collection('profiles').getFirstListItem(`user="${authRecord.id}"`);
                    } catch (err: any) {
                        // Если профиль не найден (404), создаем его
                        if (err.status === 404) {
                            const newProfileData = {
                                user: authRecord.id,
                                name: authRecord.username || 'User',
                                age: 20,
                                weight: 70,
                                height: 170,
                                gender: 'male',
                                goal: 'maintain',
                                experience: 'beginner',
                                darkTheme: true,
                                notifications: true,
                                language: 'ru',
                                units: 'metric',
                                isOnboarded: false,
                                level: 1,
                                xp: 0,
                                streakDays: 0,
                                joinedAt: new Date().toISOString().split('T')[0]
                            };
                            profileRecord = await pb.collection('profiles').create(newProfileData);
                        } else {
                            throw err;
                        }
                    }

                    // Маппинг из PocketBase в Zustand состояние
                    set((state) => ({
                        pbProfileId: profileRecord.id,
                        user: {
                            ...state.user,
                            id: profileRecord.id,
                            profile: {
                                name: profileRecord.name,
                                age: profileRecord.age,
                                weight: profileRecord.weight,
                                height: profileRecord.height,
                                gender: profileRecord.gender as any,
                                goal: profileRecord.goal as any,
                                experience: profileRecord.experience as any,
                                avatar: profileRecord.avatar || undefined,
                            },
                            settings: {
                                darkTheme: profileRecord.darkTheme,
                                notifications: profileRecord.notifications,
                                language: profileRecord.language,
                                units: profileRecord.units as any,
                            },
                            isOnboarded: profileRecord.isOnboarded,
                            level: profileRecord.level || 1,
                            xp: profileRecord.xp || 0,
                            streakDays: profileRecord.streakDays || 0,
                            joinedAt: profileRecord.joinedAt,
                        }
                    }));
                } catch (error: any) {
                    console.error('Failed to sync profile', error);
                    set({ error: error.message });
                } finally {
                    set({ loading: false });
                }
            },

            setUser: (user) => set({ user }),

            updateProfile: async (data) => {
                // Optimistic update
                set((state) => ({
                    user: {
                        ...state.user,
                        profile: { ...state.user.profile, ...data },
                    },
                }));

                const { pbProfileId } = get();
                if (pbProfileId && pb.authStore.isValid) {
                    try {
                        await pb.collection('profiles').update(pbProfileId, data);
                    } catch (e) {
                        console.error('Failed to update profile in PB', e);
                    }
                }
            },

            updateSettings: async (data) => {
                // Optimistic update
                set((state) => ({
                    user: {
                        ...state.user,
                        settings: { ...state.user.settings, ...data },
                    },
                }));

                const { pbProfileId } = get();
                if (pbProfileId && pb.authStore.isValid) {
                    try {
                        await pb.collection('profiles').update(pbProfileId, data);
                    } catch (e) {
                        console.error('Failed to update settings in PB', e);
                    }
                }
            },

            completeOnboarding: async (data) => {
                set((state) => ({
                    user: {
                        ...state.user,
                        isOnboarded: true,
                        profile: {
                            ...state.user.profile,
                            name: data.name,
                            age: data.age,
                            weight: data.weight,
                            height: data.height,
                            gender: data.gender,
                            goal: data.goal,
                            experience: data.experience || 'beginner',
                        },
                    },
                }));

                const { pbProfileId } = get();
                if (pbProfileId && pb.authStore.isValid) {
                    try {
                        await pb.collection('profiles').update(pbProfileId, {
                            ...data,
                            isOnboarded: true
                        });
                    } catch (e) {
                        console.error('Failed to complete onboarding in PB', e);
                    }
                }
            },

            addXP: async (amount) => {
                let newLevel = 1;
                let newXP = 0;

                set((state) => {
                    newXP = state.user.xp + amount;
                    const xpPerLevel = 500;
                    newLevel = Math.floor(newXP / xpPerLevel) + 1;
                    return {
                        user: { ...state.user, xp: newXP, level: newLevel },
                    };
                });

                const { pbProfileId } = get();
                if (pbProfileId && pb.authStore.isValid) {
                    try {
                        await pb.collection('profiles').update(pbProfileId, {
                            xp: newXP,
                            level: newLevel
                        });
                    } catch (e) {
                        console.error('Failed to update XP in PB', e);
                    }
                }
            },

            logout: () => set({ user: { ...DEFAULT_USER, isOnboarded: false }, pbProfileId: null, error: null }),
        }),
        {
            name: `user-storage-${getUserId()}`, // unique name per Telegram instance
        }
    )
);
