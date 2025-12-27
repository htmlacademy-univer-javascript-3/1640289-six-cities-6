import React, { useState } from 'react';
import classNames from 'classnames';

import { setOffersSort } from '../../../store/action';

import styles from '../styles/offer-sort.module.css';
import { useAppDispatch, useAppSelector } from '../../../hooks/use-store.ts';
import { OffersSortType } from '../../../shared/constants/offer.ts';

export const OffersSort: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();

  const currentOffersSortType = useAppSelector((state) => state.offersSort);

  const handleIsOpenChange = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleSortItemClick = (newSOffersSortType: OffersSortType) => {
    dispatch(setOffersSort(newSOffersSortType));

    setIsOpen(false);
  };

  const sortTypes = Object.values(OffersSortType);

  return (
    <form className="places__sorting" action="#" method="get">
      <span className={classNames('places__sorting-caption', styles['caption'])}>Sort by</span>

      <span className="places__sorting-type" tabIndex={0} onClick={handleIsOpenChange}>
        <span>Popular</span>
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>

      <ul className={classNames('places__options places__options--custom', {
        ['places__options--opened']: isOpen
      })}
      >
        {sortTypes.map((sortType) => (
          <li
            key={sortType}
            className={classNames('places__option', styles.option, {
              [styles.option_active]: sortType === currentOffersSortType
            })}
            tabIndex={0}
            onClick={() => handleSortItemClick(sortType)}
          >
            {sortType}
          </li>
        ))}
      </ul>
    </form>
  );
};
