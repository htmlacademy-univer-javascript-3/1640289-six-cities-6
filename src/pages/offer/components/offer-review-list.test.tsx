import { render, screen } from '@testing-library/react';
import { OfferReviewList } from './offer-review-list';
import { OfferFeedback } from '../../../shared/types/offer';
import { vi } from 'vitest';

vi.mock('./offer-review.tsx', () => ({
  OfferReview: ({ reviewData }: { reviewData: OfferFeedback }) => (
    <li>{reviewData.id}</li>
  ),
}));

describe('OfferReviewList', () => {
  it('renders a list of reviews', () => {
    const reviews: OfferFeedback[] = [
      { id: '1', date: new Date().toString(), user: {name: 'Usar', isPro: false, avatarUrl: 'url'}, comment: 'Review 1', rating: 5 },
      { id: '2', date: new Date().toString(), user: {name: 'Yen', isPro: false, avatarUrl: 'url'}, comment: 'Review 2', rating: 3 },
      { id: '3', date: new Date().toString(), user: {name: 'Aka', isPro: true, avatarUrl: 'url'}, comment: 'Review 3', rating: 5 },
    ];

    render(<OfferReviewList reviews={reviews} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(reviews.length);

    reviews.forEach((review) => {
      expect(screen.getByText(review.id)).toBeInTheDocument();
    });
  });

  it('renders nothing when there are no reviews', () => {
    render(<OfferReviewList reviews={[]} />);
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });
});
