// src/auth/useAuthStore.ts
import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { REGISTER_USER } from '../graphql/operations/graphql.auth.operations';
import { GraphQLService } from '../graphql/graphql.service';
import Swal from 'sweetalert2';
import { immer } from 'zustand/middleware/immer';

interface AuthState {
    token: string | null;
    isAuth: boolean;
    login: (jwt: string) => void;
    logout: () => void;

    // Actions
    register: (user: { name: string; email: string; password: string }) => Promise<boolean>;
}


const authStore: StateCreator<AuthState, [["zustand/immer", never]]> = (set, get) => ({
    token: null,
    isAuth: false,
    login: (jwt) =>
        set({ token: jwt, isAuth: true }),
    logout: () =>
        set({ token: null, isAuth: false }),

    // Actions
    register: async (user): Promise<boolean> => {
        try {
            const result = await GraphQLService.mutate(REGISTER_USER, { input: user });

            console.log("result : ", result)

            if (result?.error || !result.data?.register) {
                const userExistsError = result.error?.errors.find(
                    (error: any) => error.message === 'User already exists'
                );

                if (userExistsError) {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Ya estás registrado!',
                        text: 'Parece que ya existe una cuenta con este correo electrónico. Intenta iniciar sesión.',
                        confirmButtonText: 'Entendido',
                        showCancelButton: false
                    });
                    return false;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar usuario',
                    text: 'No se pudo registrar el usuario. Por favor, inténtalo de nuevo más tarde.',
                    confirmButtonText: 'Entendido'
                });
                throw result.errors;
            }

            Swal.fire({
                icon: 'success',
                title: '¡Usuario registrado correctamente!',
                text: `El usuario "${user.name}" se ha registrado correctamente`,
                confirmButtonText: 'Entendido',
                position: 'center'
            });
            return true;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return false;
        }
    },
});

export const useAuthStore = create<AuthState>()(
    devtools(
        immer(authStore),
        { name: 'Auth Store' }
    ),
);
