import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { OfferCard } from './offer-card';
import { OfferCardType } from '../../../shared/constants/offer';
import { MainOfferInfo } from '../../../shared/types/offer';
import { AuthStatus } from '../../../shared/constants/auth';
import { RoutePath } from '../../../shared/constants/router';

vi.mock('../../../shared/utils/offer', () => ({
  getOfferRouteWithId: (id: string) => `/offer/${id}`,
  getRatingPercent: (rating: number) => `${(rating / 5) * 100}%`,
}));

vi.mock('../../../store/actions/offer', () => ({
  setBookmarkOffer: vi.fn((payload: {offer: MainOfferInfo; status: number}) => ({ type: 'SET_BOOKMARK_OFFER', payload })),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual: Record<string, unknown> = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('OfferCard', () => {
  const mockOffer: MainOfferInfo = {
    id: '1',
    title: 'Beautiful apartment',
    type: 'apartment',
    price: 120,
    city: {
      name: 'Amsterdam',
      location: { latitude: 52.370216, longitude: 4.895168, zoom: 10 }
    },
    location: { latitude: 52.3909553943508, longitude: 4.85309666406198, zoom: 8 },
    isFavorite: false,
    isPremium: false,
    rating: 4.5,
    previewImage: 'img/apartment-01.jpg'
  };

  const mockHandleActiveCardIdChange = vi.fn();

  const createMockStore = (authStatus = AuthStatus.Auth, favorites: MainOfferInfo[] = []) =>
    configureStore({
      reducer: {
        auth: () => ({ authorizationStatus: authStatus }),
        favorites: () => ({ offerFavorites: favorites }),
      },
    });

  const renderWithProviders = (
    component: React.ReactElement,
    store = createMockStore()
  ) =>
    render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders offer card with correct data', () => {
    renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
    expect(screen.getByText('€120')).toBeInTheDocument();
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByAltText('Place image')).toHaveAttribute('src', 'img/apartment-01.jpg');
  });

  it('displays premium mark when offer is premium', () => {
    const premiumOffer = { ...mockOffer, isPremium: true };

    renderWithProviders(
      <OfferCard
        id={premiumOffer.id}
        offerData={premiumOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('does not display premium mark when offer is not premium', () => {
    renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    expect(screen.queryByText('Premium')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for main card type', () => {
    const { container } = renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    expect(container.querySelector('.cities__card.place-card')).toBeInTheDocument();
    expect(container.querySelector('.cities__image-wrapper')).toBeInTheDocument();
  });

  it('applies correct CSS classes for offer card type', () => {
    const { container } = renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Offer}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    expect(container.querySelector('.near-places__card.place-card')).toBeInTheDocument();
    expect(container.querySelector('.near-places__image-wrapper')).toBeInTheDocument();
  });

  it('applies correct CSS classes for favorites card type', () => {
    const { container } = renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Favorites}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    expect(container.querySelector('.favorites__card.place-card')).toBeInTheDocument();
    expect(container.querySelector('.favorites__image-wrapper')).toBeInTheDocument();
  });

  it('calls handleActiveCardIdChange on mouse over', () => {
    renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    const article = screen.getByRole('article');
    fireEvent.mouseOver(article);

    expect(mockHandleActiveCardIdChange).toHaveBeenCalledWith('1');
  });

  it('calls handleActiveCardIdChange on mouse leave', () => {
    renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    const article = screen.getByRole('article');
    fireEvent.mouseLeave(article);

    expect(mockHandleActiveCardIdChange).toHaveBeenCalledWith('1');
  });

  it('navigates to login when bookmark clicked and user is not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />,
      store
    );

    const bookmarkButton = screen.getByRole('button', { name: /to bookmarks/i });
    fireEvent.click(bookmarkButton);

    expect(mockNavigate).toHaveBeenCalledWith(RoutePath.Login);
  });

  it('dispatches setBookmarkOffer when bookmark clicked and user is authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />,
      store
    );

    const bookmarkButton = screen.getByRole('button', { name: /to bookmarks/i });
    fireEvent.click(bookmarkButton);

    expect(dispatchSpy).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays active bookmark state when offer is favorite', () => {
    const favoriteOffer = { ...mockOffer, isFavorite: true };
    const store = createMockStore(AuthStatus.Auth, [favoriteOffer]);

    const { container } = renderWithProviders(
      <OfferCard
        id={favoriteOffer.id}
        offerData={favoriteOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />,
      store
    );

    const bookmarkButton = container.querySelector('.place-card__bookmark-button--active');
    expect(bookmarkButton).toBeInTheDocument();
  });

  it('displays inactive bookmark state when offer is not favorite', () => {
    const store = createMockStore(AuthStatus.Auth, []);

    const { container } = renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />,
      store
    );

    const bookmarkButton = container.querySelector('.place-card__bookmark-button--active');
    expect(bookmarkButton).not.toBeInTheDocument();
  });

  it('renders links with correct routes', () => {
    renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/offer/1');
    });
  });

  it('displays correct rating percentage', () => {
    const { container } = renderWithProviders(
      <OfferCard
        id={mockOffer.id}
        offerData={mockOffer}
        offerCardType={OfferCardType.Main}
        handleActiveCardIdChange={mockHandleActiveCardIdChange}
      />
    );

    const ratingSpan = container.querySelector('.place-card__stars span');
    expect(ratingSpan).toHaveStyle({ width: '90%' });
  });
});
