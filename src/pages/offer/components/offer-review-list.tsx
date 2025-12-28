import React from 'react';

import { OfferFeedback } from '../../../shared/types/offer.ts';
import { OfferReview } from './offer-review.tsx';

interface OfferReviewsListProps {
  reviews: OfferFeedback[];
}

export const OfferReviewList: React.FC<OfferReviewsListProps> = ({ reviews }) => (
  <ul className="reviews__list">
    {reviews.map((review) => <OfferReview key={review.id} reviewData={review} />)}
  </ul>
);
