import React, { FC, ReactElement } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from '../services/store';
import { selectIsAuthenticated, selectAuthStatus } from '../services/selectors';
import { Preloader } from '@ui';

interface IProtectedRouteProps {
  onlyGuest?: boolean;
  onlyAuth?: boolean;
  children: ReactElement;
}

export const ProtectedRoute: FC<IProtectedRouteProps> = ({
  onlyGuest = false,
  onlyAuth = false,
  children
}) => {
  const isAuth = useAppSelector(selectIsAuthenticated);
  const authStatus = useAppSelector(selectAuthStatus);
  const location = useLocation();

  if (authStatus === 'loading') {
    return <Preloader />;
  }

  if (onlyAuth && authStatus === 'idle') {
    return <Preloader />;
  }

  if (onlyGuest && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (onlyAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
};
