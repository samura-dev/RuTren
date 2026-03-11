import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Plus, BookOpen } from 'lucide-react';
import { Header } from '../organisms/Header';
import { Button } from '../atoms/Button';
import { Text, Caption } from '../atoms/Typography';
import { FilterChip } from '../molecules/FilterChip';
import styles from './Exercises.module.css';

// Store & Types
import { useExerciseStore } from '@/stores/useExerciseStore';
import type { MuscleGroup } from '@/types';

export function ExercisesPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | 'All'>('All');

    // Store
    const { muscleGroups, searchExercises, addExercise } = useExerciseStore();

    // Creation State
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newGroup, setNewGroup] = useState<MuscleGroup>('Грудь');

    // Filter logic using store's search + local group filter
    const filtered = searchExercises(search).filter(ex =>
        selectedGroup === 'All' || ex.muscleGroup === selectedGroup
    );

    const handleCreate = () => {
        if (!newName.trim()) return;

        const newExercise = {
            id: `custom-${Date.now()}`,
            name: newName,
            muscleGroup: newGroup
        };

        addExercise(newExercise);

        setIsCreating(false);
        setNewName('');
        setNewGroup('Грудь');
    };

    return (
        <div className={styles.page}>
            <Header
                title="Упражнения"
                centered
                showBack
                onBack={() => navigate(-1)}
                action={
                    <Button
                        variant="ghost"
                        className={styles.headerActionBtn}
                        onClick={() => setIsCreating(true)}
                    >
                        <Plus size={28} />
                    </Button>
                }
            />

            <div className={styles.content}>
                {/* Search & Filter */}
                <div className={styles.controls}>
                    <div className={styles.searchContainer}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            className={styles.searchInput}
                            placeholder="Поиск упражнений..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className={styles.filtersWrapper}>
                        <div className={styles.filtersContainer}>
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
                    </div>
                </div>

                {/* List */}
                <div className={styles.list}>
                    {isCreating ? (
                        <div className={styles.creationForm}>
                            <div className={styles.formGroup}>
                                <Text className={styles.label}>Название</Text>
                                <input
                                    className={styles.textInput}
                                    placeholder="Например: Берпи с хлопком"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <Text className={styles.label}>Группа мышц</Text>
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
                            <div className={styles.actionButtons}>
                                <Button variant="ghost" className={styles.actionBtn} onClick={() => setIsCreating(false)}>
                                    Отмена
                                </Button>
                                <Button variant="primary" className={styles.actionBtn} onClick={handleCreate} disabled={!newName.trim()}>
                                    Сохранить
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {filtered.map(ex => (
                                <div
                                    key={ex.id}
                                    className={styles.item}
                                    onClick={() => navigate(`/exercises/${ex.id}`)}
                                >
                                    <div className={styles.itemInfo}>
                                        <Text className={styles.itemName}>{ex.name}</Text>
                                        <Caption className={styles.itemCaption}>{ex.muscleGroup}</Caption>
                                    </div>
                                    <div className={styles.itemIcon}>
                                        <BookOpen size={16} />
                                    </div>
                                </div>
                            ))}

                            {filtered.length === 0 && (
                                <div className={styles.emptyState}>
                                    <Search size={40} className={styles.emptyIcon} />
                                    <Text>Ничего не найдено</Text>
                                    <Button variant="ghost" className={styles.suggestBtn} onClick={() => setIsCreating(true)}>
                                        Предложить упражнение
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
