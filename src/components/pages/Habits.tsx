import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Caption, Label } from '../atoms/Typography';
import { Checkbox } from '../atoms/Checkbox';
import { Button } from '../atoms/Button';
import { Modal } from '../molecules/Modal';
import { FormInput } from '../molecules/FormInput';
import { Plus, Flame, Trash2 } from 'lucide-react';
import { motion, type PanInfo, useAnimation } from 'framer-motion';
import { cn } from '@/utils/cn';
import styles from './Habits.module.css';

// Store & Data
import { useHabitStore } from '@/stores/useHabitStore';
import { AVAILABLE_ICONS, AVAILABLE_COLORS, HABIT_ICON_MAP } from '@/data/habits';
import type { Habit } from '@/types';

export function Habits() {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Store
    const { habits, toggleHabit, deleteHabit, addHabit, progress, completedCount } = useHabitStore();

    // New Habit State
    const [newTitle, setNewTitle] = useState('');
    const [selectedIconIndex, setSelectedIconIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

    const handleAddHabit = () => {
        if (!newTitle) return;

        addHabit(
            newTitle,
            AVAILABLE_ICONS[selectedIconIndex].id,
            selectedColor
        );

        setNewTitle('');
        setIsAddModalOpen(false);
    };

    const currentProgress = progress();
    const currentCompleted = completedCount();

    return (
        <div className={styles.page}>
            <Header
                title="Привычки"
                showBack
                onBack={() => navigate(-1)}
                centered
                action={
                    <Button
                        variant="ghost"
                        className={styles.headerActionBtn}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={24} />
                    </Button>
                }
            />

            <div className={styles.content}>
                <div className={styles.header}>
                    <Caption className={styles.dateTitle}>Сегодня, 9 Февраля</Caption>
                </div>

                <div className={styles.progressCard}>
                    <div className={styles.progressCircle}>
                        <span className={styles.progressText}>{currentProgress}%</span>
                    </div>
                    <div className={styles.progressInfo}>
                        <span className={styles.progressTitle}>Твой прогресс</span>
                        <span className={styles.progressSubtitle}>
                            {currentCompleted} из {habits.length} выполнено
                        </span>
                    </div>
                </div>

                <div className={styles.habitsList}>
                    {habits.map(habit => (
                        <SwipeableHabitCard
                            key={habit.id}
                            habit={habit}
                            onToggle={() => toggleHabit(habit.id)}
                            onDelete={() => deleteHabit(habit.id)}
                        />
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Новая привычка"
            >
                <div className={styles.modalForm}>
                    <FormInput
                        label="Название"
                        placeholder="Например: Выпить креатин"
                        value={newTitle}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
                    />

                    <div>
                        <Label className={styles.formLabel}>Иконка</Label>
                        <div className={styles.iconGrid}>
                            {AVAILABLE_ICONS.map((item, idx) => (
                                <button
                                    key={item.id}
                                    className={cn(styles.iconBtn, selectedIconIndex === idx && styles.selectedIcon)}
                                    onClick={() => setSelectedIconIndex(idx)}
                                >
                                    <item.icon size={24} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label className={styles.formLabel}>Цвет</Label>
                        <div className={styles.colorGrid}>
                            {AVAILABLE_COLORS.map(color => (
                                <button
                                    key={color}
                                    className={cn(styles.colorBtn, selectedColor === color && styles.selectedColor)}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    <Button variant="primary" onClick={handleAddHabit} className={styles.modalButton}>
                        Создать привычку
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

function SwipeableHabitCard({ habit, onToggle, onDelete }: { habit: Habit, onToggle: () => void, onDelete: () => void }) {
    const controls = useAnimation();
    const IconComponent = HABIT_ICON_MAP[habit.iconId];

    const handleDragEnd = async (_: any, info: PanInfo) => {
        if (info.offset.x < -80) {
            await controls.start({ x: -100, opacity: 0 });
            onDelete();
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <div className={styles.habitWrapper}>
            <div className={styles.deleteAction}>
                <Trash2 size={24} />
            </div>

            <motion.div
                className={cn(styles.habitCard, habit.completed && styles.completed)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={{ left: 0.1, right: 0 }}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x: 0, touchAction: 'pan-y' }}
            // Removed onClick={onToggle} from here to prevent sync issues
            >
                {/* Content Area - clickable if needed, but separate from Checkbox */}
                <div className={styles.habitInfo} onClick={onToggle}>
                    <div className={styles.habitIcon} style={{ color: habit.color }}>
                        <IconComponent size={20} />
                    </div>
                    <div className={styles.habitText}>
                        <span className={styles.habitName}>{habit.title}</span>
                        <span className={styles.habitStreak}>
                            <Flame size={12} className={cn(styles.streakIcon, habit.streak > 0 && styles.fire)} />
                            {habit.streak} дней подряд
                        </span>
                    </div>
                </div>

                {/* Checkbox Area - Stop Propagation is KEY */}
                <div
                    className={styles.checkboxWrapper}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <Checkbox
                        checked={habit.completed}
                        onCheckedChange={onToggle}
                    />
                </div>
            </motion.div>
        </div>
    );
}
