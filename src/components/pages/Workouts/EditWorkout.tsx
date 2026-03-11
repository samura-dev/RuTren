import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../../organisms/Header';
import { Text, Caption, SectionTitle } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { FormInput } from '../../molecules/FormInput';
import { ExerciseSelector } from './ExerciseSelector';
import { EditableExerciseCard } from './EditableExerciseCard';
import { Plus, Save, Type, FileText } from 'lucide-react';
import { Reorder, AnimatePresence } from 'framer-motion';
import styles from './CreateWorkout.module.css';

// Store & Types
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import type { WorkoutExercise, WorkoutProgram } from '@/types';

export function EditWorkout() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { getProgramById, updateProgram } = useWorkoutStore();

    const program = getProgramById(id || '');

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [type, setType] = useState<WorkoutProgram['type']>('strength');
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Загружаем данные программы при маунте
    useEffect(() => {
        if (program) {
            setTitle(program.title);
            setSubtitle(program.subtitle);
            setType(program.type);
            setExercises([...program.exercises]);
        }
    }, [program?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAddExercise = (exercise: { id: string; name: string; muscleGroup: string }) => {
        const newExercise: WorkoutExercise = {
            exerciseId: exercise.id,
            title: exercise.name,
            subtitle: exercise.muscleGroup,
            sets: []
        };
        setExercises([...exercises, newExercise]);
        setIsSelectorOpen(false);
    };

    const handleDeleteExercise = (index: number) => {
        setExercises(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!id || !title.trim()) return;

        updateProgram(id, {
            title: title.trim(),
            subtitle: subtitle.trim(),
            type,
            exercises,
        });
        navigate(-1);
    };

    if (!program) {
        return (
            <div className={styles.page}>
                <Header title="Не найдено" showBack onBack={() => navigate(-1)} centered />
                <div style={{ padding: 20, textAlign: 'center' }}>
                    <Text>Программа не найдена</Text>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header
                title="Редактировать"
                centered
                showBack
                onBack={() => navigate(-1)}
                action={
                    <Button
                        variant="ghost"
                        className={styles.headerActionBtn}
                        onClick={handleSave}
                        disabled={!title.trim()}
                    >
                        <Save size={24} className={styles.accentIcon} />
                    </Button>
                }
            />

            <div className={styles.content}>
                {/* Основная информация */}
                <section className={styles.section}>
                    <SectionTitle>Информация</SectionTitle>
                    <FormInput
                        leftIcon={<Type size={20} />}
                        label="Название"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название программы"
                    />
                    <FormInput
                        leftIcon={<FileText size={20} />}
                        label="Описание"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        placeholder="Краткое описание"
                    />

                    {/* Тип тренировки */}
                    <div className={styles.typeSelector}>
                        <Caption className={styles.typeLabel}>Тип</Caption>
                        <div className={styles.typeOptions}>
                            {(['strength', 'cardio', 'mixed'] as const).map(t => (
                                <Button
                                    key={t}
                                    variant={type === t ? 'primary' : 'ghost'}
                                    className={styles.typeBtn}
                                    onClick={() => setType(t)}
                                >
                                    {t === 'strength' ? 'Сила' : t === 'cardio' ? 'Кардио' : 'Микс'}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Список упражнений */}
                <section className={styles.section}>
                    <SectionTitle>Упражнения ({exercises.length})</SectionTitle>

                    <Reorder.Group
                        axis="y"
                        values={exercises}
                        onReorder={setExercises}
                        className={styles.exerciseList}
                        layoutScroll
                    >
                        <AnimatePresence initial={false}>
                            {exercises.map((exercise, index) => (
                                <Reorder.Item
                                    key={exercise.exerciseId + index}
                                    value={exercise}
                                    className={styles.exerciseItem}
                                >
                                    <EditableExerciseCard
                                        exercise={exercise}
                                        onUpdate={(updated) => {
                                            setExercises(prev => prev.map((ex, i) => i === index ? updated : ex));
                                        }}
                                        onDelete={() => handleDeleteExercise(index)}
                                    />
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>

                    <Button
                        variant="outline"
                        className={styles.addExerciseBtn}
                        onClick={() => setIsSelectorOpen(true)}
                    >
                        <Plus size={20} />
                        Добавить упражнение
                    </Button>
                </section>
            </div>

            {/* Модалка выбора упражнения */}
            {isSelectorOpen && (
                <ExerciseSelector
                    onClose={() => setIsSelectorOpen(false)}
                    onSelect={handleAddExercise}
                />
            )}
        </div>
    );
}
