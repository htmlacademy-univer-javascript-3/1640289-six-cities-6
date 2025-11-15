import React from 'react';
import { Link } from 'react-router-dom';

import { ISimpleOfferInfo, OfferCardType } from '../../../shared/types/offer.ts';
import { OFFER_CARD_CLASSNAMES } from '../../../shared/constants/offer.ts';
import { getOfferRouteWithId, getRatingPercent } from '../../../shared/utils/offer.ts';

export interface OfferCardProps {
  id: string;
  offerData: ISimpleOfferInfo;
  offerCardType: OfferCardType;
  handleActiveCardIdChange: (newActiveCardId: string | undefined) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ id, offerData, offerCardType, handleActiveCardIdChange }) => {
  const { title, rating, price, placeType, isPremium, image } = offerData;

  return (
    <article
      className={OFFER_CARD_CLASSNAMES[offerCardType].item}
      onMouseOver={() => handleActiveCardIdChange(id)}
      onMouseLeave={() => handleActiveCardIdChange(undefined)}
    >
      { isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      ) }

      <div className={OFFER_CARD_CLASSNAMES[offerCardType].image}>
        <Link to={getOfferRouteWithId(id)}>
          <img className="place-card__image" src={image} width="260" height="200" alt="Place image" />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>

          <button className="place-card__bookmark-button button" type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: getRatingPercent(rating) }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <Link to={getOfferRouteWithId(id)}>
            {title}
          </Link>
        </h2>

        <p className="place-card__type">{placeType}</p>
      </div>
    </article>
  );
};
