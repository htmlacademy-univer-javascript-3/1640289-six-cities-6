import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Offer } from './offer';
import { AuthStatus } from '../../shared/constants/auth.ts';
import { OfferCardType } from '../../shared/constants/offer.ts';
import * as offerActions from '../../store/actions/offer.ts';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: Record<string, unknown> = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('../../components/offer/offer-host/offer-host.tsx', () => ({
  OfferHost: ({ description }: { description: string }) => (
    <div data-testid="offer-host">Host: {description}</div>
  )
}));

vi.mock('../../components/offer/offer-gallery/offer-gallery.tsx', () => ({
  OfferGallery: ({ images }: { images: string[] }) => (
    <div data-testid="offer-gallery">Gallery: {images.length} images</div>
  )
}));

vi.mock('../../components/offer/offer-info/offer-info.tsx', () => ({
  OfferInfo: ({ offerData }: { offerData: { title: string } }) => (
    <div data-testid="offer-info">{offerData.title}</div>
  )
}));

vi.mock('../../components/offer/offer-review-form/offer-review-form.tsx', () => ({
  OfferReviewForm: ({ offerId }: { offerId?: string }) => (
    <div data-testid="offer-review-form">Review Form: {offerId}</div>
  )
}));

vi.mock('../../components/offer/offer-list/offer-list.tsx', () => ({
  OfferList: ({ offers, offerCardType }: { offers: unknown[]; offerCardType: string }) => (
    <div data-testid="offer-list" data-offer-type={offerCardType}>
      Nearby: {offers.length} offers
    </div>
  )
}));

vi.mock('../../components/offer/offer-review-list/offer-review-list.tsx', () => ({
  OfferReviewList: ({ reviews }: { reviews: unknown[] }) => (
    <div data-testid="offer-review-list">Reviews: {reviews.length}</div>
  )
}));

vi.mock('../../components/map/map.tsx', () => ({
  default: ({ points, additionalClass }: { points: unknown[]; additionalClass: string }) => (
    <div data-testid="map" data-class={additionalClass}>
      Map: {points.length} points
    </div>
  )
}));

vi.mock('../../components/header/header.tsx', () => ({
  Header: () => <div data-testid="header">Header</div>
}));

vi.mock('../../components/spinner/spinner.tsx', () => ({
  default: () => <div data-testid="spinner">Loading...</div>
}));

vi.mock('../../store/actions/offer.ts', () => ({
  fetchCurrentOffer: vi.fn()
}));

vi.mock('../../shared/utils/offer.ts', () => ({
  getCoordinatesOffers: vi.fn((offers: { id: string; location: { latitude: number; longitude: number } }[], currentId: string) =>
    offers.map((offer: { id: string; location: { latitude: number; longitude: number } }) => ({
      id: offer.id,
      latitude: offer.location.latitude,
      longitude: offer.location.longitude,
      isActive: offer.id === currentId
    }))
  )
}));

vi.mock('../../shared/constants/offer.ts', async () => {
  const actual: Record<string, unknown> = await vi.importActual('../../shared/constants/offer.ts');
  return {
    ...actual,
    NEAR_OFFERS_LIST_LENGTH: 3
  };
});

const mockCurrentOffer = {
  id: '1',
  title: 'Beautiful apartment',
  description: 'A very nice place to stay',
  images: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
  host: {
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
    isPro: true
  },
  rating: 4.5,
  price: 120,
  type: 'Apartment',
  isPremium: true,
  isFavorite: false,
  city: { name: 'Paris' },
  location: { latitude: 48.8566, longitude: 2.3522 }
};

const mockNearbyOffers = [
  {
    id: '2',
    title: 'Nearby place 1',
    location: { latitude: 48.8606, longitude: 2.3376 },
    city: { name: 'Paris' }
  },
  {
    id: '3',
    title: 'Nearby place 2',
    location: { latitude: 48.8738, longitude: 2.2950 },
    city: { name: 'Paris' }
  },
  {
    id: '4',
    title: 'Nearby place 3',
    location: { latitude: 48.8534, longitude: 2.3488 },
    city: { name: 'Paris' }
  },
  {
    id: '5',
    title: 'Nearby place 4',
    location: { latitude: 48.8584, longitude: 2.2945 },
    city: { name: 'Paris' }
  }
];

const mockReviews = [
  {
    id: '1',
    comment: 'Great place!',
    rating: 5,
    date: '2024-12-01',
    user: { name: 'Alice', avatarUrl: 'alice.jpg', isPro: false }
  },
  {
    id: '2',
    comment: 'Nice stay',
    rating: 4,
    date: '2024-12-10',
    user: { name: 'Bob', avatarUrl: 'bob.jpg', isPro: true }
  }
];

const createMockStore = (
  authStatus = AuthStatus.Auth,
  currentOffer = mockCurrentOffer,
  isLoading = false,
  nearbyOffers = mockNearbyOffers,
  reviews = mockReviews
) => configureStore({
  reducer: {
    auth: () => ({ authorizationStatus: authStatus }),
    currentOffer: () => ({
      currentOffer,
      currentOfferLoading: isLoading,
      currentOfferNearby: nearbyOffers,
      currentOfferFeedbacks: reviews
    })
  }
});

const renderWithProviders = (
  store: ReturnType<typeof createMockStore>,
  initialRoute = '/offer/1'
) => render(
  <Provider store={store}>
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/offer/:id" element={<Offer />} />
      </Routes>
    </MemoryRouter>
  </Provider>
);

describe('Offer Component', () => {
  const mockFetchCurrentOffer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (offerActions.fetchCurrentOffer as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockFetchCurrentOffer);
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true
    });
  });

  it('should show spinner when offer is loading', () => {
    const store = createMockStore(AuthStatus.Auth, mockCurrentOffer, true);

    renderWithProviders(store);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('should render offer page with all sections when offer is loaded', () => {
    const store = createMockStore();

    renderWithProviders(store);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('offer-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('offer-info')).toBeInTheDocument();
    expect(screen.getByTestId('offer-host')).toBeInTheDocument();
    expect(screen.getByTestId('offer-review-list')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByTestId('offer-list')).toBeInTheDocument();
  });

  it('should dispatch fetchCurrentOffer on mount', () => {
    const store = createMockStore();

    renderWithProviders(store);

    expect(offerActions.fetchCurrentOffer).toHaveBeenCalledWith({
      offerId: '1',
      navigate: mockNavigate
    });
  });

  it('should display offer title', () => {
    const store = createMockStore();

    renderWithProviders(store);

    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
  });

  it('should display number of images in gallery', () => {
    const store = createMockStore();

    renderWithProviders(store);

    expect(screen.getByText(/Gallery: 3 images/)).toBeInTheDocument();
  });

  it('should display host description', () => {
    const store = createMockStore();

    renderWithProviders(store);

    expect(screen.getByText(/Host: A very nice place to stay/)).toBeInTheDocument();
  });

  it('should display review form when user is authenticated', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithProviders(store);

    expect(screen.getByTestId('offer-review-form')).toBeInTheDocument();
  });

  it('should not display review form when user is not authenticated', () => {
    const store = createMockStore(AuthStatus.NoAuth);

    renderWithProviders(store);

    expect(screen.queryByTestId('offer-review-form')).not.toBeInTheDocument();
  });

  it('should display correct number of nearby offers (limited by NEAR_OFFERS_LIST_LENGTH)', () => {
    const store = createMockStore();

    renderWithProviders(store);

    expect(screen.getByText(/Nearby: 3 offers/)).toBeInTheDocument();
  });

  it('should render map with correct class', () => {
    const store = createMockStore();

    renderWithProviders(store);

    const map = screen.getByTestId('map');
    expect(map).toHaveAttribute('data-class', 'offer__map');
  });

  it('should pass correct offer card type to nearby offers list', () => {
    const store = createMockStore();

    renderWithProviders(store);

    const offerList = screen.getByTestId('offer-list');
    expect(offerList).toHaveAttribute('data-offer-type', OfferCardType.Offer);
  });

  it('should display "Other places in the neighbourhood" heading', () => {
    const store = createMockStore();

    renderWithProviders(store);

    expect(screen.getByRole('heading', { name: /other places in the neighbourhood/i })).toBeInTheDocument();
  });

  it('should display reviews title with amount', () => {
    const store = createMockStore();

    renderWithProviders(store);

    expect(screen.getByRole('heading', { name: /reviews/i })).toBeInTheDocument();
  });

  it('should scroll to top when offer id changes', async () => {
    const store = createMockStore();

    renderWithProviders(store);

    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  it('should handle empty reviews list', () => {
    const store = createMockStore(AuthStatus.Auth, mockCurrentOffer, false, mockNearbyOffers, []);

    renderWithProviders(store);

    expect(screen.getByText(/Reviews: 0/)).toBeInTheDocument();
  });

  it('should handle empty nearby offers list', () => {
    const store = createMockStore(AuthStatus.Auth, mockCurrentOffer, false, []);

    renderWithProviders(store);

    expect(screen.getByText(/Nearby: 0 offers/)).toBeInTheDocument();
  });

  it('should render offer section with correct CSS classes', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(store);

    expect(container.querySelector('.page__main--offer')).toBeInTheDocument();
    expect(container.querySelector('.offer')).toBeInTheDocument();
    expect(container.querySelector('.offer__container')).toBeInTheDocument();
    expect(container.querySelector('.offer__wrapper')).toBeInTheDocument();
  });

  it('should render reviews section with correct structure', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(store);

    const reviewsSection = container.querySelector('.offer__reviews');
    expect(reviewsSection).toBeInTheDocument();
    expect(reviewsSection?.querySelector('.reviews__title')).toBeInTheDocument();
  });

  it('should render near places section with correct structure', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(store);

    const nearPlacesSection = container.querySelector('.near-places');
    expect(nearPlacesSection).toBeInTheDocument();
    expect(nearPlacesSection?.querySelector('.near-places__title')).toBeInTheDocument();
  });

  it('should limit nearby offers to NEAR_OFFERS_LIST_LENGTH', () => {
    const manyNearbyOffers = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 2}`,
      title: `Nearby place ${i + 1}`,
      location: { latitude: 48.8566 + i * 0.01, longitude: 2.3522 + i * 0.01 },
      city: { name: 'Paris' }
    }));

    const store = createMockStore(AuthStatus.Auth, mockCurrentOffer, false, manyNearbyOffers);

    renderWithProviders(store);

    expect(screen.getByText(/Nearby: 3 offers/)).toBeInTheDocument();
  });

  it('should pass offer id to review form', () => {
    const store = createMockStore(AuthStatus.Auth);

    renderWithProviders(store);

    expect(screen.getByText(/Review Form: 1/)).toBeInTheDocument();
  });

  it('should render page with correct main class', () => {
    const store = createMockStore();

    const { container } = renderWithProviders(store);

    const page = container.querySelector('.page');
    expect(page).toBeInTheDocument();

    const main = container.querySelector('.page__main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('page__main--offer');
  });
});
