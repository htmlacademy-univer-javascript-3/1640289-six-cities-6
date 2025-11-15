import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { IOfferReview } from '../../../shared/types/offer.ts';
import { OfferReview } from './OfferReview.tsx';

interface OfferReviewsListProps {
  reviews: IOfferReview[];
}

export const OfferReviewsList: React.FC<OfferReviewsListProps> = ({ reviews }) => (
  <ul className="reviews__list">
    {reviews.map((reviewItem) => <OfferReview key={uuidv4()} reviewData={reviewItem} />)}
  </ul>
);
