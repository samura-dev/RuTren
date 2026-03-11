import { type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '../atoms/Button';
import { PageTitle } from '../atoms/Typography';
import { ChevronLeft } from 'lucide-react';
import styles from './Header.module.css';

type HeaderProps = {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    action?: ReactNode;
    avatar?: ReactNode; // New prop
    centered?: boolean;
} & ComponentProps<'header'>;

export function Header({ title, subtitle, showBack, onBack, action, avatar, centered, className, ...props }: HeaderProps) {
    return (
        <header className={cn(styles.header, centered && styles.centered, className)} {...props}>
            {/* Left Slot: Back Button or Avatar */}
            <div className={styles.leftSlot}>
                {showBack && (
                    <Button variant="ghost" className={styles.backButton} onClick={onBack}>
                        <ChevronLeft size={24} />
                    </Button>
                )}
                {avatar && (
                    <div className={styles.avatarContainer}>
                        {avatar}
                    </div>
                )}
            </div>

            {/* Center Slot: Title */}
            <div className={styles.centerSlot}>
                <div className={styles.titleContainer}>
                    <PageTitle className={styles.title}>{title}</PageTitle>
                    {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                </div>
            </div>

            {/* Right Slot: Action */}
            <div className={styles.rightSlot}>
                {action && (
                    <div className={styles.action}>
                        {action}
                    </div>
                )}
            </div>
        </header>
    );
}
