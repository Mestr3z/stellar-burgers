import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { orderBurgerApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';
import type { RootState } from '../store';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: (TIngredient & { uniqueId: string })[];
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
    addBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient: {
      prepare(ingredient: TIngredient) {
        return {
          payload: {
            ...ingredient,
            uniqueId: uuidv4()
          }
        };
      },
      reducer(
        state,
        action: PayloadAction<TIngredient & { uniqueId: string }>
      ) {
        state.ingredients.push(action.payload);
      }
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const [item] = state.ingredients.splice(action.payload.fromIndex, 1);
      state.ingredients.splice(action.payload.toIndex, 0, item);
    },
    removeIngredient(state, action: PayloadAction<number>) {
      state.ingredients.splice(action.payload, 1);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
      state.orderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderError = undefined;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload;
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

export const selectBun = (state: RootState) => state.burgerConstructor.bun;
export const selectConstructorIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;
export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const selectOrderData = (state: RootState) =>
  state.burgerConstructor.orderData;
