import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import styles from './Controls.module.css';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, className, disabled }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => !disabled && onCheckedChange(!checked)}
            className={cn(
                styles.switch,
                checked ? styles.switchChecked : styles.switchUnchecked,
                disabled && styles.switchDisabled,
                className
            )}
            disabled={disabled}
        >
            <motion.div
                className={styles.switchThumb}
                animate={{ x: checked ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        </button>
    );
}
