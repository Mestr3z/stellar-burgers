import feedReducer, {
  fetchFeeds,
  wsConnect,
  wsDisconnect,
  wsMessage,
  wsError
} from '../feed';
import type { TOrder } from '../../../utils/types';

const fakeOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'X',
    createdAt: '',
    updatedAt: '',
    number: 1,
    ingredients: []
  }
];

describe('feed slice', () => {
  const initial = feedReducer(undefined, { type: '' });

  it('fetchFeeds.pending - status "loading", error сбрасывается', () => {
    const next = feedReducer(initial, fetchFeeds.pending('', undefined));
    expect(next.status).toBe('loading');
    expect(next.error).toBeUndefined();
  });

  it('fetchFeeds.fulfilled - записывает orders, total, totalToday, status "succeeded"', () => {
    const payload = { orders: fakeOrders, total: 5, totalToday: 2 };
    const next = feedReducer(
      initial,
      fetchFeeds.fulfilled(payload, '', undefined)
    );
    expect(next.status).toBe('succeeded');
    expect(next.orders).toBe(payload.orders);
    expect(next.total).toBe(5);
    expect(next.totalToday).toBe(2);
  });

  it('fetchFeeds.rejected - status "failed" и error из payload', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload: 'Fetch failed'
    } as any;
    const next = feedReducer(initial, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Fetch failed');
  });

  it('wsConnect - переводит status в "loading"', () => {
    const next = feedReducer(initial, wsConnect());
    expect(next.status).toBe('loading');
  });

  it('wsMessage - записывает ws-данные и status "succeeded"', () => {
    const msg = { orders: fakeOrders, total: 10, totalToday: 3 };
    const next = feedReducer(initial, wsMessage(msg));
    expect(next.status).toBe('succeeded');
    expect(next.orders).toBe(fakeOrders);
    expect(next.total).toBe(10);
    expect(next.totalToday).toBe(3);
  });

  it('wsError - status "failed" и error из payload', () => {
    const next = feedReducer(initial, wsError('WS error'));
    expect(next.status).toBe('failed');
    expect(next.error).toBe('WS error');
  });

  it('wsDisconnect - возвращает status в "idle"', () => {
    const next = feedReducer(
      { ...initial, status: 'succeeded' },
      wsDisconnect()
    );
    expect(next.status).toBe('idle');
  });
});
