import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Text, Caption, SectionTitle } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { Clock, Dumbbell, Flame, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import styles from './History.module.css';

export function History() {
    const navigate = useNavigate();
    const { history } = useWorkoutStore();

    // Группировка по дате
    const grouped = history.reduce<Record<string, typeof history>>((acc, item) => {
        const dateKey = item.date;
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
    }, {});

    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateStr === today.toISOString().split('T')[0]) return 'Сегодня';
        if (dateStr === yesterday.toISOString().split('T')[0]) return 'Вчера';

        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
        });
    };

    const formatDuration = (seconds: number) => {
        const m = Math.round(seconds / 60);
        return m >= 60 ? `${Math.floor(m / 60)}ч ${m % 60}м` : `${m} мин`;
    };

    return (
        <div className={styles.page}>
            <Header
                title="История"
                showBack
                onBack={() => navigate(-1)}
                centered
            />

            <div className={styles.content}>
                {sortedDates.length === 0 ? (
                    <div className={styles.emptyState}>
                        <Clock size={48} className={styles.emptyIcon} />
                        <Text className={styles.emptyTitle}>История пуста</Text>
                        <Caption className={styles.emptyCaption}>
                            Завершите первую тренировку, и она появится здесь
                        </Caption>
                        <Button variant="primary" onClick={() => navigate('/workouts')}>
                            Начать тренировку
                        </Button>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {sortedDates.map(dateKey => (
                            <motion.section
                                key={dateKey}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={styles.dateSection}
                            >
                                <SectionTitle className={styles.dateLabel}>
                                    {formatDate(dateKey)}
                                </SectionTitle>

                                <div className={styles.cardList}>
                                    {grouped[dateKey].map(item => (
                                        <div
                                            key={item.id}
                                            className={styles.historyCard}
                                            onClick={() => navigate(`/history/${item.id}`)}
                                        >
                                            <div className={styles.cardLeft}>
                                                <div className={styles.cardIcon}>
                                                    <Dumbbell size={20} />
                                                </div>
                                                <div className={styles.cardInfo}>
                                                    <Text className={styles.cardTitle}>{item.title}</Text>
                                                    <Caption className={styles.cardMeta}>
                                                        {item.exercises.length} упр. • {formatDuration(item.duration)}
                                                    </Caption>
                                                </div>
                                            </div>

                                            <div className={styles.cardRight}>
                                                <div className={styles.cardStats}>
                                                    <div className={styles.miniStat}>
                                                        <Flame size={14} className={styles.flameIcon} />
                                                        <Caption>{item.calories} ккал</Caption>
                                                    </div>
                                                </div>
                                                <ChevronRight size={18} className={styles.chevron} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
