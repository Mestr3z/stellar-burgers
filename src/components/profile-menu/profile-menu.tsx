import React, { FC } from 'react';
import { useAppDispatch } from '../../services/store';
import { logout } from '../../services/slices/auth';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { clearAuth } from '../../services/slices/auth';

export const ProfileMenu: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      dispatch(clearAuth());
      navigate('/login', { replace: true });
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
