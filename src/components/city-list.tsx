import React, { useCallback, memo } from 'react';
import classNames from 'classnames';

import { City, cityMocks } from '../mocks/city.ts';
import { useAppDispatch, useAppSelector } from '../hooks/use-store.ts';
import { setCity } from '../store/action.ts';

export const CitiesListComponent: React.FC = () => {
  const currentCity = useAppSelector((state) => state.city);

  const cities = Object.values(cityMocks);

  const dispatch = useAppDispatch();

  const handleCityChange = useCallback(
    (city: City) => {
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
              key={city.id}
              className="locations__item"
              onClick={() => handleCityChange(city.title)}
            >
              <a
                className={classNames('locations__item-link tabs__item', {
                  ['tabs__item--active']: city.title === currentCity
                })}
                href="#"
              >
                <span>{city.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export const CitiesList = memo(CitiesListComponent);
