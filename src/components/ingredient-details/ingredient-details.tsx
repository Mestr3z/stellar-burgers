import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsStatus
} from '../../services/slices/ingredients';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const status = useAppSelector(selectIngredientsStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <Preloader />;
  }

  if (status === 'failed') {
    return <p>Не удалось загрузить данные ингредиентов.</p>;
  }

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <p>Ингредиент не найден.</p>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
