import React, { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersStatus,
  selectProfileOrdersError,
  wsConnect as profileWsConnect,
  wsDisconnect as profileWsDisconnect
} from '../../services/slices/profileOrders';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(profileWsConnect());
    return () => {
      dispatch(profileWsDisconnect());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  const orders = useAppSelector(selectProfileOrders) || [];
  const status = useAppSelector(selectProfileOrdersStatus);
  const error = useAppSelector(selectProfileOrdersError);

  if (status === 'loading') {
    return <Preloader />;
  }
  if (status === 'failed') {
    return (
      <p className='text text_type_main-default'>
        Ошибка загрузки истории заказов: {error}
      </p>
    );
  }

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <ProfileOrdersUI orders={sorted} />;
};
