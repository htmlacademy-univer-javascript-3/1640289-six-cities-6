import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Favorites } from './favorites';
import * as citySlice from '../../store/slices/city';
import { MainOfferInfo, OfferCity } from '../../shared/types/offer';

vi.mock('../../components/header.tsx', () => ({
  Header: () => <div>Header</div>,
}));

vi.mock('../offer/components/offer-list.tsx', () => ({
  OfferList: ({ offers }: { offers: MainOfferInfo[] }) => (
    <div data-testid="offer-list">Offers: {offers.length}</div>
  ),
}));

vi.mock('./components/favorite-empty.tsx', () => ({
  FavoriteEmpty: () => <div>No favorites</div>,
}));

vi.mock('../../store/slices/city', () => ({
  setCity: vi.fn((city: OfferCity) => ({ type: 'city/setCity', payload: city })),
}));

describe('Favorites', () => {
  const mockCity1: OfferCity = {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13,
    },
  };

  const mockCity2: OfferCity = {
    name: 'Amsterdam',
    location: {
      latitude: 52.370216,
      longitude: 4.895168,
      zoom: 13,
    },
  };

  const mockOffers: MainOfferInfo[] = [
    {
      id: '1',
      title: 'Offer 1',
      type: 'apartment',
      price: 120,
      city: mockCity1,
      location: mockCity1.location,
      isFavorite: true,
      isPremium: false,
      rating: 4.5,
      previewImage: 'img1.jpg',
    },
    {
      id: '2',
      title: 'Offer 2',
      type: 'house',
      price: 200,
      city: mockCity1,
      location: mockCity1.location,
      isFavorite: true,
      isPremium: true,
      rating: 4.8,
      previewImage: 'img2.jpg',
    },
    {
      id: '3',
      title: 'Offer 3',
      type: 'room',
      price: 80,
      city: mockCity2,
      location: mockCity2.location,
      isFavorite: true,
      isPremium: false,
      rating: 4.2,
      previewImage: 'img3.jpg',
    },
  ];

  const createMockStore = (offerFavorites: MainOfferInfo[] = []) => configureStore({
    reducer: {
      favorites: () => ({ offerFavorites }),
    },
  });

  const renderWithProviders = (component: React.ReactElement, store: ReturnType<typeof createMockStore>) => render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('it should display FavoriteEmpty when there are no favorite offers', () => {
    const store = createMockStore([]);

    renderWithProviders(<Favorites />, store);

    expect(screen.getByText('No favorites')).toBeInTheDocument();
  });

  it('it should display the "Saved listing" header', () => {
    const store = createMockStore(mockOffers);

    renderWithProviders(<Favorites />, store);

    expect(screen.getByText('Saved listing')).toBeInTheDocument();
  });

  it('the Header component must display', () => {
    const store = createMockStore(mockOffers);

    renderWithProviders(<Favorites />, store);

    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('it should display a footer with a logo', () => {
    const store = createMockStore(mockOffers);

    renderWithProviders(<Favorites />, store);

    const logo = screen.getByAltText('6 cities logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('width', '64');
    expect(logo).toHaveAttribute('height', '33');
  });

  it('must group offers by city', () => {
    const store = createMockStore(mockOffers);

    renderWithProviders(<Favorites />, store);

    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('I have to sort the cities alphabetically', () => {
    const store = createMockStore(mockOffers);

    renderWithProviders(<Favorites />, store);

    const cityLinks = screen.getAllByRole('link', { name: /Amsterdam|Paris/i });
    expect(cityLinks[0]).toHaveTextContent('Amsterdam');
    expect(cityLinks[1]).toHaveTextContent('Paris');
  });

  it('it should display an OfferList for each city', () => {
    const store = createMockStore(mockOffers);

    renderWithProviders(<Favorites />, store);

    const offerLists = screen.getAllByTestId('offer-list');
    expect(offerLists).toHaveLength(2);
    expect(offerLists[0]).toHaveTextContent('Offers: 1');
    expect(offerLists[1]).toHaveTextContent('Offers: 2');
  });

  it('it should call setCity when clicking on a city', async () => {
    const user = userEvent.setup();
    const store = createMockStore(mockOffers);
    const setCitySpy = vi.spyOn(citySlice, 'setCity');

    renderWithProviders(<Favorites />, store);

    const parisLink = screen.getByText('Paris');
    await user.click(parisLink);

    expect(setCitySpy).toHaveBeenCalledWith(mockCity1);
  });

  it('It must contain links to the main page for cities', () => {
    const store = createMockStore(mockOffers);

    renderWithProviders(<Favorites />, store);

    const cityLinks = screen.getAllByRole('link', { name: /Amsterdam|Paris/i });
    cityLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/');
    });
  });

  it('One city with several offers must be processed correctly', () => {
    const singleCityOffers = mockOffers.filter((offer) => offer.city.name === 'Paris');
    const store = createMockStore(singleCityOffers);

    renderWithProviders(<Favorites />, store);

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.queryByText('Amsterdam')).not.toBeInTheDocument();

    const offerLists = screen.getAllByTestId('offer-list');
    expect(offerLists).toHaveLength(1);
    expect(offerLists[0]).toHaveTextContent('Offers: 2');
  });

  it('It must display the correct page structure', () => {
    const store = createMockStore(mockOffers);

    const { container } = renderWithProviders(<Favorites />, store);

    expect(container.querySelector('.page')).toBeInTheDocument();
    expect(container.querySelector('.page__main--favorites')).toBeInTheDocument();
    expect(container.querySelector('.favorites')).toBeInTheDocument();
    expect(container.querySelector('.favorites__list')).toBeInTheDocument();
    expect(container.querySelector('.footer')).toBeInTheDocument();
  });
});
