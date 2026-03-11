import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Controls.module.css';

interface CheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
}

export function Checkbox({ checked, onCheckedChange, className, disabled }: CheckboxProps) {
    return (
        <label className={cn(styles.checkboxContainer, className)}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => !disabled && onCheckedChange(e.target.checked)}
                className={styles.hiddenInput}
                disabled={disabled}
            />
            <div
                className={cn(
                    styles.checkbox,
                    checked ? styles.checkboxChecked : styles.checkboxUnchecked,
                    disabled && styles.checkboxDisabled
                )}
            >
                <AnimatePresence>
                    {checked && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={styles.checkmarkContainer}
                        >
                            <Check size={16} strokeWidth={3} className={styles.checkIcon} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </label>
    );
}
