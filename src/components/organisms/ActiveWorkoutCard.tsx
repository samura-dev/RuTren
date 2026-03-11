import { cn } from '@/utils/cn';
import { GlassCard } from '../atoms/GlassCard';
import { SectionTitle, Caption } from '../atoms/Typography';
import styles from './ActiveWorkoutCard.module.css';

type ActiveWorkoutCardProps = {
    title: string;
    subtitle?: string;
    progress: number;
    currentWeek: number;
    totalWeeks: number;
    className?: string;
    onClick?: () => void;
};

export function ActiveWorkoutCard({
    title,
    subtitle = 'Активна',
    progress,
    currentWeek,
    totalWeeks,
    className,
    onClick
}: ActiveWorkoutCardProps) {
    return (
        <GlassCard
            className={cn(styles.card, className)}
            contentClassName={styles.content}
            noPadding
            onClick={onClick}
        >
            <div className={styles.header}>
                <Caption className={styles.statusLabel}>{subtitle}</Caption>
                <Caption className={styles.statusValue}>Тренировка</Caption>
            </div>

            <SectionTitle className={styles.title}>{title}</SectionTitle>

            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className={styles.footer}>
                <Caption className={styles.weekInfo}>
                    Неделя {currentWeek} из {totalWeeks}
                </Caption>
                <Caption className={styles.percentage}>
                    {progress}%
                </Caption>
            </div>
        </GlassCard>
    );
}
