// Типы привычек

export type HabitIconId =
    | 'water'
    | 'sleep'
    | 'energy'
    | 'steps'
    | 'fire'
    | 'workout'
    | 'food'
    | 'read'
    | 'star';

export type Habit = {
    id: string;
    title: string;
    iconId: HabitIconId;
    streak: number;
    completed: boolean;
    color: string;
};
