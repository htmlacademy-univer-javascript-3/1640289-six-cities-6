import { OfferList } from '../offer/components/offer-list.tsx';
import { OfferCardType } from '../../shared/constants/offer.ts';
import { RootState, useAppDispatch } from '../../hooks/use-store.ts';
import { Header } from '../../components/header.tsx';
import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { MainOfferInfo, OfferCity } from '../../shared/types/offer.ts';
import { setCity } from '../../store/slices/city.ts';
import { Link } from 'react-router-dom';
import { RoutePath } from '../../shared/constants/router.ts';
import { FavoriteEmpty } from './components/favorite-empty.tsx';

export const Favorites = () => {
  const { offerFavorites } = useSelector((state: RootState) => state.favorites);

  const dispatch = useAppDispatch();

  const favoritesByCity = useMemo(() => {
    const grouped: Record<string, { city: OfferCity; offers: MainOfferInfo[] }> = {};

    offerFavorites.forEach((offer) => {
      const cityName = offer.city.name;

      if (!grouped[cityName]) {
        grouped[cityName] = {
          city: offer.city,
          offers: [],
        };
      }

      grouped[cityName].offers.push(offer);
    });

    return Object.values(grouped).sort((a, b) => a.city.name.localeCompare(b.city.name));
  }, [offerFavorites]);

  const handleCityClick = useCallback(
    (currentCity: OfferCity) => {
      dispatch(setCity(currentCity));
    },
    [dispatch]
  );

  if (offerFavorites.length === 0) {
    return <FavoriteEmpty />;
  }

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>

            <ul className="favorites__list">
              {favoritesByCity.map(({ city, offers }) => (
                <li key={city.name} className="favorites__locations-items">
                  <div className="favorites__locations locations locations--current">
                    <div className="locations__item">
                      <Link
                        className="locations__item-link"
                        to={RoutePath.Main}
                        onClick={() => handleCityClick(city)}
                      >
                        <span>{city.name}</span>
                      </Link>
                    </div>
                  </div>

                  <OfferList offers={offers} offerCardType={OfferCardType.Favorites} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="footer container">
        <a className="footer__logo-link" href="main.html">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </a>
      </footer>
    </div>
  );
};
