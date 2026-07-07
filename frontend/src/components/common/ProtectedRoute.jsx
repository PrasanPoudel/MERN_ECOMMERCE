import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const { token } = useSelector((s) => s.auth);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { user, token } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  // Wait for profile to load before deciding — avoids redirect on page refresh
  if (!user) return null;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const { token, user } = useSelector((s) => s.auth);
  // Only redirect once we know who the user is (user loaded)
  // This prevents stale token from blocking /login before profile resolves
  if (token && user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  return <Outlet />;
}
