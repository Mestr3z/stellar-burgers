import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  orderBurger
} from '../constructor';
import type { TIngredient, TOrder } from '../../../utils/types';

const dummyIngredient: TIngredient = {
  _id: 'id1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 10,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('constructor slice', () => {
  let initialState = constructorReducer(undefined, { type: '' });

  beforeEach(() => {
    initialState = constructorReducer(undefined, { type: '' });
  });

  it('при неизвестном экшене инициализируется корректно', () => {
    expect(initialState.bun).toBeNull();
    expect(initialState.ingredients).toEqual([]);
    expect(initialState.orderRequest).toBe(false);
    expect(initialState.orderData).toBeNull();
  });

  it('addBun устанавливает bun', () => {
    const next = constructorReducer(initialState, addBun(dummyIngredient));
    expect(next.bun).toEqual(dummyIngredient);
  });

  it('addIngredient добавляет элемент с uniqueId', () => {
    const next = constructorReducer(
      initialState,
      addIngredient(dummyIngredient)
    );
    expect(next.ingredients).toHaveLength(1);
    expect(next.ingredients[0]._id).toBe(dummyIngredient._id);
    expect(typeof next.ingredients[0].uniqueId).toBe('string');
  });

  it('removeIngredient убирает по индексу', () => {
    const stateWithTwo = {
      ...initialState,
      ingredients: [
        { ...dummyIngredient, uniqueId: 'u1' },
        { ...dummyIngredient, uniqueId: 'u2' }
      ]
    };
    const next = constructorReducer(stateWithTwo, removeIngredient(0));
    expect(next.ingredients).toHaveLength(1);
    expect(next.ingredients[0].uniqueId).toBe('u2');
  });

  it('moveIngredient переставляет элементы массива', () => {
    const a = { ...dummyIngredient, uniqueId: 'a' };
    const b = { ...dummyIngredient, uniqueId: 'b' };
    const c = { ...dummyIngredient, uniqueId: 'c' };
    const state = { ...initialState, ingredients: [a, b, c] };
    const next = constructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );
    expect(next.ingredients.map((i) => i.uniqueId)).toEqual(['b', 'c', 'a']);
  });

  it('clearConstructor очищает bun, ingredients и orderData', () => {
    const prev = {
      ...initialState,
      bun: dummyIngredient,
      ingredients: [{ ...dummyIngredient, uniqueId: 'x' }],
      orderData: {
        _id: 'o1',
        name: '',
        status: '',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: []
      }
    };
    const next = constructorReducer(prev, clearConstructor());
    expect(next.bun).toBeNull();
    expect(next.ingredients).toHaveLength(0);
    expect(next.orderData).toBeNull();
  });

  describe('thunk orderBurger', () => {
    const fakeOrder: TOrder = {
      _id: 'order1',
      name: 'Order',
      status: 'done',
      createdAt: '',
      updatedAt: '',
      number: 42,
      ingredients: []
    };

    it('pending - orderRequest=true, orderError undefined', () => {
      const next = constructorReducer(
        initialState,
        orderBurger.pending('', undefined)
      );
      expect(next.orderRequest).toBe(true);
      expect(next.orderError).toBeUndefined();
    });

    it('fulfilled - записывает orderData, очищает конструктор и сбрасывает orderRequest', () => {
      const prev = {
        ...initialState,
        bun: dummyIngredient,
        ingredients: [{ ...dummyIngredient, uniqueId: 'u' }],
        orderRequest: true
      };
      const next = constructorReducer(
        prev,
        orderBurger.fulfilled(fakeOrder, '', undefined)
      );
      expect(next.orderRequest).toBe(false);
      expect(next.orderData).toEqual(fakeOrder);
      expect(next.bun).toBeNull();
      expect(next.ingredients).toHaveLength(0);
    });

    it('rejected - записывает orderError и сбрасывает orderRequest', () => {
      const action = {
        type: orderBurger.rejected.type,
        payload: 'Fail'
      } as any;
      const next = constructorReducer(initialState, action);
      expect(next.orderRequest).toBe(false);
      expect(next.orderError).toBe('Fail');
    });
  });
});
