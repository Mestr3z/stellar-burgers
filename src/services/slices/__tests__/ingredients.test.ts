import ingredientsReducer, { fetchIngredients } from '../ingredients';
import type { TIngredient } from '../../../utils/types';

describe('ingredients slice', () => {
  const initialState = {
    items: [] as TIngredient[],
    status: 'idle' as const,
    error: undefined as string | undefined
  };

  it('pending - status=loading, error сбрасывается', () => {
    const next = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );
    expect(next.status).toBe('loading');
    expect(next.error).toBeUndefined();
  });

  it('fulfilled - записывает данные и переводит в succeeded', () => {
    const payload: TIngredient[] = [
      {
        _id: '1',
        name: 'Ing',
        type: 'main',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 1,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];
    const next = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(payload, '', undefined)
    );
    expect(next.status).toBe('succeeded');
    expect(next.items).toBe(payload);
  });

  it('rejected - записывает error и переводит в failed', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Err'
    } as any;
    const next = ingredientsReducer(initialState, action);
    expect(next.status).toBe('failed');
    expect(next.error).toBe('Err');
  });
});
