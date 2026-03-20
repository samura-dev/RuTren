import { create } from 'zustand';
import pb from '@/lib/pocketbase';
import type { AuthModel } from 'pocketbase';

interface AuthState {
    user: AuthModel | null;
    loading: boolean;
    autoLogin: () => Promise<void>;
    logout: () => void;
    initialize: () => () => void; // returns unsubscribe function
}

export const useAuthStore = create<AuthState>((set) => ({
    user: pb.authStore.record,
    loading: true,

    autoLogin: async () => {
        try {
            set({ loading: true });
            if (pb.authStore.isValid) {
                set({ user: pb.authStore.record, loading: false });
                return;
            }
            
            try {
                // Try to login with dev user
                await pb.collection('users').authWithPassword('dev@rutren.com', 'Rutren123!');
            } catch (e) {
                // If fails, create the user
                await pb.collection('users').create({
                    username: 'dev_user',
                    email: 'dev@rutren.com',
                    password: 'Rutren123!',
                    passwordConfirm: 'Rutren123!',
                    name: 'Developer'
                });
                await pb.collection('users').authWithPassword('dev@rutren.com', 'Rutren123!');
            }
            set({ user: pb.authStore.record });
        } catch (error) {
            console.error('PocketBase AutoAuth error:', error);
        } finally {
            set({ loading: false });
        }
    },

    logout: () => {
        try {
            pb.authStore.clear();
            set({ user: null });
        } catch (error) {
            console.error('PocketBase Logout error:', error);
        }
    },

    initialize: () => {
        set({ user: pb.authStore.record, loading: false });

        // Подписываемся на изменения авторизации в PocketBase
        const unsubscribe = pb.authStore.onChange((token, model) => {
            console.log('PocketBase auth state changed!', model ? `User ${model.id}` : 'No user');
            set({ user: model });
        });

        // Возвращаем функцию отписки
        return () => unsubscribe();
    },
}));
