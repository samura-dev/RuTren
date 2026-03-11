import { SectionTitle as Title } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { cn } from '@/utils/cn';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function SectionHeader({ title, actionLabel, onAction, className }: SectionHeaderProps) {
    return (
        <div className={cn(styles.container, className)}>
            <Title className={styles.title}>{title}</Title>
            {actionLabel && (
                <Button variant="ghost" onClick={onAction} className={styles.action}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
