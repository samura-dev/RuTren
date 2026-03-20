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
    const w = window as unknown as { Telegram?: { WebApp?: TelegramWebApp } };
    if (typeof window !== 'undefined' && w.Telegram && w.Telegram.WebApp) {
        return w.Telegram.WebApp;
    }
    return undefined;
};

export function useTelegram() {
    const tg = getTelegramWebApp();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Direct access to ensure execution
        const w = window as unknown as { Telegram?: { WebApp?: TelegramWebApp } };
        if (typeof window !== 'undefined' && w.Telegram && w.Telegram.WebApp) {
            const webApp = w.Telegram.WebApp;
            webApp.ready();
            webApp.expand();
            setTimeout(() => setIsReady(true), 0);
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
