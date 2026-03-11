import type { Habit, HabitIconId } from '@/types';
import {
    Droplets, Moon, Zap, Footprints, Flame,
    Dumbbell, Apple, BookOpen, Star,
} from 'lucide-react';
import type { ElementType } from 'react';

// Маппинг iconId → React-компонент
export const HABIT_ICON_MAP: Record<HabitIconId, ElementType> = {
    water: Droplets,
    sleep: Moon,
    energy: Zap,
    steps: Footprints,
    fire: Flame,
    workout: Dumbbell,
    food: Apple,
    read: BookOpen,
    star: Star,
};

// Список доступных иконок для UI
export const AVAILABLE_ICONS: { icon: ElementType; id: HabitIconId }[] = [
    { icon: Droplets, id: 'water' },
    { icon: Moon, id: 'sleep' },
    { icon: Zap, id: 'energy' },
    { icon: Footprints, id: 'steps' },
    { icon: Flame, id: 'fire' },
    { icon: Dumbbell, id: 'workout' },
    { icon: Apple, id: 'food' },
    { icon: BookOpen, id: 'read' },
    { icon: Star, id: 'star' },
];

// Палитра для привычек
export const AVAILABLE_COLORS = [
    '#60A5FA', // Blue
    '#818CF8', // Indigo
    '#FCD34D', // Yellow
    '#34D399', // Emerald
    '#F472B6', // Pink
    '#A78BFA', // Purple
    '#FB923C', // Orange
];

// Начальные моки привычек
export const INITIAL_HABITS: Habit[] = [
    { id: '1', title: 'Выпить воды (2л)', iconId: 'water', streak: 12, completed: true, color: '#60A5FA' },
    { id: '2', title: 'Сон 8 часов', iconId: 'sleep', streak: 5, completed: false, color: '#818CF8' },
    { id: '3', title: 'Креатин', iconId: 'energy', streak: 24, completed: true, color: '#FCD34D' },
];
