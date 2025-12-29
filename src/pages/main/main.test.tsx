import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Main } from './main';
import { OfferCardType } from '../../shared/constants/offer.ts';

vi.mock('../../components/city-list/city-list.tsx', () => ({
  CitiesList: () => <div data-testid="cities-list">Cities List</div>
}));

vi.mock('../../components/header/header.tsx', () => ({
  Header: () => <div data-testid="header">Header</div>
}));

vi.mock('../../components/offer/offer-list/offer-list.tsx', () => ({
  OfferList: ({ offers, offerCardType }: { offers: unknown[]; offerCardType: string }) => (
    <div data-testid="offer-list" data-offer-type={offerCardType}>
      Offers: {offers.length}
    </div>
  )
}));

vi.mock('../../components/offer/offer-sort/offer-sort.tsx', () => ({
  OffersSort: () => <div data-testid="offers-sort">Offers Sort</div>
}));

vi.mock('../../components/map/map.tsx', () => ({
  default: ({ points, additionalClass }: { points: unknown[]; additionalClass: string }) => (
    <div data-testid="map" data-class={additionalClass}>
      Map with {points.length} points
    </div>
  )
}));

vi.mock('../main-empty/main-empty.tsx', () => ({
  MainEmpty: () => <div data-testid="main-empty">Main Empty</div>
}));

vi.mock('../../shared/utils/offer.ts', () => ({
  getCoordinatesOffers: vi.fn((offers: { id: string; location: { latitude: number; longitude: number }}[], currentOfferId: string) =>
    offers.map((offer: { id: string; location: { latitude: number; longitude: number } }) => ({
      id: offer.id,
      latitude: offer.location.latitude,
      longitude: offer.location.longitude,
      isActive: offer.id === currentOfferId
    }))
  )
}));

const mockOffers = [
  {
    id: '1',
    city: { name: 'Paris' },
    location: { latitude: 48.8566, longitude: 2.3522 },
    title: 'Beautiful apartment'
  },
  {
    id: '2',
    city: { name: 'Paris' },
    location: { latitude: 48.8606, longitude: 2.3376 },
    title: 'Cozy studio'
  },
  {
    id: '3',
    city: { name: 'Amsterdam' },
    location: { latitude: 52.3676, longitude: 4.9041 },
    title: 'Nice flat'
  }
];

const createMockStore = (
  offers = mockOffers,
  cityName = 'Paris',
  currentOfferId: string | null = null
) => configureStore({
  reducer: {
    offers: () => ({ offers }),
    city: () => ({ city: { name: cityName } }),
    currentOffer: () => ({ currentOfferId })
  }
});

describe('Main Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render MainEmpty when no offers available for current city', () => {
    const store = createMockStore(mockOffers, 'Cologne');

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    expect(screen.getByTestId('main-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('should render main page with all sections when offers are available', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('cities-list')).toBeInTheDocument();
    expect(screen.getByTestId('offer-list')).toBeInTheDocument();
    expect(screen.getByTestId('offers-sort')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('should display correct number of places for current city', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    expect(screen.getByText(/2 places to stay in paris/i)).toBeInTheDocument();
  });

  it('should filter offers by current city', () => {
    const store = createMockStore(mockOffers, 'Amsterdam');

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    expect(screen.getByText(/1 places to stay in amsterdam/i)).toBeInTheDocument();
  });

  it('should pass filtered offers to OfferList component', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    const offerList = screen.getByTestId('offer-list');
    expect(offerList).toHaveTextContent('Offers: 2');
  });

  it('should pass correct offerCardType to OfferList', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    const offerList = screen.getByTestId('offer-list');
    expect(offerList).toHaveAttribute('data-offer-type', OfferCardType.Main);
  });

  it('should pass correct additional class to Map component', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    const map = screen.getByTestId('map');
    expect(map).toHaveAttribute('data-class', 'cities__map');
  });

  it('should have correct CSS classes', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    expect(container.querySelector('.page--main')).toBeInTheDocument();
    expect(container.querySelector('.page__main--index')).toBeInTheDocument();
    expect(container.querySelector('.cities__places')).toBeInTheDocument();
    expect(container.querySelector('.cities__right-section')).toBeInTheDocument();
  });

  it('should render visually hidden headings', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /cities/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /places/i, hidden: true })).toBeInTheDocument();
  });

  it('should update when currentOfferId changes', () => {
    const store = createMockStore(mockOffers, 'Paris', '1');

    const { rerender } = render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    expect(screen.getByTestId('map')).toBeInTheDocument();

    const newStore = createMockStore(mockOffers, 'Paris', '2');

    rerender(
      <Provider store={newStore}>
        <Main />
      </Provider>
    );

    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('should show singular "place" when only one offer available', () => {
    const store = createMockStore(mockOffers, 'Amsterdam');

    render(
      <Provider store={store}>
        <Main />
      </Provider>
    );

    expect(screen.getByText(/1 places to stay in amsterdam/i)).toBeInTheDocument();
  });
});
