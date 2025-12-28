import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { OfferHost } from './components/offer-host.tsx';
import { OfferGallery } from './components/offer-gallery.tsx';
import { OfferInfo } from './components/offer-info.tsx';
import { OfferReviewForm } from './components/offer-review-form.tsx';
import { OfferList } from './components/offer-list.tsx';
import { OfferReviewList } from './components/offer-review-list.tsx';
import Map from '../../components/map.tsx';
import { getCoordinatesOffers } from '../../shared/utils/offer.ts';
import { NEAR_OFFERS_LIST_LENGTH, OfferCardType } from '../../shared/constants/offer.ts';
import { RootState, useAppDispatch } from '../../hooks/use-store.ts';
import { Header } from '../../components/header.tsx';
import Spinner from '../../components/spinner/spinner.tsx';
import { AuthStatus } from '../../shared/constants/auth.ts';
import { fetchCurrentOffer } from '../../store/actions/offer.ts';
import { useSelector } from 'react-redux';

export const Offer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchCurrentOffer({ offerId: id, navigate }));
    }
  }, [dispatch, id, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { authorizationStatus } = useSelector((state: RootState) => state.auth);
  const { currentOffer, currentOfferLoading, currentOfferNearby, currentOfferFeedbacks } = useSelector((state: RootState) => state.currentOffer);


  const nearbyOffersData = useMemo(() => currentOfferNearby.slice(0, NEAR_OFFERS_LIST_LENGTH), [currentOfferNearby]);

  if (!currentOffer || currentOfferLoading) {
    return <Spinner />;
  }

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <OfferGallery images={currentOffer.images} />

          <div className="offer__container container">
            <div className="offer__wrapper">
              <OfferInfo offerData={currentOffer} />
              <OfferHost hostData={currentOffer.host} description={currentOffer.description} />

              <section className="offer__reviews reviews">
                <h2 className="reviews__title">
                  Reviews &middot; <span className="reviews__amount">{currentOfferFeedbacks.length}</span>
                </h2>

                <OfferReviewList reviews={currentOfferFeedbacks} />

                {authorizationStatus === AuthStatus.Auth && <OfferReviewForm offerId={id} />}
              </section>
            </div>
          </div>

          <Map points={getCoordinatesOffers(nearbyOffersData, id)} additionalClass={'offer__map'} />
        </section>

        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>

            <OfferList
              offers={nearbyOffersData}
              offerCardType={OfferCardType.Offer}
            />
          </section>
        </div>
      </main>
    </div>
  );
};
