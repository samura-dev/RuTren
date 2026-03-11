/**
 * Утилиты форматирования для приложения RuTren
 */

// Форматирование времени из секунд
export const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}ч ${m}м`;
    if (m > 0) return `${m} мин`;
    return `${s} сек`;
};

// Таймер формат HH:MM:SS
export const formatTimer = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Форматирование веса / тоннажа
export const formatWeight = (kg: number): string => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)} т`;
    return `${kg} кг`;
};

// Форматирование даты
export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Сегодня';
    if (dateStr === yesterdayStr) return 'Вчера';

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
    });
};

// Полная дата с годом
export const formatFullDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

// Множественное число (1 тренировка, 2 тренировки, 5 тренировок)
export const pluralize = (n: number, forms: [string, string, string]): string => {
    const abs = Math.abs(n) % 100;
    const n1 = abs % 10;

    if (abs > 10 && abs < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
};

// Форматирование числа с разделителем тысяч
export const formatNumber = (n: number): string => {
    return n.toLocaleString('ru-RU');
};
