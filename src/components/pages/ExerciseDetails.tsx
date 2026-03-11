import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/organisms/Header';
import { Button } from '@/components/atoms/Button';
import { Text, PageTitle, Caption } from '@/components/atoms/Typography';
import { Dumbbell, Box } from 'lucide-react';
import styles from './ExerciseDetails.module.css';

// Store
import { useExerciseStore } from '@/stores/useExerciseStore';

export function ExerciseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Store
    const { exercises } = useExerciseStore();

    // Поиск упражнения по ID
    const exercise = exercises.find(ex => ex.id === id);

    if (!exercise) {
        return (
            <div className={styles.page}>
                <Header title="Упражнение" showBack onBack={() => navigate(-1)} centered />
                <div className={styles.emptyState}>
                    <Text>Упражнение не найдено</Text>
                    <Button variant="ghost" onClick={() => navigate('/exercises')}>
                        Вернуться в библиотеку
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header
                title="Упражнение"
                showBack
                onBack={() => navigate(-1)}
                centered
            />

            <div className={styles.content}>
                {/* Hero / Media Placeholder */}
                <div className={styles.mediaContainer}>
                    <div className={styles.mediaPlaceholder}>
                        <Dumbbell size={48} className={styles.mediaIcon} />
                        <Caption>Видео демонстрация</Caption>
                    </div>
                </div>

                <div className={styles.detailsContainer}>
                    {/* Заголовок и чипсы */}
                    <div className={styles.headerSection}>
                        <PageTitle className={styles.title}>{exercise.name}</PageTitle>
                        <div className={styles.chipsContainer}>
                            <div className={styles.chip}>
                                <Dumbbell size={14} />
                                <span>{exercise.muscleGroup}</span>
                            </div>
                            {exercise.equipment && (
                                <div className={styles.chip}>
                                    <Box size={14} />
                                    <span>{exercise.equipment}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Описание */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Text className={styles.sectionTitle}>Описание</Text>
                        </div>
                        <Text className={styles.description}>
                            {exercise.description || `Упражнение "${exercise.name}" для группы мышц "${exercise.muscleGroup}". Подробное описание будет добавлено позже.`}
                        </Text>
                    </div>

                    {/* Техника выполнения */}
                    {exercise.instructions && exercise.instructions.length > 0 ? (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Text className={styles.sectionTitle}>Техника выполнения</Text>
                            </div>
                            <div className={styles.stepsList}>
                                {exercise.instructions.map((step, index) => (
                                    <div key={index} className={styles.stepItem}>
                                        <div className={styles.stepNumber}>{index + 1}</div>
                                        <Text className={styles.stepText}>{step}</Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Text className={styles.sectionTitle}>Техника выполнения</Text>
                            </div>
                            <Text className={styles.description}>
                                Инструкция по выполнению будет добавлена позже.
                                Для правильной техники рекомендуем проконсультироваться с тренером.
                            </Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
