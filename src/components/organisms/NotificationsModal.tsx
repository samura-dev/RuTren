import { useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Text, SectionTitle } from '../atoms/Typography';
import { cn } from '@/utils/cn';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useHabitStore } from '@/stores/useHabitStore';
import styles from './NotificationsModal.module.css';

interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning';
    title: string;
    message: string;
    time: string;
}

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { history } = useWorkoutStore();
    const { habits } = useHabitStore();

    // Generate dynamic notifications
    const notifications = useMemo<Notification[]>(() => {
        const notifs: Notification[] = [];
        const now = new Date();

        // 1. Welcome / Intro
        if (history.length === 0) {
            notifs.push({
                id: 'welcome_1',
                type: 'info',
                title: 'Добро пожаловать в RuTren!',
                message: 'Начни с выбора готовой программы тренировок или создай свою на вкладке упражнений.',
                time: 'Только что'
            });
        }

        // 2. Training achievements
        if (history.length > 0) {
            const lastWorkout = history[history.length - 1];
            const workoutDate = new Date(lastWorkout.date);
            const daysAgo = Math.floor((now.getTime() - workoutDate.getTime()) / (1000 * 3600 * 24));
            
            if (daysAgo === 0) {
                notifs.push({
                    id: 'workout_last',
                    type: 'success',
                    title: 'Тренировка завершена!',
                    message: `Отличная работа! Тренировка "${lastWorkout.title}" успешно пройдена.`,
                    time: 'Сегодня'
                });
            } else if (daysAgo > 3) {
                notifs.push({
                    id: 'workout_warn',
                    type: 'warning',
                    title: 'Время размяться',
                    message: `Ого, ты не тренировался уже ${daysAgo} дн. Пора возвращаться в ритм!`,
                    time: 'Недавно'
                });
            }
        }

        if (history.length >= 10 && history.length < 15) {
            notifs.push({
                id: 'workout_ach',
                type: 'success',
                title: 'Новое достижение 🏆',
                message: 'Ты преодолел рубеж в 10 тренировок!',
                time: 'На этой неделе'
            });
        }

        // 3. Habits reminder
        const totalHabits = habits.length;
        if (totalHabits > 0) {
            const habitsCompletedToday = habits.filter(h => h.completedDates?.includes(now.toISOString().split('T')[0])).length;
            if (habitsCompletedToday < totalHabits) {
                notifs.push({
                    id: 'habit_remind',
                    type: 'info',
                    title: 'Привычки ждут',
                    message: `У тебя ${totalHabits - habitsCompletedToday} невыполненных привычек на сегодня.`,
                    time: 'Сегодня'
                });
            }
        }

        return notifs;
    }, [history, habits]);


    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'warning': return <AlertTriangle size={20} />;
            case 'info': default: return <Info size={20} />;
        }
    };

    const getIconStyle = (type: Notification['type']) => {
        switch (type) {
            case 'success': return styles.iconSuccess;
            case 'warning': return styles.iconWarning;
            case 'info': default: return styles.iconInfo;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div
                    className={styles.modal}
                    ref={ref}
                >
                    <header className={styles.header}>
                        <div className={styles.headerLeft}>
                            <Bell size={20} className={styles.bellIcon} />
                            <SectionTitle className={styles.modalTitle}>Уведомления</SectionTitle>
                        </div>
                        <button onClick={onClose} className={styles.closeBtn}>
                            <X size={18} />
                        </button>
                    </header>

                    <div className={styles.list}>
                        {notifications.length > 0 ? (
                            notifications.map(item => (
                                <div key={item.id} className={styles.notificationItem}>
                                    <div className={cn(styles.iconWrapper, getIconStyle(item.type))}>
                                        {getIcon(item.type)}
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.itemHeader}>
                                            <span className={styles.title}>{item.title}</span>
                                            <span className={styles.time}>{item.time}</span>
                                        </div>
                                        <p className={styles.message}>{item.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <Bell size={40} className={styles.emptyIcon} />
                                <Text>Нет новых уведомлений</Text>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
