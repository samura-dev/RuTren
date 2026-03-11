import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Text, SectionTitle } from '../atoms/Typography';
import { cn } from '@/utils/cn';
import styles from './NotificationsModal.module.css';

interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning';
    title: string;
    message: string;
    time: string;
}

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock Data
const NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'success',
        title: 'Тренировка завершена!',
        message: 'Вы отлично поработали сегодня. Так держать!',
        time: '2 часа назад'
    },
    {
        id: '2',
        type: 'info',
        title: 'Новое достижение',
        message: 'Вы выполнили 10 тренировок подряд.',
        time: 'Вчера'
    },
    {
        id: '3',
        type: 'warning',
        title: 'Напоминание',
        message: 'Не забудьте выпить воды.',
        time: 'Вчера'
    }
];

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'warning': return <AlertTriangle size={20} />;
            case 'info': default: return <Info size={20} />;
        }
    };

    const getIconStyle = (type: Notification['type']) => {
        switch (type) {
            case 'success': return styles.iconSuccess;
            case 'warning': return styles.iconWarning;
            case 'info': default: return styles.iconInfo;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div
                    className={styles.modal}
                    ref={ref}
                >
                    <header className={styles.header}>
                        <div className={styles.headerLeft}>
                            <Bell size={20} className={styles.bellIcon} />
                            <SectionTitle className={styles.modalTitle}>Уведомления</SectionTitle>
                        </div>
                        <button onClick={onClose} className={styles.closeBtn}>
                            <X size={18} />
                        </button>
                    </header>

                    <div className={styles.list}>
                        {NOTIFICATIONS.length > 0 ? (
                            NOTIFICATIONS.map(item => (
                                <div key={item.id} className={styles.notificationItem}>
                                    <div className={cn(styles.iconWrapper, getIconStyle(item.type))}>
                                        {getIcon(item.type)}
                                    </div>
                                    <div className={styles.content}>
                                        <div className={styles.itemHeader}>
                                            <span className={styles.title}>{item.title}</span>
                                            <span className={styles.time}>{item.time}</span>
                                        </div>
                                        <p className={styles.message}>{item.message}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <Bell size={40} className={styles.emptyIcon} />
                                <Text>Нет новых уведомлений</Text>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
