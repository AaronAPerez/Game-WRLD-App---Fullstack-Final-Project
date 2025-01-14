import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, Outlet } from 'react-router-dom';


export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};