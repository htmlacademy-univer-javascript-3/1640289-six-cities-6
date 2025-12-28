import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

import { RoutePath } from '../shared/constants/router.ts';
import { RootState } from '../hooks/use-store.ts';
import { AuthStatus } from '../shared/constants/auth.ts';
import { useSelector } from 'react-redux';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { authorizationStatus } = useSelector((state: RootState) => state.auth);

  return authorizationStatus === AuthStatus.Auth ? children : <Navigate to={RoutePath.Login} />;
};

export default PrivateRoute;
