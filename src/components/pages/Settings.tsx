import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../organisms/Header';
import { Text, Caption } from '../atoms/Typography';
import { Switch } from '../atoms/Switch';
import { Button } from '../atoms/Button';
import { ChevronRight, Moon, Globe, Bell, Shield, MoreHorizontal } from 'lucide-react';
import { SEO } from '../SEO';
import styles from './Settings.module.css';
import { useUserStore } from '@/stores/useUserStore';

export function Settings() {
    const navigate = useNavigate();
    const { user, updateSettings } = useUserStore();
    const { settings } = user;

    const handleThemeChange = (checked: boolean) => {
        updateSettings({ darkTheme: checked });
    };

    const handleNotificationsChange = (checked: boolean) => {
        updateSettings({ notifications: checked });
    };

    return (
        <div className={styles.page}>
            <SEO title="RuTren - Настройки" />
            <Header
                title="Настройки"
                showBack
                onBack={() => navigate(-1)}
                centered
                action={
                    <Button
                        variant="ghost"
                        className={styles.headerActionBtn}
                    >
                        <MoreHorizontal size={24} />
                    </Button>
                }
            />

            <div className={styles.section}>
                <Caption className={styles.sectionTitle}>Общие</Caption>
                <div className={styles.cardGroup}>
                    <SettingsItem
                        icon={<Moon size={20} />}
                        label="Темная тема"
                        control={<Switch checked={settings.darkTheme} onCheckedChange={handleThemeChange} />}
                    />
                    <SettingsItem
                        icon={<Bell size={20} />}
                        label="Уведомления"
                        control={<Switch checked={settings.notifications} onCheckedChange={handleNotificationsChange} />}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <Caption className={styles.sectionTitle}>Безопасность</Caption>
                <div className={styles.cardGroup}>
                    <div onClick={() => navigate('/privacy')}>
                        <SettingsItem
                            icon={<Shield size={20} />}
                            label="Политика конфиденциальности"
                            showArrow
                        />
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <Text className={styles.version}>Версия 1.0.0 (Beta)</Text>
            </div>
        </div>
    );
}

function SettingsItem({ icon, label, value, control, showArrow }: { icon: React.ReactNode, label: string, value?: string, control?: React.ReactNode, showArrow?: boolean }) {
    return (
        <div className={styles.item}>
            <div className={styles.iconWrapper}>{icon}</div>
            <div className={styles.content}>
                <Text className={styles.label}>{label}</Text>
            </div>
            <div className={styles.actions}>
                {value && <span className={styles.value}>{value}</span>}
                {control}
                {showArrow && <ChevronRight size={20} className={styles.arrow} />}
            </div>
        </div>
    );
}
