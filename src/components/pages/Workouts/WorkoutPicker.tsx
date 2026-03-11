import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Dumbbell, Zap, ChevronRight } from 'lucide-react';
import { Text, SectionTitle, Caption } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { cn } from '@/utils/cn';
import type { WorkoutProgram } from '@/types';
import styles from './WorkoutPicker.module.css';

interface WorkoutPickerProps {
    isOpen: boolean;
    onClose: () => void;
    programs: WorkoutProgram[];
    onSelect: (programId: string) => void;
    onCreate: () => void;
}

export function WorkoutPicker({ isOpen, onClose, programs, onSelect, onCreate }: WorkoutPickerProps) {
    console.log('WorkoutPicker programs:', programs); // Debug log
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className={styles.overlay} onClick={onClose}>
                <motion.div
                    className={styles.sheet}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.header}>
                        <div className={styles.dragHandle} />
                        <div className={styles.headerRow}>
                            <SectionTitle>Выбрать тренировку</SectionTitle>
                            <button onClick={onClose} className={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.list}>
                            {programs.map(program => (
                                <div
                                    key={program.id}
                                    className={styles.card}
                                    onClick={() => onSelect(program.id)}
                                >
                                    <div className={cn(styles.icon, program.type === 'strength' ? styles.strength : styles.cardio)}>
                                        {program.type === 'strength' ? <Dumbbell size={24} /> : <Zap size={24} />}
                                    </div>
                                    <div className={styles.info}>
                                        <Text className={styles.title}>{program.title}</Text>
                                        <Caption className={styles.subtitle}>{program.subtitle}</Caption>
                                    </div>
                                    <ChevronRight size={20} className={styles.chevron} />
                                </div>
                            ))}

                            {programs.length === 0 && (
                                <div className={styles.empty}>
                                    <Text>Нет готовых программ</Text>
                                </div>
                            )}
                        </div>

                        <div className={styles.footer}>
                            <Button variant="outline" className={styles.createBtn} onClick={onCreate}>
                                <Plus size={20} />
                                Создать новую
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
