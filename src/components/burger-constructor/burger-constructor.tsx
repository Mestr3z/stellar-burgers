import React, { FC, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  orderBurger,
  clearConstructor,
  selectBun,
  selectConstructorIngredients,
  selectOrderRequest,
  selectOrderData
} from '../../services/slices/constructor';
import { selectIsAuthenticated } from '../../services/selectors';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import { TIngredient, TOrder } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuth = useAppSelector(selectIsAuthenticated);
  const bun = useAppSelector(selectBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const orderRequest = useAppSelector(selectOrderRequest);
  const orderData = useAppSelector(selectOrderData);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingPrice = ingredients.reduce((sum, ing) => sum + ing.price, 0);
    return bunPrice + ingPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }
    dispatch(orderBurger());
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  return (
    <BurgerConstructorUI
      constructorItems={{ bun, ingredients }}
      orderRequest={orderRequest}
      price={price}
      orderModalData={orderData as TOrder | null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
