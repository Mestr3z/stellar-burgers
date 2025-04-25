import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import type { RootState } from '../store';

interface IngredientsState {
  items: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: IngredientsState = {
  items: [],
  status: 'idle',
  error: undefined
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    const items = await getIngredientsApi();
    return items;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

export default ingredientsSlice.reducer;

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsStatus = (state: RootState) =>
  state.ingredients.status;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
