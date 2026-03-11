import { type ComponentProps, forwardRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Input.module.css';

interface InputProps extends ComponentProps<'input'> {
    leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", leftIcon, ...props }, ref) => {
        if (leftIcon) {
            return (
                <div className={styles.inputWrapper}>
                    <div className={styles.leftIcon}>{leftIcon}</div>
                    <input
                        ref={ref}
                        type={type}
                        className={cn(styles.input, styles.hasLeftIcon, className)}
                        {...props}
                    />
                </div>
            );
        }

        return (
            <input
                ref={ref}
                type={type}
                className={cn(styles.input, className)}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";
