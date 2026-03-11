import { cn } from '@/utils/cn';
import styles from './Visuals.module.css';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'accent' | 'danger' | 'outline';
    className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variants = {
        default: styles.badgeDefault,
        accent: styles.badgeAccent,
        danger: styles.badgeDanger,
        outline: styles.badgeOutline,
    };

    return (
        <span className={cn(
            styles.badge,
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
