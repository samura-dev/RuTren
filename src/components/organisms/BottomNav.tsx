import { type ComponentProps } from 'react';
import { cn } from '@/utils/cn';
import { GlassCard } from '../atoms/GlassCard';
import { TabItem } from '../molecules/TabItem';
import { Home, User, Dumbbell, BookOpen } from 'lucide-react';
import styles from './BottomNav.module.css';

type BottomNavProps = {
    activeTab?: 'home' | 'train' | 'exercises' | 'settings';
    onTabChange?: (tab: 'home' | 'train' | 'exercises' | 'settings') => void;
} & Omit<ComponentProps<typeof GlassCard>, 'children'>;

export function BottomNav({ activeTab = 'home', onTabChange, className, ...props }: BottomNavProps) {
    return (
        <GlassCard
            className={cn(styles.nav, className)}
            contentClassName={styles.content}
            noPadding
            {...props}
        >
            <TabItem
                icon={Home}
                isActive={activeTab === 'home'}
                onClick={() => onTabChange?.('home')}
            />
            <TabItem
                icon={Dumbbell}
                isActive={activeTab === 'train'}
                onClick={() => onTabChange?.('train')}
            />
            <TabItem
                icon={BookOpen}
                isActive={activeTab === 'exercises'}
                onClick={() => onTabChange?.('exercises')}
            />
            <TabItem
                icon={User}
                isActive={activeTab === 'settings'}
                onClick={() => onTabChange?.('settings')}
            />
        </GlassCard>
    );
}
