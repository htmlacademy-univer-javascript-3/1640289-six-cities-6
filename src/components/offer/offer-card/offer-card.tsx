import React, {useCallback, useMemo} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { MainOfferInfo } from '../../../shared/types/offer.ts';
import { OFFER_CARD_CLASSNAMES, OfferCardType } from '../../../shared/constants/offer.ts';
import { getOfferRouteWithId, getRatingPercent } from '../../../shared/utils/offer.ts';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../hooks/use-store.ts';
import { AuthStatus } from '../../../shared/constants/auth.ts';
import { RoutePath } from '../../../shared/constants/router.ts';
import { setBookmarkOffer } from '../../../store/actions/offer.ts';
import classNames from 'classnames';

interface OfferCardProps {
  id: string;
  offerData: MainOfferInfo;
  offerCardType: OfferCardType;
  handleActiveCardIdChange: (newActiveCardId: string) => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ id, offerData, offerCardType, handleActiveCardIdChange }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { title, rating, price, type, isPremium, previewImage } = offerData;
  const { authorizationStatus } = useSelector((state: RootState) => state.auth);
  const { offerFavorites } = useSelector((state: RootState) => state.favorites);

  const isFavorite = useMemo(() => offerFavorites.find((item) => item.id === offerData.id)?.isFavorite || false, [offerData.id, offerFavorites]);

  const handleMouseOver = useCallback(() => handleActiveCardIdChange(id), [id, handleActiveCardIdChange]);
  const handleMouseLeave = useCallback(() => handleActiveCardIdChange(id), [handleActiveCardIdChange, id]);

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (authorizationStatus !== AuthStatus.Auth) {
      navigate(RoutePath.Login);
      return;
    }

    const status = isFavorite ? 0 : 1;
    dispatch(setBookmarkOffer({ offer: offerData, status }));
  };

  return (
    <article
      className={OFFER_CARD_CLASSNAMES[offerCardType].item}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      { isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      ) }

      <div className={OFFER_CARD_CLASSNAMES[offerCardType].image}>
        <Link to={getOfferRouteWithId(id)}>
          <img className="place-card__image" src={previewImage} width="260" height="200" alt="Place image" />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>

          <button className={classNames('place-card__bookmark-button button', {
            ['place-card__bookmark-button--active']: isFavorite
          })} type="button" onClick={handleBookmarkClick}
          >
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

        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
};
