import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { Text, SectionTitle } from './Typography';
import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'default';
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmLabel = 'Удалить',
    cancelLabel = 'Отмена',
    variant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className={styles.overlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                    />

                    {/* Dialog */}
                    <motion.div
                        className={styles.dialog}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {variant === 'danger' && (
                            <div className={styles.iconWrapper}>
                                <AlertTriangle size={28} />
                            </div>
                        )}
                        <SectionTitle className={styles.title}>{title}</SectionTitle>
                        <Text className={styles.message}>{message}</Text>

                        <div className={styles.actions}>
                            <Button
                                variant="ghost"
                                className={styles.cancelBtn}
                                onClick={onCancel}
                            >
                                {cancelLabel}
                            </Button>
                            <Button
                                variant="primary"
                                className={`${styles.confirmBtn} ${variant === 'danger' ? styles.dangerBtn : ''}`}
                                onClick={onConfirm}
                            >
                                {confirmLabel}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
