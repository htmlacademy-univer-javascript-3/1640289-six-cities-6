import React from 'react';

import {DEFAULT_OFFERS_LIST_LENGTH, OFFER_CARD_CLASSNAMES, OfferCardType} from '../../../shared/constants/offer.ts';
import { OfferCard } from './offer-card.tsx';
import { useAppDispatch, useAppSelector } from '../../../hooks/use-store.ts';
import { setCurrentOfferId } from '../../../store/action.ts';

export interface OffersListProps {
  offerCardType: OfferCardType;
  numberOfOffers?: number;
}
export const OfferList: React.FC<OffersListProps> = ({
  offerCardType,
  numberOfOffers = DEFAULT_OFFERS_LIST_LENGTH
}) => {
  const offersData = useAppSelector((state) => state.offers);

  const dispatch = useAppDispatch();

  const handleActiveCardIdChange = (newActiveCardId: string | undefined) => {
    dispatch(setCurrentOfferId(newActiveCardId));
  };

  return (
    <div className={OFFER_CARD_CLASSNAMES[offerCardType].container}>
      {offersData
        .slice(0, numberOfOffers)
        .map((offerData) => (
          <OfferCard
            key={offerData.id}
            id={offerData.id}
            offerData={offerData}
            offerCardType={offerCardType}
            handleActiveCardIdChange={handleActiveCardIdChange}
          />
        ))}
    </div>
  );
};
