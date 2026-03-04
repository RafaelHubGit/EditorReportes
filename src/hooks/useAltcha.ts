// hooks/useAltcha.ts
import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

interface UseAltchaReturn {
  altchaPayload: string | null;
  resetAltcha: boolean;
  setResetAltcha: (reset: boolean) => void;
  handleAltchaVerify: (payload: string | null) => void;
  validateAltcha: (showAlert?: boolean) => boolean;
  resetAltchaComponent: () => void;
}

export const useAltcha = (): UseAltchaReturn => {
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null);
  const [resetAltcha, setResetAltcha] = useState(false);

  const handleAltchaVerify = useCallback((payload: string | null) => {
    setAltchaPayload(payload);
  }, []);

  const validateAltcha = useCallback((showAlert: boolean = true): boolean => {
    if (!altchaPayload) {
      if (showAlert) {
        Swal.fire({
            icon: 'warning',
            title: 'Verificación requerida',
            text: 'Por favor, completa la verificación de seguridad.', // AQUÍ CAMBIAS EL TEXTO
            timer: 3000,
            showConfirmButton: false,
            toast: true, // Opcional: para que sea menos invasivo
            position: 'top-end'
        });
      }
      return false;
    }
    return true;
  }, [altchaPayload]);

  const resetAltchaComponent = useCallback(() => {
    setResetAltcha(true);
    setAltchaPayload(null);
    // Resetear el flag después de un breve delay
    setTimeout(() => setResetAltcha(false), 100);
  }, []);

  return {
    altchaPayload,
    resetAltcha,
    setResetAltcha,
    handleAltchaVerify,
    validateAltcha,
    resetAltchaComponent
  };
};