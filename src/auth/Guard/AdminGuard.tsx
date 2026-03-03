
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';


interface AdminGuardProps {
    children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
    const canAdmin = useAuthStore(state => state.canAdminister());

    // Si NO es admin O el modo NO es saas -> Bloqueo total
    if (!canAdmin) {
        console.warn("Acceso denegado: Se requiere ser Admin y estar en modo SaaS");
        return <Navigate to="/app/documents" replace />;
    }

    // Si llegó aquí, es porque ambas son true
    return <>{children}</>;
};