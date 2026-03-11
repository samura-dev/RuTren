import type { WorkoutProgram, WorkoutHistory } from '@/types';

// Моки программ тренировок
export const INITIAL_PROGRAMS: WorkoutProgram[] = [
    {
        id: '1',
        title: 'Full Body (А)',
        subtitle: 'Силовая • 60 мин',
        type: 'strength',
        order: 0,
        exercises: [
            { exerciseId: 'ch1', title: 'Жим лежа', subtitle: 'Грудь', sets: [] },
            { exerciseId: 'ch2', title: 'Жим гантелей под углом', subtitle: 'Грудь', sets: [] },
            { exerciseId: 'ch6', title: 'Разводка гантелей', subtitle: 'Грудь', sets: [] },
            { exerciseId: 'ar9', title: 'Жим узким хватом', subtitle: 'Трицепс', sets: [] },
            { exerciseId: 'ar4', title: 'Разгибания рук', subtitle: 'Трицепс', sets: [] },
        ],
    },
    {
        id: '2',
        title: 'Upper Body (В)',
        subtitle: 'Силовая • 45 мин',
        type: 'strength',
        order: 1,
        exercises: [
            { exerciseId: 'bk2', title: 'Подтягивания', subtitle: 'Спина', sets: [] },
            { exerciseId: 'bk3', title: 'Тяга в наклоне', subtitle: 'Спина', sets: [] },
            { exerciseId: 'sh2', title: 'Армейский жим', subtitle: 'Плечи', sets: [] },
            { exerciseId: 'sh3', title: 'Махи в стороны', subtitle: 'Плечи', sets: [] },
        ],
    },
    {
        id: '3',
        title: 'Кардио Утро',
        subtitle: 'Кардио • 30 мин',
        type: 'cardio',
        order: 2,
        exercises: [],
    },
];

// Мок истории тренировок
export const INITIAL_HISTORY: WorkoutHistory[] = [
    {
        id: 'history-123',
        programId: '1',
        title: 'Full Body (A)',
        subtitle: 'Завершено • 65 мин',
        date: '2026-02-09',
        duration: 3900,
        calories: 420,
        totalVolume: 5200,
        exercises: [
            {
                exerciseId: 'ch1',
                title: 'Жим лежа',
                subtitle: 'Грудь',
                sets: [
                    { id: '1', weight: '80', reps: '10', isCompleted: true },
                    { id: '2', weight: '80', reps: '10', isCompleted: true },
                    { id: '3', weight: '80', reps: '9', isCompleted: true },
                ],
            },
            {
                exerciseId: 'ch2',
                title: 'Жим гантелей под углом',
                subtitle: 'Грудь',
                sets: [
                    { id: '4', weight: '30', reps: '12', isCompleted: true },
                    { id: '5', weight: '30', reps: '12', isCompleted: true },
                ],
            },
        ],
    },
];

// Даты с тренировками (для календаря)
export const WORKOUT_DATES = [
    '2026-02-02', '2026-02-04', '2026-02-06', '2026-02-09',
    '2026-01-28', '2026-01-30',
];
