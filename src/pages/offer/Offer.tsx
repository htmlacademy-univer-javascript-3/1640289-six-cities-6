import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { IDetailedOffer, OfferCardType } from '../../shared/types/offer.ts';

import { RoutePath } from '../../shared/constants/router.ts';
import { NEAR_OFFERS_LIST_LENGTH } from '../../shared/constants/offer.ts';

import { OfferHost } from './components/OfferHost.tsx';
import { OfferGallery } from './components/OfferGallery.tsx';
import { OfferInfo } from './components/OfferInfo.tsx';
import { OfferReviewForm } from './components/OfferReviewForm.tsx';
import { OffersList } from './components/OffersList.tsx';
import { OfferReviewsList } from './components/OfferReviewsList.tsx';

interface OfferProps {
  offers: IDetailedOffer[];
}

export const Offer: React.FC<OfferProps> = ({ offers }) => {
  const [offerData, setOfferData] = useState<IDetailedOffer | undefined | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const newOfferData = offers.find((offer) => offer.id === id);

    if (newOfferData) {
      setOfferData(newOfferData);
    } else {
      navigate(RoutePath.NotFound);
    }
  }, [id, offers, navigate]);

  useEffect(() => {
    window.scrollTo(0,0);
  }, [id]);

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link to={RoutePath.Main}>
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
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

      {
        offerData ? (
          <main className="page__main page__main--offer">
            <section className="offer">
              <OfferGallery images={offerData.images} />

              <div className="offer__container container">
                <div className="offer__wrapper">
                  <OfferInfo offerData={offerData.info} />
                  <OfferHost hostData={offerData.host} />

                  <section className="offer__reviews reviews">
                    <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{offerData.reviews.length}</span></h2>

                    <OfferReviewsList reviews={offerData.reviews} />
                    <OfferReviewForm />
                  </section>
                </div>
              </div>

              <section className="offer__map map"></section>
            </section>

            <div className="container">
              <section className="near-places places">
                <h2 className="near-places__title">Other places in the neighbourhood</h2>

                <OffersList offerCardType={OfferCardType.Offer} offersData={offers} numberOfOffers={NEAR_OFFERS_LIST_LENGTH} />
              </section>
            </div>
          </main>
        ) : (
          <div style={{ height: '100%', width: '100%', display: 'flex', justifyItems:'center', alignItems: 'center' }}>
            Nothing here yet...
          </div>
        )
      }
    </div>
  );
};
