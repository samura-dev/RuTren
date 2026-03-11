import { type ComponentProps, forwardRef } from 'react';
import { Input } from '../atoms/Input';
import { Label, Caption } from '../atoms/Typography';
import { cn } from '@/utils/cn';
import styles from './FormInput.module.css';

type FormInputProps = {
    label?: string;
    error?: string;
    containerClassName?: string;
} & ComponentProps<typeof Input>;

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, className, containerClassName, id, ...props }, ref) => {
        return (
            <div className={cn(styles.container, containerClassName)}>
                {label && (
                    <Label htmlFor={id} className={styles.label}>
                        {label}
                    </Label>
                )}
                <Input
                    ref={ref}
                    id={id}
                    className={cn(error && styles.inputError, className)}
                    {...props}
                />
                {error && (
                    <Caption className={styles.error}>
                        {error}
                    </Caption>
                )}
            </div>
        );
    }
);
FormInput.displayName = 'FormInput';
