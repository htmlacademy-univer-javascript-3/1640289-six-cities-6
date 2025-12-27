import {Navigate} from 'react-router-dom';
import {ReactNode} from 'react';

import {RoutePath} from '../shared/constants/router.ts';
import {useAppSelector} from '../hooks/use-store.ts';
import {AuthStatus} from '../shared/constants/auth.ts';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const authStatus = useAppSelector((state) => state.authorizationStatus);

  return authStatus === AuthStatus.Auth ? children : <Navigate to={RoutePath.Login} />;
};

export default PrivateRoute;
