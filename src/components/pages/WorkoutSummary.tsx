import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../atoms/Button';
import { SectionTitle, Text, Caption } from '../atoms/Typography';
import { GlassCard } from '../atoms/GlassCard';
import { CheckCircle, Share2, Home, Trophy } from 'lucide-react';
import styles from './WorkoutSummary.module.css';
import { useEffect } from 'react';
import type { WorkoutHistory } from '@/types';

export function WorkoutSummary() {
    const navigate = useNavigate();
    const location = useLocation();

    // Данные тренировки из location state (переданы из Workout.tsx при finishWorkout)
    const workoutResult = (location.state as { workoutResult?: WorkoutHistory })?.workoutResult;

    // Если нет данных — редирект на главную
    useEffect(() => {
        if (!workoutResult) {
            navigate('/dashboard', { replace: true });
        }
    }, [workoutResult, navigate]);

    if (!workoutResult) return null;

    // Расчёт статистики
    const durationMinutes = Math.round(workoutResult.duration / 60);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const timeDisplay = hours > 0 ? `${hours}ч ${minutes}м` : `${minutes} мин`;

    const totalExercises = workoutResult.exercises.length;
    const completedSets = workoutResult.exercises.reduce((acc, ex) =>
        acc + ex.sets.filter(s => s.isCompleted).length, 0
    );

    // Тоннаж в тоннах
    const tonnageKg = workoutResult.totalVolume;
    const tonnageDisplay = tonnageKg >= 1000
        ? `${(tonnageKg / 1000).toFixed(1)} т`
        : `${tonnageKg} кг`;

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <CheckCircle size={64} className={styles.icon} />
                </div>

                <SectionTitle className={styles.title}>Тренировка завершена!</SectionTitle>
                <Text className={styles.subtitle}>Отличная работа, чемпион!</Text>

                <div className={styles.statsGrid}>
                    <GlassCard className={styles.statCard} noPadding>
                        <div className={styles.statContent}>
                            <Caption>Время</Caption>
                            <Text className={styles.statValue}>{timeDisplay}</Text>
                        </div>
                    </GlassCard>
                    <GlassCard className={styles.statCard} noPadding>
                        <div className={styles.statContent}>
                            <Caption>Тоннаж</Caption>
                            <Text className={styles.statValue}>{tonnageDisplay}</Text>
                        </div>
                    </GlassCard>
                    <GlassCard className={styles.statCard} noPadding>
                        <div className={styles.statContent}>
                            <Caption>Упражнений</Caption>
                            <Text className={styles.statValue}>{totalExercises}</Text>
                        </div>
                    </GlassCard>
                    <GlassCard className={styles.statCard} noPadding>
                        <div className={styles.statContent}>
                            <Caption>Подходов</Caption>
                            <Text className={styles.statValue}>{completedSets} <Trophy size={16} /></Text>
                        </div>
                    </GlassCard>
                </div>

                <div className={styles.actions}>
                    <Button variant="primary" className={styles.shareBtn}>
                        <Share2 size={20} />
                        Поделиться
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className={styles.homeBtn}>
                        <Home size={20} />
                        На главную
                    </Button>
                </div>
            </div>
        </div>
    );
}
