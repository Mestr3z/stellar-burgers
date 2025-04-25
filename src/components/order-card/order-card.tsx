import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients';
import { OrderCardProps } from './type';
import { OrderCardUI } from '../ui/order-card';
import { TIngredient } from '@utils-types';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useAppSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo: TIngredient[] = order.ingredients
      .map((id) => ingredients.find((i) => i._id === id))
      .filter((i): i is TIngredient => !!i);

    const total = ingredientsInfo.reduce((acc, i) => acc + i.price, 0);
    const toShow = ingredientsInfo.slice(0, maxIngredients);
    const remains = Math.max(0, ingredientsInfo.length - maxIngredients);
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow: toShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
