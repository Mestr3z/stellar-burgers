import React, { FC, useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsStatus
} from '../../services/slices/ingredients';
import { Preloader } from '../ui/preloader';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { TIngredient, TTabMode } from '@utils-types';

export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const status = useAppSelector(selectIngredientsStatus);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewMains] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchIngredients());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewMains) setCurrentTab('main');
    else if (inViewSauces) setCurrentTab('sauce');
  }, [inViewBuns, inViewMains, inViewSauces]);

  if (status === 'loading') return <Preloader />;
  if (status === 'failed') return <p>Ошибка загрузки ингредиентов</p>;

  const buns = ingredients.filter((i) => i.type === 'bun');
  const mains = ingredients.filter((i) => i.type === 'main');
  const sauces = ingredients.filter((i) => i.type === 'sauce');

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    const refMap = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    } as Record<TTabMode, React.RefObject<HTMLElement>>;
    refMap[tab as TTabMode].current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
