import React, { useCallback, memo } from 'react';
import classNames from 'classnames';

import { useAppDispatch, useAppSelector } from '../hooks/use-store.ts';
import { setCity } from '../store/action.ts';
import {getCitiesData} from '../shared/utils/offer.ts';
import {OfferCity} from '../shared/types/offer.ts';

export const CitiesListComponent: React.FC = () => {
  const currentCity = useAppSelector((state) => state.city);
  const offers = useAppSelector((state) => state.offers);

  const cities = getCitiesData(offers);

  const dispatch = useAppDispatch();

  const handleCityChange = useCallback(
    (city: OfferCity) => {
      dispatch(setCity(city));
    },
    [dispatch]
  );

  return (
    <div className="tabs">
      <section className="locations container">
        <ul className="locations__list tabs__list">
          {cities.map((city) => (
            <li
              key={city.name}
              className="locations__item"
              onClick={() => handleCityChange(city)}
            >
              <a
                className={classNames('locations__item-link tabs__item', {
                  ['tabs__item--active']: city.name === currentCity.name
                })}
                href="#"
              >
                <span>{city.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export const CitiesList = memo(CitiesListComponent);
