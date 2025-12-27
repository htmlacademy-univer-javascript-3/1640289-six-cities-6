import React from 'react';

import { OFFER_CARD_CLASSNAMES, OfferCardType} from '../../../shared/constants/offer.ts';
import { OfferCard } from './offer-card.tsx';
import { useAppDispatch } from '../../../hooks/use-store.ts';
import { setCurrentOfferId } from '../../../store/action.ts';
import {MainOfferInfo} from '../../../shared/types/offer.ts';

export interface OffersListProps {
  offers: MainOfferInfo[];
  offerCardType: OfferCardType;
}
export const OfferList: React.FC<OffersListProps> = ({
  offers,
  offerCardType,
}) => {
  const dispatch = useAppDispatch();

  const handleActiveCardIdChange = (newActiveCardId?: string) => {
    dispatch(setCurrentOfferId(newActiveCardId));
  };

  return (
    <div className={OFFER_CARD_CLASSNAMES[offerCardType].container}>
      {offers
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
