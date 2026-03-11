import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import styles from './ModalOverlay.module.css';

interface ModalOverlayProps {
    children: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

export function ModalOverlay({ children, onClose, className }: ModalOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(styles.overlay, className)}
            onClick={(e) => {
                if (e.target === e.currentTarget && onClose) {
                    onClose();
                }
            }}
        >
            {children}
        </motion.div>
    );
}
