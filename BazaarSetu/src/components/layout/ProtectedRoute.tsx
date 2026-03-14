import { Navigate } from 'react-router-dom';
import type { UserRole } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface Props {
  children: React.ReactNode;
  role?: UserRole;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { isAuthenticated, currentUser } = useAuthStore();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
