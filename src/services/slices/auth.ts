import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import type { TRegisterData, TLoginData } from '@api';
import type { TUser } from '@utils-types';
import type { RootState } from '../store';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface AuthState {
  user: TUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: 'idle',
  error: undefined
};

function saveTokens(accessToken: string, refreshToken: string) {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export const registerUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TRegisterData,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(data);
    saveTokens(res.accessToken, res.refreshToken);
    return {
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken
    };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const loginUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TLoginData,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(data);
    saveTokens(res.accessToken, res.refreshToken);
    return {
      user: res.user,
      accessToken: res.accessToken,
      refreshToken: res.refreshToken
    };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (data, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(data);
    return res.user;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = undefined;
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken;
      })
      .addCase(registerUser.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      })

      .addCase(loginUser.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload.user;
        s.accessToken = a.payload.accessToken;
        s.refreshToken = a.payload.refreshToken;
      })
      .addCase(loginUser.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      })

      .addCase(fetchUser.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload;
      })
      .addCase(fetchUser.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      })

      .addCase(updateUser.pending, (s) => {
        s.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.user = a.payload;
      })
      .addCase(updateUser.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      })

      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.accessToken = null;
        s.refreshToken = null;
        s.status = 'idle';
      });
  }
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (s: RootState) => s.auth.user;
export const selectAuthStatus = (s: RootState) => s.auth.status;
export const selectAuthError = (s: RootState) => s.auth.error;
