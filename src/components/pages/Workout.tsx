import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { MoreHorizontal, Flame, Play } from 'lucide-react';
import { Text, Caption } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { ExerciseCard } from '../organisms/ExerciseCard';
import { FinishWorkoutModal } from '../organisms/FinishWorkoutModal';
import { calculateCalories } from '@/utils/calories';
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import { useUserStore } from '@/stores/useUserStore';
import type { WorkoutSet, WorkoutExercise } from '@/types';
import styles from './Workout.module.css';

export function Workout() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Сторы
    const {
        activeWorkout,
        startWorkout,
        updateActiveExercises,
        updateActiveDuration,
        updateActiveCalories,
        finishWorkout,
        cancelWorkout,
        getProgramById,
        getHistoryById,
    } = useWorkoutStore();
    const { user } = useUserStore();

    // Локальный state
    const [isStarted, setIsStarted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentCalories, setCurrentCalories] = useState(0);
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

    // Режим просмотра истории
    const [historyMode, setHistoryMode] = useState(false);
    const [historyData, setHistoryData] = useState<{
        title: string;
        subtitle: string;
        exercises: WorkoutExercise[];
        duration: number;
        calories: number;
    } | null>(null);

    // Инициализация при маунте
    useEffect(() => {
        if (!id) return;

        // Проверяем — это id истории или программы?
        const history = getHistoryById(id);
        if (history) {
            // Режим просмотра завершённой тренировки
            setHistoryMode(true);
            setHistoryData({
                title: history.title,
                subtitle: history.subtitle,
                exercises: history.exercises,
                duration: history.duration,
                calories: history.calories,
            });
            setDuration(history.duration);
            setCurrentCalories(history.calories);
            setIsStarted(true);
            return;
        }

        // Если программа — стартуем тренировку (если ещё нет activeWorkout)
        const program = getProgramById(id);
        if (program && !activeWorkout) {
            startWorkout(id);
        }
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Синхронизация с activeWorkout (если восстанавливаем сессию)
    useEffect(() => {
        if (activeWorkout && !historyMode) {
            setDuration(activeWorkout.duration);
            setCurrentCalories(activeWorkout.calories);
        }
    }, [activeWorkout?.programId]); // eslint-disable-line react-hooks/exhaustive-deps

    // Таймер
    useEffect(() => {
        if (!isStarted || historyMode || !activeWorkout) return;

        const timer = setInterval(() => {
            setDuration(prev => {
                const newDuration = prev + 1;
                const cals = calculateCalories(newDuration, user.profile.weight, 'medium');
                setCurrentCalories(cals);

                // Обновляем стор каждые 5 секунд для производительности
                if (newDuration % 5 === 0) {
                    updateActiveDuration(newDuration);
                    updateActiveCalories(cals);
                }
                return newDuration;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isStarted, historyMode, activeWorkout, user.profile.weight, updateActiveDuration, updateActiveCalories]);

    // Обновление сетов упражнения в сторе
    const handleSetsChange = useCallback((exerciseIndex: number, newSets: WorkoutSet[]) => {
        if (historyMode || !activeWorkout) return;

        const updatedExercises = activeWorkout.exercises.map((ex, i) =>
            i === exerciseIndex ? { ...ex, sets: newSets } : ex
        );
        updateActiveExercises(updatedExercises);
    }, [historyMode, activeWorkout, updateActiveExercises]);

    const handleStartWorkout = () => {
        setIsStarted(true);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinishClick = () => {
        // Сохраняем финальные значения перед показом модалки
        if (activeWorkout) {
            updateActiveDuration(duration);
            updateActiveCalories(currentCalories);
        }
        setIsFinishModalOpen(true);
    };

    const handleConfirmFinish = () => {
        setIsFinishModalOpen(false);
        const result = finishWorkout();
        if (result) {
            // Передаём данные завершённой тренировки на сводку
            navigate('/workout/summary', { state: { workoutResult: result } });
        } else {
            navigate('/dashboard');
        }
    };

    const handleCancel = () => {
        cancelWorkout();
        navigate(-1);
    };

    // Определяем данные для рендера
    const exercises = historyMode
        ? historyData?.exercises || []
        : activeWorkout?.exercises || [];

    const title = historyMode
        ? historyData?.title || 'Тренировка'
        : getProgramById(activeWorkout?.programId || '')?.title || 'Тренировка';

    const completedExercises = exercises.filter(ex =>
        ex.sets.length > 0 && ex.sets.every(s => s.isCompleted)
    ).length;

    if (!historyMode && !activeWorkout && !getProgramById(id || '')) {
        return (
            <div className={styles.page}>
                <Header title="Загрузка..." showBack onBack={() => navigate(-1)} />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header
                title={title}
                showBack
                onBack={historyMode ? () => navigate(-1) : handleCancel}
                centered
                action={
                    <Button
                        variant="ghost"
                        className={styles.headerActionBtn}
                    >
                        <MoreHorizontal size={24} />
                    </Button>
                }
            />

            {!isStarted ? (
                /* Кнопка старта */
                <div className={styles.timerWidget}>
                    <Caption className={styles.timerLabel}>Готов к тренировке?</Caption>
                    <div className={styles.spacer} />
                    <Button
                        variant="primary"
                        size="lg"
                        className={styles.startWorkoutBtn}
                        onClick={handleStartWorkout}
                    >
                        <Play size={20} fill="currentColor" className={styles.playIcon} />
                        Начать тренировку
                    </Button>
                </div>
            ) : (
                /* Виджет таймера */
                <div className={styles.timerWidget}>
                    <Caption className={styles.timerLabel}>
                        {historyMode ? 'Время (Завершено)' : 'Время тренировки'}
                    </Caption>
                    <div className={styles.mainTimer}>{formatTime(duration)}</div>

                    <div className={styles.statsRow}>
                        <div className={styles.statItem}>
                            <Flame size={20} className={styles.flameIcon} />
                            <Caption>Сожжено</Caption>
                        </div>
                        <div className={styles.statValue}>
                            <Text>{currentCalories}</Text>
                            <Caption>Ккал</Caption>
                        </div>
                    </div>
                </div>
            )}

            {/* Список упражнений */}
            <div className={styles.list}>
                {exercises.map((ex, i) => (
                    <ExerciseCard
                        key={ex.exerciseId + i}
                        index={i + 1}
                        title={ex.title}
                        subtitle={ex.subtitle}
                        initialSets={ex.sets.length > 0 ? ex.sets : undefined}
                        isReadonly={historyMode}
                        onSetsChange={(sets) => handleSetsChange(i, sets)}
                    />
                ))}
            </div>

            {/* Кнопка завершения */}
            {!historyMode && isStarted && (
                <div className={styles.footer}>
                    <Button variant="primary" className={styles.finishBtn} onClick={handleFinishClick}>
                        Завершить тренировку
                    </Button>
                </div>
            )}

            {/* Модалка завершения */}
            <FinishWorkoutModal
                isOpen={isFinishModalOpen}
                onClose={() => setIsFinishModalOpen(false)}
                onConfirm={handleConfirmFinish}
                duration={formatTime(duration)}
                exercisesCompleted={completedExercises}
                totalExercises={exercises.length}
            />
        </div>
    );
}
