import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Text, Caption } from '../atoms/Typography';
import {
    Settings as SettingsIcon,
    ChevronRight,
    User,
    Trophy,
    LogOut,
    BarChart2,
    Ruler,
    ListTodo
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { cn } from '@/utils/cn';
import styles from './Profile.module.css';
import { useUserStore } from '@/stores/useUserStore';
import { useWorkoutStore } from '@/stores/useWorkoutStore';

export function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useUserStore();
    const { history } = useWorkoutStore();
    const { profile, level } = user;

    if (!profile) return null;

    const totalWorkouts = history.length;
    const totalHours = Math.round(history.reduce((sum, h) => sum + (h.duration || 0), 0) / 3600);
    const totalVolume = history.reduce((sum, h) => sum + (h.totalVolume || 0), 0);
    const volumeFormatted = totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}т` : `${totalVolume}кг`;

    return (
        <div className={styles.page}>
            <Header
                title="Профиль"
                centered
                showBack
                onBack={() => navigate(-1)}
                action={
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/analytics')}
                        className={styles.headerActionBtn}
                    >
                        <BarChart2 size={24} />
                    </Button>
                }
            />

            <div className={styles.profileInfo}>
                <div className={styles.avatarContainer}>
                    <img
                        src={profile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                        alt="Profile"
                        className={styles.avatar}
                    />
                    <div className={styles.levelBadge}>{level}</div>
                </div>
                <div className={styles.userInfo}>
                    <Text className={styles.name}>{profile.name}</Text>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <StatBox value={totalWorkouts.toString()} label="Тренировок" />
                <StatBox value={totalHours.toString()} label="Часов" />
                <StatBox value={volumeFormatted} label="Тоннаж" />
            </div>

            <div className={styles.section}>
                <Caption className={styles.sectionLabel}>Аккаунт</Caption>
                <div className={styles.menuGroup}>
                    <MenuItem icon={<User size={20} />} label="Личные данные" onClick={() => navigate('/profile/personal-data')} />
                    <MenuItem icon={<Ruler size={20} />} label="Замеры" value="Сегодня" onClick={() => navigate('/profile/measurements')} />
                    <MenuItem icon={<ListTodo size={20} />} label="Привычки" value="2/5" onClick={() => navigate('/profile/habits')} />
                    <MenuItem icon={<Trophy size={20} />} label="Достижения" value="1/6" onClick={() => navigate('/profile/achievements')} />
                    <MenuItem icon={<SettingsIcon size={20} />} label="Настройки" onClick={() => navigate('/settings')} />
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.menuGroup}>
                    <MenuItem
                        icon={<LogOut size={20} />}
                        label="Выйти"
                        isDestructive
                        onClick={() => {
                            logout();
                            navigate('/onboarding');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function StatBox({ value, label }: { value: string, label: string }) {
    return (
        <div className={styles.statBox}>
            <Text className={styles.statValue}>{value}</Text>
            <Caption className={styles.statLabel}>{label}</Caption>
        </div>
    );
}

function MenuItem({ icon, label, value, onClick, isDestructive }: { icon: any, label: string, value?: string, onClick?: () => void, isDestructive?: boolean }) {
    return (
        <div className={cn(styles.menuItem, isDestructive && styles.destructive)} onClick={onClick}>
            <div className={styles.menuIcon}>{icon}</div>
            <Text className={styles.menuLabel}>{label}</Text>
            {value && <span className={styles.menuValue}>{value}</span>}
            <ChevronRight size={16} className={styles.chevron} />
        </div>
    );
}
