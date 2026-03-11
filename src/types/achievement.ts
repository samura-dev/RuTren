// Типы достижений

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type AchievementIconId =
    | 'zap'
    | 'dumbbell'
    | 'target'
    | 'trophy'
    | 'crown'
    | 'star'
    | 'medal';

export type Achievement = {
    id: string;
    title: string;
    description: string;
    iconId: AchievementIconId;
    progress: number;
    maxProgress: number;
    isUnlocked: boolean;
    dateUnlocked?: string;
    rarity: AchievementRarity;
};
