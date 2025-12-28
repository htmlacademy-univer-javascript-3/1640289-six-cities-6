import React, { useCallback, memo, useMemo } from 'react';
import classNames from 'classnames';

import { RootState, useAppDispatch } from '../hooks/use-store.ts';
import { getCitiesData } from '../shared/utils/offer.ts';
import { OfferCity } from '../shared/types/offer.ts';
import { setCity } from '../store/slices/city.ts';
import { useSelector } from 'react-redux';

export const CitiesListComponent: React.FC = () => {
  const { city } = useSelector((state: RootState) => state.city);
  const { offers } = useSelector((state: RootState) => state.offers);

  const cities = useMemo(() => getCitiesData(offers), [offers]);

  const dispatch = useAppDispatch();

  const handleCityChange = useCallback(
    (setCurrentCity: OfferCity) => {
      dispatch(setCity(setCurrentCity));
    },
    [dispatch]
  );

  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((cityItem) => (
            <li
              key={cityItem.name}
              className="locations__item"
              onClick={() => handleCityChange(cityItem)}
            >
              <a
                className={classNames('locations__item-link tabs__item', {
                  ['tabs__item--active']: cityItem.name === city.name
                })}
                href="#"
              >
                <span>{cityItem.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export const CitiesList = memo(CitiesListComponent);
