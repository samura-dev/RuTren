import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { motion, type HTMLMotionProps } from 'framer-motion';
import styles from './GlassCard.module.css';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    noPadding?: boolean;
}

export function GlassCard({ children, className, contentClassName, noPadding = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                styles.card,
                className
            )}
            {...props}
        >
            <div className={styles.overlay} />
            <div className={cn(
                styles.content,
                !noPadding && styles.padding,
                contentClassName
            )}>
                {children}
            </div>
        </motion.div>
    );
}
