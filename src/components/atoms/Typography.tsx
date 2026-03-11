import { type ComponentProps, type ElementType, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Typography.module.css';

type TypographyProps = {
    as?: ElementType;
    className?: string;
    children: ReactNode;
    htmlFor?: string;
} & ComponentProps<'p'>;

export function PageTitle({ as: Tag = 'h1', className, children, ...props }: TypographyProps) {
    return (
        <Tag
            className={cn(styles.title, className)}
            {...props}
        >
            {children}
        </Tag>
    );
}

export function SectionTitle({ as: Tag = 'h2', className, children, ...props }: TypographyProps) {
    return (
        <Tag
            className={cn(styles.sectionTitle, className)}
            {...props}
        >
            {children}
        </Tag>
    );
}

export function Text({ as: Tag = 'p', className, children, ...props }: TypographyProps) {
    return (
        <Tag
            className={cn(styles.text, className)}
            {...props}
        >
            {children}
        </Tag>
    );
}

export function Caption({ as: Tag = 'span', className, children, ...props }: TypographyProps) {
    return (
        <Tag
            className={cn(styles.caption, className)}
            {...props}
        >
            {children}
        </Tag>
    );
}

export function Label({ as: Tag = 'label', className, children, ...props }: TypographyProps) {
    return (
        <Tag
            className={cn(styles.label, className)}
            {...props}
        >
            {children}
        </Tag>
    );
}
