import profileOrdersReducer, {
  fetchProfileOrders,
  wsConnect,
  wsDisconnect,
  wsMessage,
  wsError
} from '../profileOrders';
import type { TOrder } from '../../../utils/types';

const fake: TOrder[] = [
  {
    _id: '1',
    status: 'created',
    name: 'O',
    createdAt: '',
    updatedAt: '',
    number: 2,
    ingredients: []
  }
];

describe('profileOrders slice', () => {
  const initial = profileOrdersReducer(undefined, { type: '' });

  it('fetchProfileOrders.pending - status "loading"', () => {
    const next = profileOrdersReducer(
      initial,
      fetchProfileOrders.pending('', undefined)
    );
    expect(next.status).toBe('loading');
  });

  it('fetchProfileOrders.fulfilled - записывает orders и status "succeeded"', () => {
    const next = profileOrdersReducer(
      initial,
      fetchProfileOrders.fulfilled(fake, '', undefined)
    );
    expect(next.status).toBe('succeeded');
    expect(next.orders).toBe(fake);
  });

  it('fetchProfileOrders.rejected - status "failed" и error из payload', () => {
    const action = {
      type: fetchProfileOrders.rejected.type,
      payload: 'Error load'
    } as any;
    const next = profileOrdersReducer(initial, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Error load');
  });

  it('wsConnect - status "loading"', () => {
    expect(profileOrdersReducer(initial, wsConnect()).status).toBe('loading');
  });

  it('wsMessage - записывает ws-данные и status "succeeded"', () => {
    const next = profileOrdersReducer(initial, wsMessage(fake));
    expect(next.status).toBe('succeeded');
    expect(next.orders).toBe(fake);
  });

  it('wsError - status "failed" и error из payload', () => {
    expect(profileOrdersReducer(initial, wsError('WS err')).status).toBe(
      'failed'
    );
    expect(profileOrdersReducer(initial, wsError('WS err')).error).toBe(
      'WS err'
    );
  });

  it('wsDisconnect - возвращает status в "idle"', () => {
    const prev = { ...initial, status: 'succeeded' as const };
    expect(profileOrdersReducer(prev, wsDisconnect()).status).toBe('idle');
  });
});
