import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
  isAuthorized: boolean;
}

const PrivateRoute = ({ children, isAuthorized }: PrivateRouteProps) => isAuthorized ? children : <Navigate to="/login" />;

export default PrivateRoute;
