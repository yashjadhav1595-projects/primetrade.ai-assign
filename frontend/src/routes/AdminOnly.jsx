import ProtectedRoute from './ProtectedRoute.jsx';

export default function AdminOnly({ children }) {
  return <ProtectedRoute role="admin">{children}</ProtectedRoute>;
}


