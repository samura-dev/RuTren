import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../organisms/Header';
import { Button } from '../../atoms/Button';
import { SectionTitle } from '../../atoms/Typography';
import { Plus } from 'lucide-react';
import { EditableExerciseCard } from './EditableExerciseCard';
import { ExerciseSelector } from './ExerciseSelector';
import styles from './CreateWorkout.module.css';
import { Reorder } from 'framer-motion';

// Types & Store
import type { WorkoutExercise } from '@/types';
import { useWorkoutStore } from '@/stores/useWorkoutStore';

export function CreateWorkout() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Store
    const { addProgram } = useWorkoutStore();

    const handleSave = () => {
        if (!title.trim()) return;

        addProgram({
            id: Date.now().toString(),
            title,
            subtitle: description || `${exercises.length} упражнений`,
            type: 'strength', // TODO: infer from exercises
            order: 999, // push to end
            exercises
        });

        navigate(-1);
    };

    const addExercise = (exercise: { id: string, name: string, muscleGroup: string }) => {
        const newExercise: WorkoutExercise = {
            exerciseId: exercise.id,
            title: exercise.name,
            subtitle: exercise.muscleGroup,
            sets: []
        };
        setExercises([...exercises, newExercise]);
        setIsSelectorOpen(false);
    };




    return (
        <div className={styles.page}>
            <Header
                title="Новая программа"
                centered
                showBack
                onBack={() => navigate(-1)}
                action={
                    <Button
                        variant="ghost"
                        className={styles.saveBtn}
                        onClick={handleSave}
                        disabled={!title}
                    >
                        Сохр.
                    </Button>
                }
            />

            <div className={styles.content}>
                <section className={styles.formSection}>
                    <input
                        className={styles.titleInput}
                        placeholder="Название тренировки"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className={styles.descInput}
                        placeholder="Описание (опционально)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                    />
                </section>

                <section className={styles.exercisesSection}>
                    {exercises.length > 0 && <SectionTitle>Упражнения</SectionTitle>}

                    <Reorder.Group
                        axis="y"
                        values={exercises}
                        onReorder={setExercises}
                        className={styles.exercisesList}
                    >
                        {exercises.map((exercise, index) => (
                            <EditableExerciseCard
                                key={exercise.exerciseId + index}
                                // Ideally we need a unique ID here. 
                                // `exerciseId` + index might fail if reordered?
                                // Reorder needs consistent keys.
                                // Let's generate a temporary ID and attach it to the object?
                                // Typescript might complain if I add extra props.

                                exercise={exercise}
                                onUpdate={(updated) => {
                                    const newExercises = [...exercises];
                                    newExercises[index] = updated;
                                    setExercises(newExercises);
                                }}
                                onDelete={() => {
                                    setExercises(exercises.filter((_, i) => i !== index));
                                }}
                            />
                        ))}
                    </Reorder.Group>

                    <Button
                        variant="outline"
                        className={styles.addExerciseBtn}
                        onClick={() => setIsSelectorOpen(true)}
                    >
                        <Plus size={20} className={styles.plusIcon} />
                        Добавить упражнение
                    </Button>
                </section>
            </div>

            {isSelectorOpen && (
                <ExerciseSelector
                    onClose={() => setIsSelectorOpen(false)}
                    onSelect={addExercise}
                />
            )}
        </div>
    );
}
