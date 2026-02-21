import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute() {
    const { user, role, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Navigate to="/" replace />;
    if (role !== 'admin') return <Navigate to="/" replace />;

    return <Outlet />;
}
