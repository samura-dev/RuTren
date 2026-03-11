import { cn } from '@/utils/cn';
import { Caption } from '../atoms/Typography';
import styles from './FilterChip.module.css';

type FilterChipProps = {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
};

export function FilterChip({ label, isActive, onClick, className }: FilterChipProps) {
    return (
        <button
            className={cn(styles.chip, isActive && styles.active, className)}
            onClick={onClick}
        >
            <Caption className={cn(styles.label, isActive && styles.activeLabel)}>
                {label}
            </Caption>
        </button>
    );
}
