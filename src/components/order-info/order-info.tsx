import { FC, useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  selectIngredients,
  fetchIngredients
} from '../../services/slices/ingredients';
import { getOrderByNumberApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [ingredients.length, dispatch]);

  useEffect(() => {
    setLoading(true);
    getOrderByNumberApi(Number(number))
      .then((res) => {
        setOrderData(res.orders[0]);
      })
      .finally(() => setLoading(false));
  }, [number]);

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) return null;

    const date = new Date(orderData.createdAt);
    type CountMap = { [key: string]: TIngredient & { count: number } };
    const map: CountMap = {};

    orderData.ingredients.forEach((id) => {
      const ing = ingredients.find((i) => i._id === id);
      if (ing) {
        map[id] = map[id]
          ? { ...map[id], count: map[id].count + 1 }
          : { ...ing, count: 1 };
      }
    });

    const total = Object.values(map).reduce(
      (acc, i) => acc + i.price * i.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo: map,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
