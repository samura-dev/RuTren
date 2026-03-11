import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../organisms/Header';
import { Caption, Text, SectionTitle } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';
import { Plus, ChevronRight, Dumbbell, Zap, Pencil, Check, GripVertical, X } from 'lucide-react';
import { WeeklyCalendarWidget } from '../../organisms/WeeklyCalendarWidget';
import { FullCalendarModal } from '../../organisms/FullCalendarModal';
import { Reorder, AnimatePresence, useDragControls, useAnimation, motion, type PanInfo } from 'framer-motion';
import { cn } from '@/utils/cn';
import styles from './Workouts.module.css';

// Store & Types
import { useWorkoutStore } from '@/stores/useWorkoutStore';
import type { WorkoutProgram } from '@/types';

interface WorkoutItemProps {
    workout: WorkoutProgram;
    isEditMode: boolean;
    onDelete: (id: string) => void;
    onClick: () => void;
}

function WorkoutItem({ workout, isEditMode, onDelete, onClick }: WorkoutItemProps) {
    const dragControls = useDragControls();
    const controls = useAnimation();

    const handleDragEnd = async (_: any, info: PanInfo) => {
        if (info.offset.x < -100) {
            await controls.start({ x: -1000, transition: { duration: 0.2 } });
            onDelete(workout.id);
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <Reorder.Item
            value={workout}
            dragListener={false} // Only drag via handle
            dragControls={dragControls}
            className={styles.workoutItemContainer}
            style={{ position: 'relative', touchAction: 'pan-y' }}
        >
            {/* Delete Action Background (Only visible when swiped in Edit Mode) */}
            {isEditMode && (
                <div className={styles.swipeActions}>
                    <div className={styles.deleteIconBg}>
                        <X size={20} />
                    </div>
                </div>
            )}

            {/* Main Content Card (Swipable in Edit Mode) */}
            <motion.div
                className={cn(styles.workoutCard, isEditMode && styles.isEditing)}
                drag={isEditMode ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0, right: 0.1 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x: 0 }} // Ensure starting position
                onClick={onClick}
            >
                {/* Drag Handle (Visible in Edit Mode) */}
                {isEditMode && (
                    <div
                        className={styles.dragHandle}
                        onPointerDown={(e) => dragControls.start(e)}
                    >
                        <GripVertical size={20} />
                    </div>
                )}

                <div className={cn(styles.cardIcon, workout.type === 'strength' ? styles.strengthIcon : styles.cardioIcon)}>
                    {workout.type === 'strength' ? <Dumbbell size={24} /> : <Zap size={24} />}
                </div>

                <div className={styles.cardContent}>
                    <Text className={styles.cardTitle}>{workout.title}</Text>
                    <Caption className={styles.cardCaption}>{workout.subtitle}</Caption>
                </div>

                {/* Chevron (Only in View Mode) */}
                {!isEditMode && (
                    <Button variant="ghost" className={styles.chevronBtn}>
                        <ChevronRight size={20} />
                    </Button>
                )}
            </motion.div>
        </Reorder.Item>
    );
}

export function Workouts() {
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState(2); // Assume 2 is Today (Wednesday)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Store
    const { programs, deleteProgram, reorderPrograms, workoutDates } = useWorkoutStore();

    // We need local state for Reorder.Group to work smoothly, then sync to store
    // Or just use store directly if it's fast enough. 
    // Usually Reorder needs a local state.
    // Let's rely on store for now, if jumpy we add useEffect.

    const TODAY_INDEX = 2;

    const handleAddWorkout = () => {
        navigate('/workouts/create');
    };

    const handleDelete = (id: string) => {
        deleteProgram(id);
    };

    const handleReorder = (newOrder: WorkoutProgram[]) => {
        reorderPrograms(newOrder);
    };

    const handleOpenWorkout = (id: string) => {
        if (!isEditMode) {
            // In real app, we might want to "start" it or just view details.
            // Based on Phase 0 fix, we navigate to /workout/:id
            navigate(`/workout/${id}`);
        }
    };

    return (
        <div className={styles.page}>
            <Header
                title="Тренировки"
                centered
                showBack
                onBack={() => navigate(-1)}
                action={
                    <Button
                        variant="ghost"
                        className={styles.headerActionBtn}
                        onClick={() => setIsEditMode(!isEditMode)}
                    >
                        {isEditMode ? <Check size={24} className={styles.accentIcon} /> : <Pencil size={24} />}
                    </Button>
                }
            />

            <div className={styles.content}>
                {/* Week Overview */}
                <WeeklyCalendarWidget
                    highlightedDays={[0, 2, 4]}
                    activeDay={selectedDay}
                    onDayChange={setSelectedDay}
                    onOpenFullCalendar={() => setIsCalendarOpen(true)}
                />

                {/* Dynamic Day Content */}
                <section className={styles.dayContent}>
                    {selectedDay < TODAY_INDEX ? (
                        /* Past Day: Show History - Mock for now */
                        <div className={styles.historyCard} onClick={() => navigate('/workout/history-123')}>
                            <div className={styles.historyInfo}>
                                <Text className={styles.historyLabel}>Завершено</Text>
                                <Text className={styles.historyTitle}>Full Body (A)</Text>
                                <Caption className={styles.cardCaption}>12 упражнений • 65 мин</Caption>
                            </div>
                            <div className={styles.historyIcon}>
                                <Dumbbell size={20} className={styles.accentIcon} />
                            </div>
                        </div>
                    ) : (
                        /* Future/Today: Add Workout */
                        <Button
                            variant="outline"
                            className={styles.addWorkoutBtn}
                            onClick={handleAddWorkout}
                        >
                            <Plus size={20} />
                            Добавить тренировку
                        </Button>
                    )}
                </section>

                {/* My Workouts List */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <SectionTitle>Мои программы</SectionTitle>
                    </div>

                    <Reorder.Group
                        axis="y"
                        values={programs}
                        onReorder={handleReorder}
                        className={styles.workoutsList}
                        layoutScroll
                    >
                        <AnimatePresence initial={false}>
                            {programs.map(workout => (
                                <WorkoutItem
                                    key={workout.id}
                                    workout={workout}
                                    isEditMode={isEditMode}
                                    onDelete={handleDelete}
                                    onClick={() => handleOpenWorkout(workout.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>

                    {!isEditMode && (
                        <Button
                            variant="outline"
                            className={styles.createBtn}
                            onClick={() => navigate('/workouts/create')}
                        >
                            <Plus size={20} className={styles.plusIcon} />
                            Создать тренировку
                        </Button>
                    )}
                </section>

                {/* Quick Start / Suggestions */}
                <section className={styles.section}>
                    <div className={styles.suggestionCard}>
                        <div className={styles.suggestionInfo}>
                            <Text className={styles.suggestionTitle}>Начать пустую</Text>
                            <Caption className={styles.suggestionCaption}>Тренировка без шаблона</Caption>
                        </div>
                        <Button className={styles.startBtn}>
                            Погнали
                        </Button>
                    </div>
                </section>
            </div>

            <FullCalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                workoutDates={workoutDates}
            />
        </div>
    );
}
