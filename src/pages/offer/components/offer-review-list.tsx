import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { OfferFeedback } from '../../../shared/types/offer.ts';
import { OfferReview } from './offer-review.tsx';

interface OfferReviewsListProps {
  reviews: OfferFeedback[];
}

export const OfferReviewList: React.FC<OfferReviewsListProps> = ({ reviews }) => (
  <ul className="reviews__list">
    {reviews.map((reviewItem) => <OfferReview key={uuidv4()} reviewData={reviewItem} />)}
  </ul>
);
