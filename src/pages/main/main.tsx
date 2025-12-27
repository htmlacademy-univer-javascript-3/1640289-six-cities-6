import { OfferList } from '../offer/components/offer-list.tsx';
import Map from '../../components/map.tsx';
import { getCoordinatesOffers } from '../../shared/utils/offer.ts';
import { OfferCardType } from '../../shared/constants/offer.ts';
import { useAppSelector } from '../../hooks/use-store.ts';
import { CitiesList } from '../../components/city-list.tsx';
import { OffersSort } from '../offer/components/offer-sort.tsx';

export const Main = () => {
  const currentCity = useAppSelector((state) => state.city);
  const offers = useAppSelector((state) => state.offers);
  const currentOfferId = useAppSelector((state) => state.currentOfferId);

  const currentOffers = offers.filter((offer) => offer.city.name === currentCity.name);
  const offersCount = currentOffers.length;

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </a>
            </div>

            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </a>
                </li>

                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>

        <CitiesList />

        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>

              <b className="places__found">{offersCount} places to stay in {currentCity.name}</b>

              <OffersSort />

              <OfferList offerCardType={OfferCardType.Main} />

            </section>
            <div className="cities__right-section">
              <Map points={getCoordinatesOffers(offers, currentOfferId)} additionalClass={'cities__map'} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
