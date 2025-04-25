import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

interface ProfileOrdersState {
  orders: TOrder[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: ProfileOrdersState = {
  orders: [],
  status: 'idle',
  error: undefined
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsConnect: (s) => {
      s.status = 'loading';
      s.error = undefined;
    },
    wsDisconnect: (s) => {
      s.status = 'idle';
    },
    wsMessage: (s, a: PayloadAction<TOrder[]>) => {
      s.status = 'succeeded';
      s.orders = a.payload;
    },
    wsError: (s, a: PayloadAction<string>) => {
      s.status = 'failed';
      s.error = a.payload;
    }
  },
  extraReducers: (b) => {
    b.addCase(fetchProfileOrders.pending, (s) => {
      s.status = 'loading';
      s.error = undefined;
    })
      .addCase(fetchProfileOrders.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.orders = a.payload;
      })
      .addCase(fetchProfileOrders.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      });
  }
});

export const { wsConnect, wsDisconnect, wsMessage, wsError } = slice.actions;
export default slice.reducer;

export const selectProfileOrders = (s: RootState) => s.profileOrders.orders;
export const selectProfileOrdersStatus = (s: RootState) =>
  s.profileOrders.status;
export const selectProfileOrdersError = (s: RootState) => s.profileOrders.error;
