import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { OfferHost } from './components/offer-host.tsx';
import { OfferGallery } from './components/offer-gallery.tsx';
import { OfferInfo } from './components/offer-info.tsx';
import { OfferReviewForm } from './components/offer-review-form.tsx';
import { OfferList } from './components/offer-list.tsx';
import { OfferReviewList } from './components/offer-review-list.tsx';
import Map from '../../components/map.tsx';
import { getCoordinatesOffers } from '../../shared/utils/offer.ts';
import {NEAR_OFFERS_LIST_LENGTH, OfferCardType} from '../../shared/constants/offer.ts';
import {useAppDispatch, useAppSelector} from '../../hooks/use-store.ts';
import {Header} from '../../components/header.tsx';
import {fetchCurrentOffer} from '../../store/actions/offer-action.ts';
import Spinner from '../../components/spinner/spinner.tsx';
import {AuthStatus} from '../../shared/constants/auth.ts';

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
    window.scrollTo(0,0);
  }, [id]);

  const authStatus = useAppSelector((state) => state.authorizationStatus);

  const isCurrentOfferLoading = useAppSelector((state) => state.currentOfferLoading);

  const currentOfferData = useAppSelector((state) => state.currentOffer);
  const currentOfferFeedbacks = useAppSelector((state) => state.currentOfferFeedbacks);
  const currentOfferNearby = useAppSelector((state) => state.currentOfferNearby);

  const nearbyOffersData = currentOfferNearby.slice(0, NEAR_OFFERS_LIST_LENGTH);

  console.log(currentOfferData);
  console.log(isCurrentOfferLoading);

  if (!currentOfferData || isCurrentOfferLoading) {
    return <Spinner />;
  }

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <OfferGallery images={currentOfferData.images} />

          <div className="offer__container container">
            <div className="offer__wrapper">
              <OfferInfo offerData={currentOfferData} />
              <OfferHost hostData={currentOfferData.host} />

              <section className="offer__reviews reviews">
                <h2 className="reviews__title">
                  Reviews &middot; <span className="reviews__amount">{currentOfferFeedbacks.length}</span>
                </h2>

                <OfferReviewList reviews={currentOfferFeedbacks} />

                {authStatus === AuthStatus.Auth && <OfferReviewForm offerId={id} />}
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
