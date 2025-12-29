import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { OfferList } from './offer-list.tsx';
import { OfferCardType } from '../../../shared/constants/offer.ts';
import { MainOfferInfo } from '../../../shared/types/offer.ts';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';

vi.mock('../offer-card/offer-card.tsx', () => ({
  OfferCard: ({ id, offerData, handleActiveCardIdChange }: {id: string; offerData: MainOfferInfo; handleActiveCardIdChange: (newActiveCardId: string) => void}) => (
    <div data-testid={`offer-card-${id}`} onClick={() => handleActiveCardIdChange(id)}>
      {offerData.title}
    </div>
  ),
}));

vi.mock('../../../store/slices/current-offer', () => ({
  setCurrentOfferId: vi.fn((id: string) => ({ type: 'SET_CURRENT_OFFER_ID', payload: id })),
}));

describe('OfferList', () => {
  const mockOffers: MainOfferInfo[] = [
    {
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
    },
    {
      id: '2',
      title: 'Cozy house',
      type: 'house',
      price: 200,
      city: {
        name: 'Amsterdam',
        location: { latitude: 52.370216, longitude: 4.895168, zoom: 10 }
      },
      location: { latitude: 52.369553943508, longitude: 4.85309666406198, zoom: 8 },
      isFavorite: true,
      isPremium: true,
      rating: 4.8,
      previewImage: 'img/house-01.jpg'
    },
  ];

  let store: ToolkitStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        currentOffer: (state: {id: string | null} = { id: null }) => state,
      },
    });
  });

  it('renders all offers', () => {
    render(
      <Provider store={store}>
        <OfferList offers={mockOffers} offerCardType={OfferCardType.Main} />
      </Provider>
    );

    expect(screen.getByTestId('offer-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('offer-card-2')).toBeInTheDocument();
    expect(screen.getByText('Beautiful apartment')).toBeInTheDocument();
    expect(screen.getByText('Cozy house')).toBeInTheDocument();
  });

  it('renders with correct container class for main type', () => {
    const { container } = render(
      <Provider store={store}>
        <OfferList offers={mockOffers} offerCardType={OfferCardType.Main} />
      </Provider>
    );

    const listContainer = container.querySelector('.cities__places-list.places__list.tabs__content');
    expect(listContainer).toBeInTheDocument();
  });

  it('renders with correct container class for offer type', () => {
    const { container } = render(
      <Provider store={store}>
        <OfferList offers={mockOffers} offerCardType={OfferCardType.Offer} />
      </Provider>
    );

    const listContainer = container.querySelector('.near-places__list.places__list');
    expect(listContainer).toBeInTheDocument();
  });

  it('renders with correct container class for favorites type', () => {
    const { container } = render(
      <Provider store={store}>
        <OfferList offers={mockOffers} offerCardType={OfferCardType.Favorites} />
      </Provider>
    );

    const listContainer = container.querySelector('.favorites__places');
    expect(listContainer).toBeInTheDocument();
  });

  it('renders empty list when no offers provided', () => {
    const { container } = render(
      <Provider store={store}>
        <OfferList offers={[]} offerCardType={OfferCardType.Main} />
      </Provider>
    );

    const listContainer = container.querySelector('.cities__places-list');
    expect(listContainer?.children.length).toBe(0);
  });

  it('dispatches setCurrentOfferId when card is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <OfferList offers={mockOffers} offerCardType={OfferCardType.Main} />
      </Provider>
    );

    const firstCard = screen.getByTestId('offer-card-1');
    firstCard.click();

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('passes correct props to OfferCard components', () => {
    render(
      <Provider store={store}>
        <OfferList offers={mockOffers} offerCardType={OfferCardType.Main} />
      </Provider>
    );

    const cards = screen.getAllByTestId(/offer-card-/);
    expect(cards).toHaveLength(2);
  });
});
