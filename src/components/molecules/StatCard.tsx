import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { GlassCard } from '../atoms/GlassCard';
import { Text, Caption } from '../atoms/Typography';
import styles from './StatCard.module.css';

type Trend = {
    value: number;
    isPositive: boolean;
};

type StatCardProps = {
    label: string;
    value: string | number;
    unit?: string;
    icon: ReactNode;
    trend?: Trend;
    className?: string;
    variant?: 'horizontal' | 'vertical'; // Added variant
};

export function StatCard({ label, value, unit, icon, trend, className, variant = 'horizontal' }: StatCardProps) {
    return (
        <GlassCard
            className={cn(
                styles.card,
                variant === 'vertical' && styles.vertical,
                className
            )}
            noPadding
        >
            <div className={styles.iconContainer}>
                {icon}
            </div>

            <div className={styles.content}>
                <Caption className={styles.label}>{label}</Caption>
                <div className={styles.valueContainer}>
                    <Text className={styles.value}>{value}</Text>
                    {unit && <span className={styles.unit}>{unit}</span>}
                </div>

                {trend && (
                    <div className={cn(styles.trend, trend.isPositive ? styles.positive : styles.negative)}>
                        {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
