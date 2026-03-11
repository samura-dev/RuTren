// Данные пользователя

export type UserProfile = {
    name: string;
    age: number;
    weight: number; // кг
    height: number; // см
    gender: 'male' | 'female';
    goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'endurance' | 'strength';
    experience: 'beginner' | 'intermediate' | 'advanced';
    avatar?: string;
};

export type UserSettings = {
    darkTheme: boolean;
    notifications: boolean;
    language: string;
    units: 'metric' | 'imperial';
};

export type OnboardingData = {
    name: string;
    age: number;
    weight: number;
    height: number;
    gender: 'male' | 'female';
    goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'endurance' | 'strength';
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    experience?: 'beginner' | 'intermediate' | 'advanced';
    avatar?: string;
};

export type User = {
    id: string;
    profile: UserProfile;
    settings: UserSettings;
    isOnboarded: boolean;
    level: number;
    xp: number;
    streakDays: number;
    joinedAt: string;
};
