import { motion } from 'framer-motion';
import { Text, Caption } from '../atoms/Typography';
import { cn } from '@/utils/cn';
import styles from './RestTimerCircle.module.css';

interface RestTimerCircleProps {
    secondsRemaining: number;
    totalSeconds: number;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}

export function RestTimerCircle({ secondsRemaining, totalSeconds, isActive, onClick, className }: RestTimerCircleProps) {
    const progress = (secondsRemaining / totalSeconds) * 100;
    // Calculate circumference for circle progress
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={cn(styles.container, className)} onClick={onClick}>
            <div className={styles.timerWrapper}>
                <svg className={styles.svg} viewBox="0 0 120 120">
                    {/* Background Circle */}
                    <circle
                        className={styles.bgCircle}
                        cx="60"
                        cy="60"
                        r={radius}
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        className={styles.progressCircle}
                        cx="60"
                        cy="60"
                        r={radius}
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        initial={{ strokeDashoffset: circumference }}
                        transition={{ duration: 0.5, ease: "linear" }}
                    />
                </svg>

                <div className={styles.content}>
                    <Text className={styles.time}>{Math.ceil(secondsRemaining)}</Text>
                    <Caption className={styles.label}>сек</Caption>
                </div>

                {/* Glow Effect */}
                {isActive && (
                    <motion.div
                        className={styles.glow}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </div>
        </div>
    );
}
