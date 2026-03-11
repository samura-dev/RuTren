import { type ComponentProps, forwardRef } from 'react';
import { Input } from '../atoms/Input';
import { Icon } from '../atoms/Icon';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './SearchInput.module.css';

type SearchInputProps = ComponentProps<typeof Input>;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className={styles.container}>
                <div className={styles.iconWrapper}>
                    <Icon icon={Search} size={18} className={styles.icon} />
                </div>
                <Input
                    ref={ref}
                    className={cn(styles.input, className)}
                    {...props}
                />
            </div>
        );
    }
);
SearchInput.displayName = 'SearchInput';
