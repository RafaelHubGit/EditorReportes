// src/auth/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    isAuth: boolean;
    login: (jwt: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            isAuth: false,

            login: (jwt) =>
                set({ token: jwt, isAuth: true }),

            logout: () =>
                set({ token: null, isAuth: false }),
            }),
        {
            name: 'auth',           // localStorage key
            partialize: (state) => ({ token: state.token, isAuth: state.isAuth }),
        }
    )
);
