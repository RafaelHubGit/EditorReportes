// src/hooks/useAuthActions.ts
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/useAuthStore';


export const useAuthActions = () => {
    const store = useAuthStore();

    const handleLogin = async (credentials: { email: string; password: string }) => {
        const result = await store.login(credentials);

        if (result.success) {
            if (result.code === 'NOT_VERIFIED') {
                await Swal.fire('Verificación', 'Usuario no verificado. Revise su correo.', 'warning');
            }
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: `Hola, ${result.message}`,
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            const errorMessages: Record<string, string> = {
                'INVALID_CREDENTIALS': 'Email o contraseña incorrectos.',
                'ACCOUNT_EXPIRED': 'Tu cuenta ha expirado.',
            };
            Swal.fire('Error', errorMessages[result.code!] || result.message, 'error');
        }
        return result.success;
    };

    const handleRegister = async (data: any) => {
        const result = await store.register(data);
        if (result.success) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Usuario registrado correctamente. Se envió un correo electrónico de verificación; si no lo encuentra en la bandeja de entrada, por favor búsquelo en la carpeta de spam.',
                icon: 'success',
                confirmButtonText: 'Entendido'
            });
        } else {
            const title = result.code === 'USER_EXISTS' ? '¡Ya estás registrado!' : 'Error';
            Swal.fire(title, result.message, result.code === 'USER_EXISTS' ? 'warning' : 'error');
        }
        return result.success;
    };

    const handleToggleStatus = async (id: string, currentActive: boolean) => {
        const actionText = currentActive ? 'desactivar' : 'activar';
        
        const confirm = await Swal.fire({
            title: `¿Estás seguro de ${actionText} al usuario?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            
            const result = await store.toggleStatus(id, currentActive);
            
            if (result.success) {
                Swal.fire({ icon: 'success', title: 'Estado actualizado', timer: 1500, showConfirmButton: false });
            } else {
                Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
            }
        }
    };

    const handleResetPassword = async (id: string) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro de resetear la contraseña?',
            text: "Se restablecerá a la configuración por defecto.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, resetear'
        });

        if (confirm.isConfirmed) {
            Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            
            const result = await store.resetPassword(id);
            
            if (result.success) {
                Swal.fire('¡Éxito!', 'Contraseña restablecida correctamente', 'success');
            } else {
                Swal.fire('Error', 'No se pudo realizar el reset', 'error');
            }
        }
    };

    return {
        handleLogin,
        handleRegister,
        handleToggleStatus,
        handleResetPassword,
        logout: store.logout,
        toggleStatus: store.toggleStatus
    };
};