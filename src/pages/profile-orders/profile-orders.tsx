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
import { selectIsAuthenticated } from '../../services/selectors';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuthenticated);

  const orders = useAppSelector(selectProfileOrders) || [];
  const status = useAppSelector(selectProfileOrdersStatus);
  const error = useAppSelector(selectProfileOrdersError);

  useEffect(() => {
    if (!isAuth) {
      return;
    }
    dispatch(profileWsConnect());
    dispatch(fetchProfileOrders());

    return () => {
      dispatch(profileWsDisconnect());
    };
  }, [isAuth, dispatch]);

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
    (a: TOrder, b: TOrder) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <ProfileOrdersUI orders={sorted} />;
};
