import React, { useMemo } from 'react';

import { OfferFeedback } from '../../../shared/types/offer.ts';
import { getRatingPercent } from '../../../shared/utils/offer.ts';
import { getFormattedDate } from '../../../shared/utils/date.ts';

interface OfferReviewProps {
  reviewData: OfferFeedback;
}

export const OfferReview: React.FC<OfferReviewProps> = ({ reviewData }) => {
  const { date, user, comment, rating } = reviewData;

  const ratingWidth = useMemo(() => getRatingPercent(rating), [rating]);
  const formattedDate = useMemo(() => getFormattedDate(date), [date]);

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img className="reviews__avatar user__avatar" src={user.avatarUrl} width="54" height="54" alt="Reviews avatar" />
        </div>

        <span className="reviews__user-name">
          {user.name}
        </span>
      </div>

      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{ width: ratingWidth }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <p className="reviews__text">
          {comment}
        </p>

        <time className="reviews__time" dateTime={date}>{formattedDate}</time>
      </div>
    </li>
  );
};
