import { cn } from '@/utils/cn';
import styles from './Visuals.module.css';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: number;
    className?: string;
}

export function Avatar({ src, alt, fallback = "US", size = 40, className }: AvatarProps) {
    return (
        <div
            className={cn(styles.avatar, className)}
            style={{ width: size, height: size }}
        >
            {src ? (
                <img src={src} alt={alt} className={styles.avatarImage} />
            ) : (
                <span className={styles.avatarFallback}>
                    {fallback.substring(0, 2).toUpperCase()}
                </span>
            )}
        </div>
    );
}
