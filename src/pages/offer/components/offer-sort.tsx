import React, {useCallback, useState} from 'react';
import classNames from 'classnames';

import styles from '../styles/offer-sort.module.css';
import { RootState, useAppDispatch } from '../../../hooks/use-store.ts';
import { OffersSortType, SORT_TYPES } from '../../../shared/constants/offer.ts';
import { setOffersSort } from '../../../store/slices/offer.ts';
import { useSelector } from 'react-redux';

export const OffersSort: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { offersSort } = useSelector((state: RootState) => state.offers);

  const handleIsOpenChange = useCallback(() => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  }, []);

  const handleSortItemClick = useCallback(
    (newOffersSortType: OffersSortType) => {
      dispatch(setOffersSort(newOffersSortType));
      setIsOpen(false);
    },
    [dispatch]
  );

  return (
    <form className="places__sorting" action="#" method="get">
      <span className={classNames('places__sorting-caption', styles['caption'])}>Sort by</span>

      <span className="places__sorting-type" tabIndex={0} onClick={handleIsOpenChange}>
        <span>{offersSort}</span>
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>

      <ul className={classNames('places__options places__options--custom', {
        ['places__options--opened']: isOpen
      })}
      >
        {SORT_TYPES.map((sortType) => (
          <li
            key={sortType}
            className={classNames('places__option', styles.option, {
              [styles.option_active]: sortType === offersSort
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
