import { create } from 'zustand';
import { signInAnonymously, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/config/firebase';

interface AuthState {
    user: User | null;
    loading: boolean;
    signIn: () => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => () => void; // returns unsubscribe function
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    signIn: async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error('Auth error:', error);
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    initialize: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user ? `User ${user.uid}` : 'No user');
            set({ user, loading: false });
        });
        return unsubscribe;
    },
}));
