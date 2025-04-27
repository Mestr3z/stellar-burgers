import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';

import {
  wsConnect as feedConnect,
  wsDisconnect as feedDisconnect,
  wsMessage as feedMessage,
  wsError as feedError
} from '../slices/feed';
import {
  wsConnect as profileConnect,
  wsDisconnect as profileDisconnect,
  wsMessage as profileMessage,
  wsError as profileError
} from '../slices/profileOrders';
import { getCookie } from '../../utils/cookie';

export const socketMiddleware: Middleware<{}, RootState> =
  (storeAPI) => (next) => (action: any) => {
    const { dispatch } = storeAPI;

    switch (action.type) {
      case feedConnect.type: {
        const socket = new WebSocket('wss://norma.nomoreparties.space/orders');
        socket.onerror = () => dispatch(feedError('WS error'));
        socket.onmessage = (e) => {
          try {
            const { orders, total, totalToday } = JSON.parse(e.data);
            dispatch(feedMessage({ orders, total, totalToday }));
          } catch {
            dispatch(feedError('error message'));
          }
        };
        socket.onclose = () => dispatch(feedDisconnect());
        break;
      }

      case profileConnect.type: {
        const token = getCookie('accessToken');
        const socket = new WebSocket(
          `wss://norma.nomoreparties.space/orders?token=${token}`
        );
        socket.onerror = () => dispatch(profileError('WS error'));
        socket.onmessage = (e) => {
          try {
            const { orders } = JSON.parse(e.data);
            dispatch(profileMessage(orders));
          } catch {
            dispatch(profileError('error message'));
          }
        };
        socket.onclose = () => dispatch(profileDisconnect());
        break;
      }

      default:
        break;
    }

    return next(action);
  };
