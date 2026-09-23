import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects to login if not authenticated, or to / if wrong role
const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default RoleRoute;
