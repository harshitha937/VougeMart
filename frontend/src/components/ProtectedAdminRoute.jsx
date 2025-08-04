import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedAdminRoute;
