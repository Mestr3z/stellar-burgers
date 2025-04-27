import React, { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { registerUser } from '../../services/slices/auth';
import { selectAuthStatus, selectAuthError } from '../../services/selectors';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      navigate('/', { replace: true });
    }
  }, [status, navigate]);

  if (status === 'loading') {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
