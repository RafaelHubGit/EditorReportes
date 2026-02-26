// src/auth/useAuthStore.ts
import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GET_ALL_USERS, LOGIN_USER, REFRESH_TOKEN, REGISTER_USER, RESET_USER_PASSWORD, TOGGLE_USER_STATUS } from '../graphql/operations/graphql.auth.operations';
import { GraphQLService } from '../graphql/graphql.service';
import Swal from 'sweetalert2';
import { immer } from 'zustand/middleware/immer';

interface IUser {
    id: string;
    name: string;
    email: string;
    active?: boolean
}

interface IUserAdmin {
    id: string;
    name: string;
    email: string;
    active: boolean;
    created_at: string;
}

interface AuthState {
    token: string | null;
    isAuth: boolean;
    user: IUser | null;
    users: IUserAdmin[];
    loading: boolean;
    
    // Actions
    register: (user: { name: string; email: string; password: string }) => Promise<boolean>;
    login: (user: { email: string; password: string }) => Promise<boolean>;
    logout: () => void;
    refreshToken: () => Promise<boolean>;

    // Actions
    getAllUsers: () => Promise<void>;
    toggleStatus: (id: string, active: boolean) => Promise<void>;
    resetPassword: (id: string) => Promise<void>;
}


const authStore: StateCreator<AuthState, [["zustand/immer", never]]> = (set, get) => ({
    token: localStorage.getItem('token'),
    isAuth: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    users: [],
    loading: false,
   
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
    login: async (userVar: { email: string; password: string }) => {
        try{
            const response = await GraphQLService.mutate(LOGIN_USER, { input: userVar });

            if (response?.error || !response.data?.login) {
                const invalidCredentialsError = response.error?.errors.find(
                    (error: any) => error.message === 'Invalid credentials'
                );

                if (invalidCredentialsError) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Usuario o contraseña incorrectos!',
                        text: 'Valide sus credenciales e intente de nuevo.',
                        confirmButtonText: 'Entendido',
                        showCancelButton: false
                    });
                    return false;
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error al iniciar sesión',
                    text: 'No se pudo iniciar sesión. Por favor, inténtalo de nuevo más tarde.',
                    confirmButtonText: 'Entendido'
                });
                throw response.errors;
            }

            const { token, refreshToken, user } = response.data?.login;
            
            if (!token || !refreshToken || !user) {
                throw new Error('Error al iniciar sesión');
            }

            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuth', 'true');
            
            set({ 
                token, 
                isAuth: true,
                user
            });
            
            Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: `Bienvenido ${user.name}`,
                confirmButtonText: 'Entendido',
                position: 'center'
            });
            
            return true;
        } catch(error){
            console.error('Error al iniciar sesión:', error);
            return false;
        }
    },
    logout: () => {
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuth');
        set({ token: null, isAuth: false, user: null });
    },
    refreshToken: async () => {
        try {
            const refreshTokenLocal = localStorage.getItem('refreshToken');
            console.log("refreshTokenLocal : ", refreshTokenLocal)

            if (!refreshTokenLocal) {
                return false;
            }

            const response = await GraphQLService.mutate(REFRESH_TOKEN, { input: { refreshToken: refreshTokenLocal } });
            
            console.log("response REFRESH TOKEN: ", response)
            
            if (response?.error || !response.data?.refreshToken) {
                throw response?.error || new Error('Token refresh failed: empty response from server.');
            }
            
            const { token, refreshToken } = response.data?.refreshToken;
            
            if (!token || !refreshToken) {
                throw new Error('Error al refrescar el token');
            }
            
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('token', token);
            localStorage.setItem('isAuth', JSON.stringify(true));
            
            set({ 
                token,
                isAuth: true,
            });
            
            return true;
        } catch(error){
            console.error('Error al refrescar el token:', error);
            return false;
        }
    },

    getAllUsers: async () => {
        set({ loading: true });
        try {
            const result = await GraphQLService.query(GET_ALL_USERS);
            if (result.data?.users) {
                set({ users: result.data.users });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            set({ loading: false });
        }
    },

    toggleStatus: async (id: string, active: boolean) => {
        try {
            const activeV = !active;
            const result = await GraphQLService.mutate(TOGGLE_USER_STATUS, { id, active: activeV });
            if (result.data?.toggleUserStatus) {
                set((state) => {
                    const user = state.users.find(u => u.id === id);
                    if (user) user.active = result.data.toggleUserStatus.active;
                });
                
                Swal.fire({
                    icon: 'success',
                    title: 'Estado actualizado',
                    timer: 1000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
        }
    },

    resetPassword: async (id: string) => {

        try {
            const result = await GraphQLService.mutate(RESET_USER_PASSWORD, { id });
            if (result.data?.resetUserPassword) {
                Swal.fire('¡Éxito!', 'Contraseña restablecida correctamente', 'success');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo realizar el reset', 'error');
        } 
    }

});

export const useAuthStore = create<AuthState>()(
    devtools(
        immer(authStore),
        { name: 'Auth Store' }
    ),
);
