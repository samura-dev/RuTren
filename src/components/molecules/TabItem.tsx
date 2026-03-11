import { type ComponentProps } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Typography';
import { motion } from 'framer-motion';
import styles from './TabItem.module.css';
import { type LucideIcon } from 'lucide-react';

type TabItemProps = {
    icon: LucideIcon; // Changed from ElementType
    label?: string;
    isActive?: boolean;
    onClick?: () => void;
} & Omit<ComponentProps<'button'>, 'onClick'>;

export function TabItem({ icon, label, isActive, onClick, className, ...props }: TabItemProps) {
    return (
        <button
            className={cn(styles.tab, isActive && styles.active, className)}
            onClick={onClick}
            {...props}
        >
            <div className={styles.iconContainer}>
                <Icon
                    icon={icon}
                    size={24}
                    className={cn(styles.icon, isActive && styles.activeIcon)}
                />
                {isActive && (
                    <motion.div
                        layoutId="activeTabIndicator"
                        className={styles.indicator}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                )}
            </div>
            {label && <Text className={styles.label}>{label}</Text>}
        </button>
    );
}
