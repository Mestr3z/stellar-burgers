import authReducer, {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  logout,
  clearAuth
} from '../auth';
import type { TUser } from '../../../utils/types';

const dummyUser: TUser = { email: 'a@b.com', name: 'Tester' };

describe('auth slice', () => {
  let initial = authReducer(undefined, { type: '' });

  beforeEach(() => {
    initial = authReducer(undefined, { type: '' });
  });

  it('инициализируется корректно', () => {
    expect(initial).toEqual({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'idle',
      error: undefined
    });
  });

  it('registerUser.pending - status "loading", error сбрасывается', () => {
    const next = authReducer(
      initial,
      registerUser.pending('', { name: '', email: '', password: '' })
    );
    expect(next.status).toBe('loading');
    expect(next.error).toBeUndefined();
  });

  it('registerUser.fulfilled - сохраняет user и токены, статус "succeeded"', () => {
    const payload = {
      user: dummyUser,
      accessToken: 'atoken',
      refreshToken: 'rtoken'
    };
    const next = authReducer(
      initial,
      registerUser.fulfilled(payload, '', {
        name: '',
        email: '',
        password: ''
      })
    );
    expect(next.status).toBe('succeeded');
    expect(next.user).toEqual(dummyUser);
    expect(next.accessToken).toBe('atoken');
    expect(next.refreshToken).toBe('rtoken');
  });

  it('registerUser.rejected - status "failed" и error из payload', () => {
    const action = {
      type: registerUser.rejected.type,
      payload: 'Registration failed'
    } as any;
    const next = authReducer(initial, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Registration failed');
  });

  it('loginUser.pending - status "loading"', () => {
    const next = authReducer(
      initial,
      loginUser.pending('', { email: '', password: '' })
    );
    expect(next.status).toBe('loading');
  });

  it('loginUser.fulfilled - сохраняет user и токены, status "succeeded"', () => {
    const payload = {
      user: dummyUser,
      accessToken: 'latoken',
      refreshToken: 'lrtoken'
    };
    const next = authReducer(
      initial,
      loginUser.fulfilled(payload, '', { email: '', password: '' })
    );
    expect(next.status).toBe('succeeded');
    expect(next.user).toEqual(dummyUser);
    expect(next.accessToken).toBe('latoken');
    expect(next.refreshToken).toBe('lrtoken');
  });

  it('loginUser.rejected - status "failed" и error из payload', () => {
    const action = {
      type: loginUser.rejected.type,
      payload: 'Login failed'
    } as any;
    const next = authReducer(initial, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Login failed');
  });

  it('fetchUser.pending - status "loading"', () => {
    const next = authReducer(initial, fetchUser.pending('', undefined));
    expect(next.status).toBe('loading');
  });

  it('fetchUser.fulfilled - сохраняет user, status "succeeded"', () => {
    const next = authReducer(
      initial,
      fetchUser.fulfilled(dummyUser, '', undefined)
    );
    expect(next.status).toBe('succeeded');
    expect(next.user).toEqual(dummyUser);
  });

  it('fetchUser.rejected - status "failed" и error из payload', () => {
    const action = {
      type: fetchUser.rejected.type,
      payload: 'Fetch user failed'
    } as any;
    const next = authReducer(initial, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Fetch user failed');
  });

  it('updateUser.pending - status "loading"', () => {
    const next = authReducer(initial, updateUser.pending('', { name: '' }));
    expect(next.status).toBe('loading');
  });

  it('updateUser.fulfilled - сохраняет user, status "succeeded"', () => {
    const updated: TUser = { email: 'x@y.com', name: 'X' };
    const next = authReducer(initial, updateUser.fulfilled(updated, '', {}));
    expect(next.status).toBe('succeeded');
    expect(next.user).toEqual(updated);
  });

  it('updateUser.rejected - status "failed" и error из payload', () => {
    const action = {
      type: updateUser.rejected.type,
      payload: 'Update failed'
    } as any;
    const next = authReducer(initial, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Update failed');
  });

  it('logout.fulfilled - очищает user и токены, статус сбрасывается в "idle"', () => {
    const pre = {
      ...initial,
      user: dummyUser,
      accessToken: 'a',
      refreshToken: 'r',
      status: 'succeeded' as const
    };
    const next = authReducer(pre, logout.fulfilled(undefined, '', undefined));
    expect(next).toEqual({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'idle',
      error: undefined
    });
  });

  it('clearAuth очищает всё сразу', () => {
    const pre = {
      user: dummyUser,
      accessToken: 'x',
      refreshToken: 'y',
      status: 'succeeded' as const,
      error: 'err'
    };
    const next = authReducer(pre, clearAuth());
    expect(next).toEqual(initial);
  });
});
