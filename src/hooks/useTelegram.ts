import { useEffect, useState } from 'react';

// Declaration for Telegram WebApp
interface TelegramWebApp {
    ready(): void;
    expand(): void;
    close(): void;
    MainButton: {
        show(): void;
        hide(): void;
        isVisible: boolean;
        onClick(callback: () => void): void;
        offClick(callback: () => void): void;
        setText(text: string): void;
        setParams(params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }): void;
    };
    HapticFeedback: {
        impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
        notificationOccurred(type: 'error' | 'success' | 'warning'): void;
        selectionChanged(): void;
    };
    BackButton: {
        show(): void;
        hide(): void;
        onClick(callback: () => void): void;
        offClick(callback: () => void): void;
        isVisible: boolean;
    };
    initDataUnsafe: {
        user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            language_code?: string;
        };
        query_id?: string;
        start_param?: string;
    };
    themeParams: {
        bg_color?: string;
        text_color?: string;
        hint_color?: string;
        link_color?: string;
        button_color?: string;
        button_text_color?: string;
        secondary_bg_color?: string;
        header_bg_color?: string; // bg_color or secondary_bg_color
        accent_text_color?: string;
        section_bg_color?: string;
        section_header_text_color?: string;
        subtitle_text_color?: string;
        destructive_text_color?: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    setHeaderColor(color: string): void;
    setBackgroundColor(color: string): void;
}

// Safely access the Telegram object
const getTelegramWebApp = (): TelegramWebApp | undefined => {
    if (typeof window !== 'undefined' && (window as any).Telegram && (window as any).Telegram.WebApp) {
        return (window as any).Telegram.WebApp as TelegramWebApp;
    }
    return undefined;
};

export function useTelegram() {
    const tg = getTelegramWebApp();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Direct access to ensure execution
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
            const webApp = window.Telegram.WebApp;
            webApp.ready();
            webApp.expand();
            setIsReady(true);
        }
    }, []);

    const onClose = () => {
        tg?.close();
    };

    const onToggleButton = () => {
        if (tg?.MainButton.isVisible) {
            tg?.MainButton.hide();
        } else {
            tg?.MainButton.show();
        }
    };

    const hapticImpact = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
        tg?.HapticFeedback.impactOccurred(style);
    };

    const hapticNotification = (type: 'error' | 'success' | 'warning') => {
        tg?.HapticFeedback.notificationOccurred(type);
    };

    const hapticSelection = () => {
        tg?.HapticFeedback.selectionChanged();
    };

    return {
        onClose,
        onToggleButton,
        tg,
        user: tg?.initDataUnsafe?.user,
        queryId: tg?.initDataUnsafe?.query_id,
        isReady,
        hapticImpact,
        hapticNotification,
        hapticSelection,
        backButton: tg?.BackButton,
        themeParams: tg?.themeParams,
    };
}
