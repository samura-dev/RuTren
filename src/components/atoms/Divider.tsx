import { cn } from '@/utils/cn';
import styles from './Visuals.module.css';

interface DividerProps {
    className?: string;
    orientation?: 'horizontal' | 'vertical';
}

export function Divider({ className, orientation = 'horizontal' }: DividerProps) {
    return (
        <div
            className={cn(
                styles.divider,
                orientation === 'horizontal' ? styles.dividerHorizontal : styles.dividerVertical,
                className
            )}
        />
    );
}
