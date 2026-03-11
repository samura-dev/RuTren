import { useState } from 'react';
import { X, Plus, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Text, SectionTitle, Caption } from '@/components/atoms/Typography';
import { GlassCard } from '@/components/atoms/GlassCard';
import { SetRow } from '@/components/molecules/SetRow';
import styles from './EditableExerciseCard.module.css';
import { motion, useAnimation, type PanInfo, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import type { WorkoutExercise, WorkoutSet } from '@/types';

type EditableExerciseCardProps = {
    exercise: WorkoutExercise;
    onUpdate: (updated: WorkoutExercise) => void;
    onDelete: () => void;
};

export function EditableExerciseCard({ exercise, onUpdate, onDelete }: EditableExerciseCardProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const controls = useAnimation();
    const dragControls = useDragControls();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = async (_: any, info: PanInfo) => {
        if (info.offset.x < -100) {
            await controls.start({ x: -1000, transition: { duration: 0.2 } });
            onDelete();
        } else {
            controls.start({ x: 0 });
        }
    };

    const addSet = () => {
        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet: WorkoutSet = {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
            weight: lastSet ? lastSet.weight : '',
            reps: lastSet ? lastSet.reps : '',
            isCompleted: false
        };
        onUpdate({
            ...exercise,
            sets: [...exercise.sets, newSet]
        });
    };

    const removeSet = (setId: string) => {
        onUpdate({
            ...exercise,
            sets: exercise.sets.filter(s => s.id !== setId)
        });
    };

    const updateSet = (setId: string, field: 'weight' | 'reps', value: string) => {
        onUpdate({
            ...exercise,
            sets: exercise.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        });
    };

    return (
        <Reorder.Item
            value={exercise}
            dragListener={false}
            dragControls={dragControls}
            className={styles.container}
            style={{ position: 'relative', touchAction: 'pan-y' }}
        >
            <div className={styles.deleteAction}>
                <div className={styles.deleteIconBg}>
                    <X size={24} color="#fff" />
                </div>
            </div>

            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0, right: 0.1 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                className={styles.cardWrapper}
            >
                <GlassCard className={styles.card} noPadding>
                    <div className={styles.header}>
                        <div
                            className={styles.dragHandle}
                            onPointerDown={(e) => dragControls.start(e)}
                        >
                            <GripVertical size={20} className={styles.gripIcon} />
                        </div>

                        <div className={styles.headerContent} onClick={() => setIsExpanded(!isExpanded)}>
                            <div className={styles.infoContainer}>
                                <div className={styles.info}>
                                    <SectionTitle className={styles.title}>{exercise.title}</SectionTitle>
                                    <Caption>{exercise.subtitle}</Caption>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <div className={styles.meta}>
                                    <Text className={styles.metaText}>{exercise.sets.length} сеты</Text>
                                </div>
                                <Button variant="ghost" className={styles.iconBtn}>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={styles.content}
                            >
                                <div className={styles.setList}>
                                    <AnimatePresence initial={false}>
                                        {exercise.sets.map((set, index) => (
                                            <motion.div
                                                key={set.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <SetRow
                                                    setNumber={index + 1}
                                                    weight={set.weight}
                                                    reps={set.reps}
                                                    isCompleted={false}
                                                    onDelete={() => removeSet(set.id)}
                                                    onUpdate={(field, value) => {
                                                        if (field !== 'isCompleted') {
                                                            updateSet(set.id, field, value as string);
                                                        }
                                                    }}
                                                    showCheckbox={false}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <div className={styles.footer}>
                                    <Button
                                        variant="ghost"
                                        className={styles.addSetBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addSet();
                                        }}
                                    >
                                        <Plus size={16} className={styles.plusIcon} />
                                        Добавить подход
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </motion.div>
        </Reorder.Item>
    );
}
