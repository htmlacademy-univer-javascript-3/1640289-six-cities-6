import { OfferList } from '../offer/components/offer-list.tsx';
import Map from '../../components/map.tsx';
import { getCoordinatesOffers } from '../../shared/utils/offer.ts';
import { OfferCardType } from '../../shared/constants/offer.ts';
import { RootState } from '../../hooks/use-store.ts';
import { CitiesList } from '../../components/city-list.tsx';
import { OffersSort } from '../offer/components/offer-sort.tsx';
import { Header } from '../../components/header.tsx';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const Main = () => {
  const { currentOfferId } = useSelector((state: RootState) => state.currentOffer);
  const { offers } = useSelector((state: RootState) => state.offers);
  const { city } = useSelector((state: RootState) => state.city);

  const mapPoints = useMemo(() => getCoordinatesOffers(offers, currentOfferId), [offers, currentOfferId]);
  const currentOffers = useMemo(() => offers.filter((offer) => offer.city.name === city.name), [city.name, offers]);

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

              <b className="places__found">{currentOffers.length} places to stay in {city.name}</b>

              <OffersSort />

              <OfferList offers={currentOffers} offerCardType={OfferCardType.Main} />

            </section>
            <div className="cities__right-section">
              <Map points={mapPoints} additionalClass={'cities__map'} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
