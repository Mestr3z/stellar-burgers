import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle',
  error: undefined
};

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/fetch', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnect: (s) => {
      s.status = 'loading';
      s.error = undefined;
    },
    wsDisconnect: (s) => {
      s.status = 'idle';
    },
    wsMessage: (
      s,
      a: PayloadAction<{ orders: TOrder[]; total: number; totalToday: number }>
    ) => {
      s.status = 'succeeded';
      s.orders = a.payload.orders;
      s.total = a.payload.total;
      s.totalToday = a.payload.totalToday;
    },
    wsError: (s, a: PayloadAction<string>) => {
      s.status = 'failed';
      s.error = a.payload;
    }
  },
  extraReducers: (b) => {
    b.addCase(fetchFeeds.pending, (s) => {
      s.status = 'loading';
      s.error = undefined;
    })
      .addCase(fetchFeeds.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.orders = a.payload.orders;
        s.total = a.payload.total;
        s.totalToday = a.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload;
      });
  }
});

export const { wsConnect, wsDisconnect, wsMessage, wsError } = slice.actions;
export default slice.reducer;

export const selectFeedOrders = (s: RootState) => s.feed.orders;
export const selectFeedStatus = (s: RootState) => s.feed.status;
export const selectFeedError = (s: RootState) => s.feed.error;

export const selectFeedTotal = (s: RootState) => s.feed.total;
export const selectFeedTotalToday = (s: RootState) => s.feed.totalToday;
