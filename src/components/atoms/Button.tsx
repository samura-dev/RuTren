import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { scaleTap } from '@/utils/animations';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
    className?: string;
}

export function Button({ variant = 'primary', size, children, className, ...props }: ButtonProps) {
    return (
        <motion.button
            whileTap={scaleTap}
            className={cn(styles.button, styles[variant], size && styles[size], className)}
            {...props}
        >
            {children}
        </motion.button>
    );
}
