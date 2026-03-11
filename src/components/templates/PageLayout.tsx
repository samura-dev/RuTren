import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/organisms/Header';
import { BottomNav } from '@/components/organisms/BottomNav';
import { Bell } from 'lucide-react';
import { Button } from '../atoms/Button';
import { NotificationsModal } from '../organisms/NotificationsModal';
import { useTelegram } from '@/hooks/useTelegram';
import styles from './PageLayout.module.css';

export function PageLayout({ children }: { children?: React.ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Скрываем элементы на определенных экранах
    const isAuth = ['/login', '/onboarding'].includes(location.pathname);
    const isWorkout = location.pathname.startsWith('/workout');
    const isSettings = location.pathname === '/settings';
    const isProfile = location.pathname === '/profile';
    const isProfileSubPage = location.pathname.startsWith('/profile/');
    const isAnalytics = location.pathname === '/analytics';
    const isExercises = location.pathname.startsWith('/exercises');
    const hideHeader = isAuth || isWorkout || isSettings || isProfile || isProfileSubPage || isAnalytics || isExercises;
    const hideBottomNav = isAuth;

    // Определяем активный таб по пути
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.startsWith('/dashboard')) return 'home';
        if (path.startsWith('/exercises')) return 'exercises'; // Updated from 'goals' to 'exercises'
        if (path.startsWith('/workouts')) return 'train';
        if (path.startsWith('/profile')) return 'settings';
        return 'home';
    };

    const handleTabChange = (tab: 'home' | 'train' | 'exercises' | 'settings'): void => {
        switch (tab) {
            case 'home': navigate('/dashboard'); break;
            case 'train': navigate('/workouts'); break;
            case 'exercises': navigate('/exercises'); break;
            case 'settings': navigate('/profile'); break;
        }
    };

    const { user: tgUser } = useTelegram();

    // Динамический заголовок в зависимости от роута
    const getHeaderTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/dashboard')) return {
            title: 'RuTren',
            subtitle: tgUser?.first_name ? `Привет, ${tgUser.first_name}` : 'Привет, Даниил'
        };
        if (path.startsWith('/workout')) return { title: 'Тренировка', subtitle: 'Текущая программа' };
        if (path.startsWith('/exercises')) return { title: 'Упражнения', subtitle: 'Библиотека' };
        if (path.startsWith('/profile')) return { title: 'Профиль', subtitle: 'Настройки аккаунта' };
        return { title: 'RuTren', subtitle: 'UI Kit' };
    };

    const { title, subtitle } = getHeaderTitle();

    const AvatarVideo = () => (
        <img
            src={tgUser?.photo_url || "https://github.com/shadcn.png"}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    );


    return (
        <div className={styles.layout}>
            {!hideHeader && (
                <Header
                    title={title}
                    subtitle={subtitle}
                    centered
                    avatar={location.pathname === '/dashboard' ? <AvatarVideo /> : undefined}
                    action={
                        <Button
                            variant="ghost"
                            className={styles.bellButton}
                            onClick={() => setIsNotificationsOpen(true)}
                        >
                            <Bell size={24} />
                            {/* Notification Dot */}
                            <span className={styles.notificationDot} />
                        </Button>
                    }
                />
            )}

            <main className={styles.main}>
                {children || <Outlet />}
            </main>

            {!hideBottomNav && (
                <BottomNav
                    activeTab={getActiveTab()}
                    onTabChange={handleTabChange}
                />
            )}

            <NotificationsModal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
            />
        </div>
    );
}
