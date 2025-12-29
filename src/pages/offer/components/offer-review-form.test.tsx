import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OfferReviewForm } from './offer-review-form';
import * as offerActions from '../../../store/actions/offer.ts';
import { MainOfferInfo } from '../../../shared/types/offer.ts';

vi.mock('../../../store/actions/offer.ts', () => ({
  postReview: vi.fn()
}));

vi.mock('../../../shared/utils/offer.ts', () => ({
  validateValues: vi.fn((rating: number, comment: { length: number }) => rating > 0 && comment.length >= 50 && comment.length <= 300)
}));

vi.mock('../../../shared/constants/offer.ts', () => ({
  RATING_VALUES: [
    { value: 5, title: 'perfect' },
    { value: 4, title: 'good' },
    { value: 3, title: 'not bad' },
    { value: 2, title: 'badly' },
    { value: 1, title: 'terribly' }
  ],
  COMMENT_OPTIONS: {
    minLength: 50,
    maxLength: 300
  }
}));

const createMockStore = () => configureStore({
  reducer: {
    offers: (state: MainOfferInfo[] = []) => state
  }
});

describe('OfferReviewForm Component', () => {
  let store: ReturnType<typeof createMockStore>;
  const mockPostReview = vi.fn();

  beforeEach(() => {
    store = createMockStore();
    vi.clearAllMocks();
    (offerActions.postReview as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockPostReview);
  });

  it('should render review form with all elements', () => {
    render(
      <Provider store={store}>
        <OfferReviewForm offerId="1" />
      </Provider>
    );

    expect(screen.getByLabelText(/your review/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /your review/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should render all rating stars', () => {
    render(
      <Provider store={store}>
        <OfferReviewForm offerId="1" />
      </Provider>
    );

    const ratingInputs = screen.getAllByRole('radio');
    expect(ratingInputs).toHaveLength(5);
  });

  it('should have submit button disabled by default', () => {
    render(
      <Provider store={store}>
        <OfferReviewForm offerId="1" />
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should update comment when textarea value changes', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <OfferReviewForm offerId="1" />
      </Provider>
    );

    const textarea = screen.getByRole('textbox', { name: /your review/i });
    const testComment = 'This is a test comment with more than fifty characters to pass validation';

    await user.type(textarea, testComment);

    expect(textarea).toHaveValue(testComment);
  });

  it('should have correct textarea attributes', () => {
    render(
      <Provider store={store}>
        <OfferReviewForm offerId="1" />
      </Provider>
    );

    const textarea = screen.getByRole('textbox', { name: /your review/i });

    expect(textarea).toHaveAttribute('minLength', '50');
    expect(textarea).toHaveAttribute('maxLength', '300');
    expect(textarea).toHaveAttribute('placeholder');
  });

  it('should display help text with minimum character requirement', () => {
    render(
      <Provider store={store}>
        <OfferReviewForm offerId="1" />
      </Provider>
    );

    expect(screen.getByText(/50 characters/i)).toBeInTheDocument();
  });
});
