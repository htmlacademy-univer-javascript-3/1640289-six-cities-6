import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

import { RoutePath } from '../shared/constants/router.ts';

interface PrivateRouteProps {
  children: ReactNode;
  isAuthorized: boolean;
}

const PrivateRoute = ({ children, isAuthorized }: PrivateRouteProps) => isAuthorized ? children : <Navigate to={RoutePath.Login} />;

export default PrivateRoute;
