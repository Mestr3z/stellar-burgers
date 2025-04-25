import React, { forwardRef, useMemo } from 'react';
import { useAppSelector } from '../../services/store';
import {
  selectBun,
  selectConstructorIngredients
} from '../../services/slices/constructor';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useAppSelector(selectBun);
  const constructorIngredients = useAppSelector(selectConstructorIngredients);

  const ingredientsCounters = useMemo(() => {
    const counters: Record<string, number> = {};
    constructorIngredients.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
    });
    if (bun) {
      counters[bun._id] = 2;
    }
    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
