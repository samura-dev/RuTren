import { useState } from 'react';
import { cn } from '@/utils/cn';
import { GlassCard } from '../atoms/GlassCard';
import { SectionHeader } from '../molecules/SectionHeader';
import { DayItem } from '../molecules/DayItem';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../atoms/Button';
import styles from './WeeklyCalendarWidget.module.css';

type WeeklyCalendarWidgetProps = {
    className?: string;
    activeDay?: number;
    onDayChange?: (index: number) => void;
    highlightedDays?: number[]; // Indices of days with workouts
    onOpenFullCalendar?: () => void;
};

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function WeeklyCalendarWidget({
    className,
    activeDay = 2,
    onDayChange,
    highlightedDays = [0, 2, 4],
    onOpenFullCalendar
}: WeeklyCalendarWidgetProps) {
    const [internalActiveDay, setInternalActiveDay] = useState(activeDay);

    const handleDayClick = (i: number) => {
        setInternalActiveDay(i);
        onDayChange?.(i);
    };

    return (
        <section className={cn(styles.container, className)}>
            <div className={styles.header}>
                <SectionHeader title="История" className={styles.sectionHeaderNoMargin} />
                <Button
                    variant="ghost"
                    size="icon"
                    className={styles.calendarBtn}
                    onClick={onOpenFullCalendar}
                >
                    <CalendarIcon size={20} />
                </Button>
            </div>
            <GlassCard contentClassName={styles.row}>
                {DAYS.map((day, i) => (
                    <DayItem
                        key={day}
                        day={day}
                        date={12 + i}
                        isActive={i === internalActiveDay}
                        hasDot={highlightedDays.includes(i)}
                        onClick={() => handleDayClick(i)}
                    />
                ))}
            </GlassCard>
        </section>
    );
}
