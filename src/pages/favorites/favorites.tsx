import { OfferList } from '../offer/components/offer-list.tsx';
import { OfferCardType } from '../../shared/constants/offer.ts';
import { RootState } from '../../hooks/use-store.ts';
import { Header } from '../../components/header.tsx';
import { useSelector } from 'react-redux';

export const Favorites = () => {
  const { city } = useSelector((state: RootState) => state.city);
  const { offerFavorites } = useSelector((state: RootState) => state.favorites);

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>

            <ul className="favorites__list">
              <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <a className="locations__item-link" href="#">
                      <span>{city.name}</span>
                    </a>
                  </div>
                </div>

                <OfferList offers={offerFavorites} offerCardType={OfferCardType.Favorites} />
              </li>

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
