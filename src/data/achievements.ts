import type { Achievement, AchievementIconId } from '@/types';
import { Trophy, Medal, Crown, Zap, Dumbbell, Target, Star } from 'lucide-react';
import type { ElementType } from 'react';

// Маппинг iconId → React-компонент
export const ACHIEVEMENT_ICON_MAP: Record<AchievementIconId, ElementType> = {
    zap: Zap,
    dumbbell: Dumbbell,
    target: Target,
    trophy: Trophy,
    crown: Crown,
    star: Star,
    medal: Medal,
};

// Начальные моки достижений
export const INITIAL_ACHIEVEMENTS: Achievement[] = [
    {
        id: '1',
        title: 'Первые шаги',
        description: 'Завершите свою первую тренировку',
        iconId: 'zap',
        progress: 1,
        maxProgress: 1,
        isUnlocked: true,
        dateUnlocked: '05.02.2026',
        rarity: 'common',
    },
    {
        id: '2',
        title: 'Недельный воин',
        description: 'Тренируйтесь 3 раза за одну неделю',
        iconId: 'dumbbell',
        progress: 2,
        maxProgress: 3,
        isUnlocked: false,
        rarity: 'common',
    },
    {
        id: '3',
        title: 'Дисциплина',
        description: 'Поддерживайте стрик привычек 7 дней',
        iconId: 'target',
        progress: 5,
        maxProgress: 7,
        isUnlocked: false,
        rarity: 'rare',
    },
    {
        id: '4',
        title: 'Тяжеловес',
        description: 'Поднимите в сумме 10 тонн за тренировку',
        iconId: 'trophy',
        progress: 8500,
        maxProgress: 10000,
        isUnlocked: false,
        rarity: 'epic',
    },
    {
        id: '5',
        title: 'Легенда RuTren',
        description: 'Достигните 50 уровня профиля',
        iconId: 'crown',
        progress: 12,
        maxProgress: 50,
        isUnlocked: false,
        rarity: 'legendary',
    },
    {
        id: '6',
        title: 'Ранняя пташка',
        description: 'Завершите тренировку до 8 утра',
        iconId: 'star',
        progress: 0,
        maxProgress: 1,
        isUnlocked: false,
        rarity: 'rare',
    },
];
