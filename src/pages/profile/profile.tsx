import React, {
  FC,
  SyntheticEvent,
  useEffect,
  useState,
  ChangeEvent
} from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchUser, updateUser } from '../../services/slices/auth';
import {
  selectUser,
  selectAuthStatus,
  selectAuthError
} from '../../services/selectors';
import { Preloader } from '@ui';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUser());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    formValue.password !== '';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const updated: Partial<typeof formValue> = {};
    if (formValue.name !== user?.name) updated.name = formValue.name;
    if (formValue.email !== user?.email) updated.email = formValue.email;
    if (formValue.password) updated.password = formValue.password;
    dispatch(updateUser(updated));
  };

  if (status === 'loading' && !user) {
    return <Preloader />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleInputChange={handleInputChange}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      updateUserError={error}
    />
  );
};
