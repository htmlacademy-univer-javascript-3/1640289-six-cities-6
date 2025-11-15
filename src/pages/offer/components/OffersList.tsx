import React, { useState } from 'react';

import { IDetailedOffer, OfferCardType } from '../../../shared/types/offer.ts';
import { DEFAULT_OFFERS_LIST_LENGTH, OFFER_CARD_CLASSNAMES } from '../../../shared/constants/offer.ts';
import { OfferCard } from './OfferCard.tsx';

export interface OffersListProps {
  offersData: IDetailedOffer[];
  offerCardType: OfferCardType;
  numberOfOffers?: number;
}
export const OffersList: React.FC<OffersListProps> = ({
  offersData,
  offerCardType,
  numberOfOffers = DEFAULT_OFFERS_LIST_LENGTH
}) => {
  const [, setActiveCardId] = useState<string | undefined>();

  const handleActiveCardIdChange = (newActiveCardId: string | undefined) => {
    setActiveCardId(newActiveCardId);
  };

  return (
    <div className={OFFER_CARD_CLASSNAMES[offerCardType].container}>
      {offersData
        .slice(0, numberOfOffers)
        .map((offerData) => (
          <OfferCard
            key={offerData.id}
            id={offerData.id}
            offerData={offerData.info}
            offerCardType={offerCardType}
            handleActiveCardIdChange={handleActiveCardIdChange}
          />
        ))}
    </div>
  );
};
