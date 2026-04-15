import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, requiredRole }) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isLoggedIn = !!token;
    const hasRole = () => {
        if (!requiredRole) return true;
        if (requiredRole === 'admin') {
            return user.is_admin === true;
        }
        if (requiredRole === 'superadmin') {
            return user.tipo === 'superadmin';
        }
        if (requiredRole === 'moderador') {
            return user.tipo === 'moderador' || user.tipo === 'superadmin';
        }
        if (requiredRole === 'editor') {
            return user.tipo === 'editor' || user.tipo === 'moderador' || user.tipo === 'superadmin';
        }
        return false;
    };

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }
    if (!hasRole()) {
        return <Navigate to="/recursos" />;
    }
    return children;
}
export default PrivateRoute;