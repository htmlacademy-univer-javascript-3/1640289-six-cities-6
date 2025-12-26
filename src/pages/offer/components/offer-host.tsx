import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { OfferHostInfo } from '../../../shared/types/offer.ts';

interface OfferHostProps {
  hostData: OfferHostInfo;
}

export const OfferHost: React.FC<OfferHostProps> = ({ hostData }) => {
  const { name, avatar, description, status } = hostData;

  return (
    (
      <div className="offer__host">
        <h2 className="offer__host-title">Meet the host</h2>
        <div className="offer__host-user user">
          <div className="offer__avatar-wrapper offer__avatar-wrapper--pro user__avatar-wrapper">
            <img className="offer__avatar user__avatar" src={avatar} width="74" height="74" alt="Host avatar" />
          </div>

          <span className="offer__user-name">
            {name}
          </span>

          <span className="offer__user-status">
            {status}
          </span>
        </div>

        <div className="offer__description">
          { description.map((item) => (
            <p key={uuidv4()} className="offer__text">
              {item}
            </p>
          )) }
        </div>
      </div>
    )
  );
};
