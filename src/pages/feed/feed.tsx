import React, { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeedOrders,
  selectFeedStatus,
  selectFeedError,
  wsConnect,
  wsDisconnect
} from '../../services/slices/feed';
import { TOrder } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeedOrders);
  const status = useAppSelector(selectFeedStatus);
  const error = useAppSelector(selectFeedError);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFeeds());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(wsConnect());
    return () => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  if (status === 'loading') return <Preloader />;
  if (status === 'failed') return <p>Ошибка загрузки ленты: {error}</p>;

  return (
    <FeedUI
      orders={orders as TOrder[]}
      handleGetFeeds={() => dispatch(fetchFeeds())}
    />
  );
};
