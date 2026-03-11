import { GlassCard } from '../atoms/GlassCard';
import { Text, Caption } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import styles from './GoalCard.module.css';

interface GoalCardProps {
    title: string;
    progress: number; // 0 to 100
    target: string;
    current: string;
    color?: string;
    onClick?: () => void;
    className?: string;
}

export function GoalCard({ title, progress, target, current, color = 'var(--color-accent)', onClick, className }: GoalCardProps) {
    return (
        <GlassCard
            className={cn(styles.card, className)}
            onClick={onClick}
            role="button"
            tabIndex={0}
            contentClassName={styles.content}
        >
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Text className={styles.title}>{title}</Text>
                    <Caption className={styles.stats}>
                        {current} / {target}
                    </Caption>
                </div>
                <Icon icon={ChevronRight} size={20} className={styles.icon} />
            </div>

            <div className={styles.progressContainer}>
                <div className={styles.progressTrack}>
                    <motion.div
                        className={styles.progressBar}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ backgroundColor: color }}
                    />
                </div>
            </div>
        </GlassCard>
    );
}
