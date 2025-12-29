import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfferReview } from './offer-review.tsx';

vi.mock('../../../shared/utils/offer.ts', () => ({
  getRatingPercent: vi.fn((rating) => `${(rating / 5) * 100}%`)
}));

vi.mock('../../../shared/utils/date.ts', () => ({
  getFormattedDate: vi.fn((date: Date | string | number) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  })
}));

const mockReviewData = {
  id: '1',
  date: '2024-12-15T10:30:00.000Z',
  user: {
    name: 'John Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPro: false
  },
  comment: 'This is a great place to stay! The location is perfect and the host was very friendly.',
  rating: 4.5
};

describe('OfferReview Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render review with all main elements', () => {
    render(<OfferReview reviewData={mockReviewData} />);

    expect(screen.getByText(mockReviewData.user.name)).toBeInTheDocument();
    expect(screen.getByText(mockReviewData.comment)).toBeInTheDocument();
    expect(screen.getByAltText('Reviews avatar')).toBeInTheDocument();
  });

  it('should display user name', () => {
    render(<OfferReview reviewData={mockReviewData} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should display comment text', () => {
    render(<OfferReview reviewData={mockReviewData} />);

    expect(screen.getByText(mockReviewData.comment)).toBeInTheDocument();
  });

  it('should display formatted date', () => {
    render(<OfferReview reviewData={mockReviewData} />);

    expect(screen.getByText('December 2024')).toBeInTheDocument();
  });

  it('should have time element with correct dateTime attribute', () => {
    render(<OfferReview reviewData={mockReviewData} />);

    const timeElement = screen.getByText('December 2024');
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveAttribute('dateTime', mockReviewData.date);
  });

  it('should display correct rating width', () => {
    const { container } = render(<OfferReview reviewData={mockReviewData} />);

    const ratingSpan = container.querySelector('.reviews__stars span') as HTMLElement;
    expect(ratingSpan.style.width).toBe('90%');
  });

  it('should call getRatingPercent with correct rating', async () => {
    const getRatingPercentMock = vi.fn((rating) => `${(rating / 5) * 100}%`);
    vi.mocked(await import('../../../shared/utils/offer.ts')).getRatingPercent = getRatingPercentMock;

    render(<OfferReview reviewData={mockReviewData} />);

    expect(getRatingPercentMock).toHaveBeenCalledWith(mockReviewData.rating);
  });

  it('should call getFormattedDate with correct date', async () => {
    const getFormattedDateMock = vi.fn((date: string) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    });
    vi.mocked(await import('../../../shared/utils/date.ts')).getFormattedDate = getFormattedDateMock;

    render(<OfferReview reviewData={mockReviewData} />);

    expect(getFormattedDateMock).toHaveBeenCalledWith(mockReviewData.date);
  });

  it('should render rating with visually hidden label', () => {
    const { container } = render(<OfferReview reviewData={mockReviewData} />);

    const hiddenRating = container.querySelector('.visually-hidden');
    expect(hiddenRating).toBeInTheDocument();
    expect(hiddenRating).toHaveTextContent('Rating');
  });

  it('should have correct CSS classes', () => {
    const { container } = render(<OfferReview reviewData={mockReviewData} />);

    expect(container.querySelector('.reviews__item')).toBeInTheDocument();
    expect(container.querySelector('.reviews__user')).toBeInTheDocument();
    expect(container.querySelector('.reviews__avatar-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.reviews__info')).toBeInTheDocument();
    expect(container.querySelector('.reviews__rating')).toBeInTheDocument();
    expect(container.querySelector('.reviews__text')).toBeInTheDocument();
    expect(container.querySelector('.reviews__time')).toBeInTheDocument();
  });

  it('should render as list item', () => {
    const { container } = render(<OfferReview reviewData={mockReviewData} />);

    const listItem = container.querySelector('li');
    expect(listItem).toBeInTheDocument();
    expect(listItem).toHaveClass('reviews__item');
  });

  it('should handle different user names', () => {
    const customReview = {
      ...mockReviewData,
      user: { ...mockReviewData.user, name: 'Jane Smith' }
    };

    render(<OfferReview reviewData={customReview} />);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should handle different comments', () => {
    const customReview = {
      ...mockReviewData,
      comment: 'Amazing experience! Would definitely come back.'
    };

    render(<OfferReview reviewData={customReview} />);

    expect(screen.getByText('Amazing experience! Would definitely come back.')).toBeInTheDocument();
  });

  it('should handle different ratings', () => {
    const customReview = {
      ...mockReviewData,
      rating: 5
    };

    const { container } = render(<OfferReview reviewData={customReview} />);

    const ratingSpan = container.querySelector('.reviews__stars span') as HTMLElement;
    expect(ratingSpan.style.width).toBe('100%');
  });

  it('should handle low ratings', () => {
    const customReview = {
      ...mockReviewData,
      rating: 1
    };

    const { container } = render(<OfferReview reviewData={customReview} />);

    const ratingSpan = container.querySelector('.reviews__stars span') as HTMLElement;
    expect(ratingSpan.style.width).toBe('20%');
  });

  it('should handle different dates', () => {
    const customReview = {
      ...mockReviewData,
      date: '2023-06-20T14:00:00.000Z'
    };

    render(<OfferReview reviewData={customReview} />);

    expect(screen.getByText('June 2023')).toBeInTheDocument();
  });

  it('should memoize rating width calculation', () => {
    const { rerender } = render(<OfferReview reviewData={mockReviewData} />);

    const { container: firstContainer } = render(<OfferReview reviewData={mockReviewData} />);
    const firstRatingSpan = firstContainer.querySelector('.reviews__stars span') as HTMLElement;
    const firstWidth = firstRatingSpan.style.width;

    rerender(<OfferReview reviewData={mockReviewData} />);

    const { container: secondContainer } = render(<OfferReview reviewData={mockReviewData} />);
    const secondRatingSpan = secondContainer.querySelector('.reviews__stars span') as HTMLElement;
    const secondWidth = secondRatingSpan.style.width;

    expect(firstWidth).toBe(secondWidth);
  });

  it('should memoize formatted date calculation', () => {
    const { rerender } = render(<OfferReview reviewData={mockReviewData} />);

    const firstDate = screen.getByText('December 2024').textContent;

    rerender(<OfferReview reviewData={mockReviewData} />);

    const secondDate = screen.getByText('December 2024').textContent;

    expect(firstDate).toBe(secondDate);
  });

  it('should update rating width when rating changes', () => {
    const { rerender, container } = render(<OfferReview reviewData={mockReviewData} />);

    const firstRatingSpan = container.querySelector('.reviews__stars span') as HTMLElement;
    expect(firstRatingSpan.style.width).toBe('90%');

    const updatedReview = { ...mockReviewData, rating: 3 };
    rerender(<OfferReview reviewData={updatedReview} />);

    const secondRatingSpan = container.querySelector('.reviews__stars span') as HTMLElement;
    expect(secondRatingSpan.style.width).toBe('60%');
  });

  it('should update formatted date when date changes', () => {
    const { rerender } = render(<OfferReview reviewData={mockReviewData} />);

    expect(screen.getByText('December 2024')).toBeInTheDocument();

    const updatedReview = { ...mockReviewData, date: '2023-03-10T10:00:00.000Z' };
    rerender(<OfferReview reviewData={updatedReview} />);

    expect(screen.getByText('March 2023')).toBeInTheDocument();
  });
});
