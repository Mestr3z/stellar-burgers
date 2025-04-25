import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';
import type { RootState } from '../store';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TIngredient[];
  orderRequest: boolean;
  orderError?: string;
  orderData: TOrder | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderError: undefined,
  orderData: null
};

export const orderBurger = createAsyncThunk<
  TOrder,
  void,
  { rejectValue: string; state: RootState }
>('constructor/order', async (_, { getState, rejectWithValue }) => {
  const { bun, ingredients } = getState().burgerConstructor;
  const ids: string[] = [];
  if (bun) ids.push(bun._id, bun._id);
  ingredients.forEach((i) => ids.push(i._id));
  try {
    const res = await orderBurgerApi(ids);
    return res.order;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const slice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun(s, a: PayloadAction<TIngredient>) {
      s.bun = a.payload;
    },
    addIngredient(s, a: PayloadAction<TIngredient>) {
      s.ingredients.push(a.payload);
    },
    moveIngredient(
      s,
      a: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const [item] = s.ingredients.splice(a.payload.fromIndex, 1);
      s.ingredients.splice(a.payload.toIndex, 0, item);
    },
    removeIngredient(s, a: PayloadAction<number>) {
      s.ingredients.splice(a.payload, 1);
    },
    clearConstructor(s) {
      s.bun = null;
      s.ingredients = [];
      s.orderData = null; 
    }
  },
  extraReducers: (b) => {
    b.addCase(orderBurger.pending, (s) => {
      s.orderRequest = true;
      s.orderError = undefined;
    })
      .addCase(orderBurger.fulfilled, (s, a) => {
        s.orderRequest = false;
        s.orderData = a.payload;
        s.bun = null;
        s.ingredients = [];
      })
      .addCase(orderBurger.rejected, (s, a) => {
        s.orderRequest = false;
        s.orderError = a.payload;
      });
  }
});

export const {
  addBun,
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor
} = slice.actions;

export default slice.reducer;

export const selectBun = (s: RootState) => s.burgerConstructor.bun;
export const selectConstructorIngredients = (s: RootState) =>
  s.burgerConstructor.ingredients;
export const selectOrderRequest = (s: RootState) =>
  s.burgerConstructor.orderRequest;
export const selectOrderData = (s: RootState) => s.burgerConstructor.orderData;
