import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeeklyCalendarWidget } from '../organisms/WeeklyCalendarWidget';
import { StatCard } from '../molecules/StatCard';
import { ActiveWorkoutCard } from '../organisms/ActiveWorkoutCard';
import { Flame, Clock, Dumbbell } from 'lucide-react';
import { FullCalendarModal } from '../organisms/FullCalendarModal';
import styles from './Dashboard.module.css';

// Stores
import { useWorkoutStore } from '@/stores/useWorkoutStore';
// import { useUserStore } from '@/stores/useUserStore';

export function DashboardPage() {
    const navigate = useNavigate();
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Stores
    const { workoutDates, activeWorkout, programs, history } = useWorkoutStore();
    // const { user } = useUserStore();

    // Determine current active workout details
    const activeProgram = activeWorkout
        ? programs.find(p => p.id === activeWorkout.programId)
        : null;

    // Calculate real stats from history
    const totalCalories = history.reduce((sum, h) => sum + (h.calories || 0), 0);
    const totalMinutes = history.reduce((sum, h) => sum + Math.round((h.duration || 0) / 60), 0);
    const totalVolumeWeight = history.reduce((sum, h) => sum + (h.totalVolume || 0), 0);

    return (
        <div className={styles.page}>
            {/* Stats Row */}
            <section className={styles.statsRow}>
                <StatCard
                    variant="vertical"
                    label="Ккалории"
                    value={totalCalories.toString()}
                    unit="ккал"
                    icon={<Flame size={20} />}
                />
                <StatCard
                    variant="vertical"
                    label="Время"
                    value={totalMinutes.toString()}
                    unit="минут"
                    icon={<Clock size={20} />}
                    trend={history.length > 0 ? { value: 0, isPositive: true } : undefined}
                />
                <StatCard
                    variant="vertical"
                    label="Вес"
                    value={totalVolumeWeight.toLocaleString('ru-RU')}
                    unit="кг"
                    icon={<Dumbbell size={20} />}
                />
            </section>

            {/* Calendar */}
            <WeeklyCalendarWidget
                onOpenFullCalendar={() => setIsCalendarOpen(true)}
            />

            {/* Active Workout */}
            <section>
                {activeWorkout && activeProgram ? (
                    <ActiveWorkoutCard
                        title={activeProgram.title}
                        progress={75} // Calculate real progress
                        currentWeek={1}
                        totalWeeks={4}
                        onClick={() => navigate('/workout/active')}
                    />
                ) : (
                    // Show last workout or suggestion if no active workout
                    <ActiveWorkoutCard
                        title="Начать тренировку"
                        progress={0}
                        currentWeek={1}
                        totalWeeks={1}
                        onClick={() => navigate('/workouts')}
                    />
                )}
            </section>

            <FullCalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                workoutDates={workoutDates}
            />
        </div>
    );
}
