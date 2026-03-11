import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Zap } from 'lucide-react';
import { Text, SectionTitle } from '../atoms/Typography';
import { cn } from '@/utils/cn';
import styles from './FullCalendarModal.module.css';

interface FullCalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    workoutDates: string[]; // ISO format YYYY-MM-DD
}

const MONTHS = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function FullCalendarModal({ isOpen, onClose, workoutDates }: FullCalendarModalProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!isOpen) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Mon, 6=Sun)
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Previous month filler
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className={styles.dayCell} />);
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const isWorkoutDay = workoutDates.includes(dateStr);
        const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();

        days.push(
            <div
                key={i}
                className={cn(
                    styles.dayCell,
                    isToday && styles.currentDay,
                    isWorkoutDay && styles.workoutDay
                )}
            >
                {i}
            </div>
        );
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <div
                    className={styles.modal}
                    onClick={e => e.stopPropagation()}
                >
                    <header className={styles.header}>
                        <div className={styles.monthNav}>
                            <button onClick={prevMonth} className={styles.navBtn}>
                                <ChevronLeft size={20} />
                            </button>
                            <SectionTitle>
                                {MONTHS[month]} {year}
                            </SectionTitle>
                            <button onClick={nextMonth} className={styles.navBtn}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <button onClick={onClose} className={styles.closeBtn}>
                            <X size={20} />
                        </button>
                    </header>

                    <div className={styles.grid}>
                        {WEEKDAYS.map(day => (
                            <div key={day} className={styles.weekDay}>{day}</div>
                        ))}
                        {days}
                    </div>

                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={cn(styles.legendIconWrapper, styles.legendIconWrapperWorkout)}>
                                <Zap size={12} fill="currentColor" />
                            </div>
                            <Text className={styles.legendText}>Тренировка</Text>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={cn(styles.legendIconWrapper, styles.legendIconWrapperToday)}>
                                <div className={styles.todayDot} />
                            </div>
                            <Text className={cn(styles.legendText, styles.legendTextSecondary)}>Сегодня</Text>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
