import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Text, Caption } from '../../atoms/Typography';
import { FilterChip } from '../../molecules/FilterChip';
import type { MuscleGroup } from '@/types';
import styles from './ExerciseSelector.module.css';
import { motion, type PanInfo, useAnimation, useDragControls } from 'framer-motion';

// Store
import { useExerciseStore } from '@/stores/useExerciseStore';

type ExerciseSelectorProps = {
    onClose: () => void;
    onSelect: (exercise: { id: string, name: string, muscleGroup: string }) => void;
};

export function ExerciseSelector({ onClose, onSelect }: ExerciseSelectorProps) {
    const [search, setSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | 'All'>('All');

    // Store
    const { muscleGroups, searchExercises, addExercise } = useExerciseStore();

    // Creation State
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newGroup, setNewGroup] = useState<MuscleGroup>('Грудь');

    const controls = useAnimation();
    const dragControls = useDragControls();

    useEffect(() => {
        controls.start({ y: 0 });

        // Lock body scroll
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [controls]);

    // Use store for filtering
    const filtered = searchExercises(search).filter(ex =>
        selectedGroup === 'All' || ex.muscleGroup === selectedGroup
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragEnd = async (_: any, info: PanInfo) => {
        if (info.offset.y > 100 || info.velocity.y > 500) {
            await controls.start({ y: "100%" });
            onClose();
        } else {
            controls.start({ y: 0 });
        }
    };

    const handleCreate = () => {
        if (!newName.trim()) return;

        const newExercise = {
            id: `custom-${Date.now()}`,
            name: newName,
            muscleGroup: newGroup
        };

        // Add to store
        addExercise(newExercise);

        onSelect(newExercise);
    };

    return (
        <div className={styles.overlay}>
            <motion.div
                className={styles.container}
                initial={{ y: "100%" }}
                animate={controls}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.2 }}
                onDragEnd={handleDragEnd}
                style={{ touchAction: 'pan-y' }}
            >
                <div
                    className={styles.header}
                    onPointerDown={(e) => dragControls.start(e)}
                    style={{ touchAction: 'none' }}
                >
                    <div className={styles.dragHandle} onClick={onClose} />

                    {/* Header Row: Title & Action - Pure CSS Modules */}
                    <div className={styles.headerRow}>
                        <Text className={styles.sheetTitle}>
                            {isCreating ? 'Новое упражнение' : 'Выбрать упражнение'}
                        </Text>
                        <Button
                            variant="ghost"
                            className={styles.headerAction}
                            onClick={() => setIsCreating(!isCreating)}
                        >
                            {isCreating ? 'Отмена' : 'Создать'}
                        </Button>
                    </div>

                    {!isCreating && (
                        <>
                            <div className={styles.searchContainer}>
                                <Search size={20} className={styles.searchIcon} />
                                <input
                                    className={styles.searchInput}
                                    placeholder="Поиск..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div
                                className={styles.filtersContainer}
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <FilterChip
                                    label="Все"
                                    isActive={selectedGroup === 'All'}
                                    onClick={() => setSelectedGroup('All')}
                                />
                                {muscleGroups.map(group => (
                                    <FilterChip
                                        key={group}
                                        label={group}
                                        isActive={selectedGroup === group}
                                        onClick={() => setSelectedGroup(group)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.list}>
                    {isCreating ? (
                        <div className={styles.creationForm}>
                            <div className={styles.formGroup}>
                                <Text className={styles.formLabel}>Название</Text>
                                <input
                                    className={styles.createInput}
                                    placeholder="Например: Берпи с хлопком"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <Text className={styles.formLabel}>Группа мышц</Text>
                                <div className={styles.chipGroup}>
                                    {muscleGroups.map(group => (
                                        <FilterChip
                                            key={group}
                                            label={group}
                                            isActive={newGroup === group}
                                            onClick={() => setNewGroup(group)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button
                                variant="primary"
                                className={styles.createButton}
                                onClick={handleCreate}
                                disabled={!newName.trim()}
                            >
                                Добавить
                            </Button>
                        </div>
                    ) : (
                        <>
                            {filtered.map(ex => (
                                <div
                                    key={ex.id}
                                    className={styles.item}
                                    onClick={() => onSelect(ex)}
                                >
                                    <div className={styles.itemInfo}>
                                        <Text className={styles.itemName}>{ex.name}</Text>
                                        <Caption className={styles.itemCaption}>{ex.muscleGroup}</Caption>
                                    </div>
                                    <Button variant="ghost" className={styles.addItemBtn}>
                                        <Plus size={20} />
                                    </Button>
                                </div>
                            ))}

                            {filtered.length === 0 && (
                                <div className={styles.emptyState}>
                                    <Text>Ничего не найдено</Text>
                                    <Button
                                        variant="ghost"
                                        className={styles.createOwnBtn}
                                        onClick={() => setIsCreating(true)}
                                    >
                                        Создать свое
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
