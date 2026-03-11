import type { Measurement } from '@/types';

// Начальные моки замеров
export const INITIAL_MEASUREMENTS: Measurement[] = [
    { id: 'chest', label: 'Грудь', value: '105', unit: 'см', diff: '+1' },
    { id: 'waist', label: 'Талия', value: '82', unit: 'см', diff: '-0.5', isGood: true },
    { id: 'biceps_l', label: 'Бицепс (Л)', value: '38', unit: 'см' },
    { id: 'biceps_r', label: 'Бицепс (П)', value: '38.5', unit: 'см', diff: '+0.2' },
    { id: 'hips', label: 'Бедра', value: '60', unit: 'см' },
    { id: 'calves', label: 'Икры', value: '42', unit: 'см' },
    { id: 'quads', label: 'Квадрицепс', value: '58', unit: 'см' },
    { id: 'forearms', label: 'Предплечья', value: '32', unit: 'см' },
];

// Данные о весе (мок)
export const INITIAL_WEIGHT = {
    current: 78.5,
    diff: -0.5,
    period: 'за неделю',
};
