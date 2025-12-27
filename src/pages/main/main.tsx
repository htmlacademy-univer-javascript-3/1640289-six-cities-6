import { OfferList } from '../offer/components/offer-list.tsx';
import Map from '../../components/map.tsx';
import { getCoordinatesOffers } from '../../shared/utils/offer.ts';
import { OfferCardType } from '../../shared/constants/offer.ts';
import { useAppSelector } from '../../hooks/use-store.ts';
import { CitiesList } from '../../components/city-list.tsx';
import { OffersSort } from '../offer/components/offer-sort.tsx';
import {Header} from '../../components/header.tsx';
import {useMemo} from 'react';

export const Main = () => {
  const currentCity = useAppSelector((state) => state.city);
  const offers = useAppSelector((state) => state.offers);
  const currentOfferId = useAppSelector((state) => state.currentOfferId);

  const currentOffers = useMemo(() => offers.filter((offer) => offer.city.name === currentCity.name), [currentCity.name, offers]);
  const offersCount = currentOffers.length;

  return (
    <div className="page page--gray page--main">
      <Header />

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
