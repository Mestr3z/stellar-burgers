import { FC, ReactElement } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../services/selectors';

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
  const isAuth = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (onlyGuest && isAuth) {
    return <Navigate to='/' replace />;
  }

  if (onlyAuth && !isAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children;
};
