import { cn } from '@/utils/cn';
import styles from './Visuals.module.css';

interface SkeletonProps {
    className?: string;
    height?: string | number;
    width?: string | number;
}

export function Skeleton({ className, height, width }: SkeletonProps) {
    return (
        <div
            className={cn(styles.skeleton, className)}
            style={{ height, width }}
        />
    );
}
