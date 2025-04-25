import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';

import ingredientsReducer from './slices/ingredients';
import authReducer from './slices/auth';
import feedReducer from './slices/feed';
import profileOrdersReducer from './slices/profileOrders';
import constructorReducer from './slices/constructor';
import { socketMiddleware } from './middleware/socketMiddleware';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  burgerConstructor: constructorReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) => gDM().concat(socketMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default store;
