import { useState, useEffect } from 'react';
import { GlassCard } from '../atoms/GlassCard';
import { Text, SectionTitle, Caption } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SetRow } from '../molecules/SetRow';
import { cn } from '@/utils/cn';
import styles from './ExerciseCard.module.css';
import type { WorkoutSet } from '@/types';

type ExerciseCardProps = {
    title: string;
    subtitle?: string;
    sets?: number;
    reps?: string;
    index?: number;
    initialSets?: WorkoutSet[];
    isReadonly?: boolean;
    onSetsChange?: (sets: WorkoutSet[]) => void;
}


export function ExerciseCard({ title, subtitle, sets: initialSetsCount = 3, reps = "12", index, initialSets, isReadonly, onSetsChange }: ExerciseCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Инициализация сетов
    const [sets, setSets] = useState<WorkoutSet[]>(() => {
        if (initialSets && initialSets.length > 0) {
            return initialSets;
        }
        return Array.from({ length: initialSetsCount }).map((_, i) => ({
            id: `${Date.now()}-${i}`,
            weight: '0',
            reps: reps.replace(/\D/g, '') || '12',
            isCompleted: false
        }));
    });

    const isExerciseCompleted = sets.length > 0 && sets.every(s => s.isCompleted);

    // Оповещаем родителя об изменениях
    useEffect(() => {
        onSetsChange?.(sets);
    }, [sets]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleUpdateSet = (id: string, field: keyof WorkoutSet, value: string | boolean) => {
        setSets(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleAddSet = (e: React.MouseEvent) => {
        e.stopPropagation();
        const lastSet = sets[sets.length - 1];
        const newSet: WorkoutSet = {
            id: Date.now().toString(),
            weight: lastSet ? lastSet.weight : '0',
            reps: lastSet ? lastSet.reps : '0',
            isCompleted: false
        };
        setSets([...sets, newSet]);
    };

    const handleDeleteSet = (id: string) => {
        setSets(prev => prev.filter(s => s.id !== id));
    };

    return (
        <GlassCard className={styles.card} noPadding>
            <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
                <div className={styles.infoContainer}>
                    {index !== undefined && (
                        <div className={cn(styles.indexBadge, isExerciseCompleted && styles.completedBadge)}>
                            {index}
                        </div>
                    )}
                    <div className={styles.info}>
                        <SectionTitle className={styles.title}>{title}</SectionTitle>
                        {subtitle && <Caption>{subtitle}</Caption>}
                    </div>
                </div>
                <div className={styles.actions}>
                    <div className={styles.meta}>
                        <Text className={styles.metaText}>{sets.length} x {reps}</Text>
                    </div>
                    <Button variant="ghost" className={styles.iconBtn}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </Button>
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
                                {sets.map((set, index) => (
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
                                            isCompleted={set.isCompleted}
                                            onDelete={isReadonly ? undefined : () => handleDeleteSet(set.id)}
                                            onUpdate={isReadonly ? undefined : (field, value) => handleUpdateSet(set.id, field as keyof WorkoutSet, value)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {!isReadonly && (
                            <div className={styles.footer}>
                                <Button
                                    variant="ghost"
                                    className={styles.addSetBtn}
                                    onClick={handleAddSet}
                                >
                                    <Plus size={16} /> Добавить подход
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}
