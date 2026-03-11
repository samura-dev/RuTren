import { type LucideIcon, type LucideProps } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Icon.module.css';

interface IconProps extends LucideProps {
    icon: LucideIcon;
    className?: string;
}

export function Icon({ icon: IconComponent, className, size = 24, ...props }: IconProps) {
    return (
        <IconComponent
            size={size}
            className={cn(styles.icon, className)}
            {...props}
        />
    );
}
