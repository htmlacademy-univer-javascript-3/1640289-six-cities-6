import { describe, it, expect, vi } from 'vitest';
import offersReducer, { setOffers, setInitialOffers, setOffersLoading } from './offer.ts';
import { MainOfferInfo } from '../../shared/types/offer.ts';
import { OffersSortType } from '../../shared/constants/offer.ts';

vi.mock('../../shared/utils/offer.ts', () => ({
  getSortedOffers: vi.fn(),
}));

describe('offersSlice reducer', () => {
  const initialState = {
    initialOffers: [],
    offers: [],
    offersLoading: true,
    offersSort: OffersSortType.Popular,
  };

  const sampleOffers: MainOfferInfo[] = [
    {
      id: '1',
      title: 'Offer 1',
      type: 'apartment',
      price: 100,
      city: { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 } },
      location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
      isFavorite: false,
      isPremium: true,
      rating: 4.5,
      previewImage: 'image1.jpg',
    },
    {
      id: '2',
      title: 'Offer 2',
      type: 'house',
      price: 200,
      city: { name: 'Berlin', location: { latitude: 52.5200, longitude: 13.4050, zoom: 10 } },
      location: { latitude: 52.5200, longitude: 13.4050, zoom: 10 },
      isFavorite: true,
      isPremium: false,
      rating: 4.0,
      previewImage: 'image2.jpg',
    },
  ];

  it('should return the initial state', () => {
    expect(offersReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle setInitialOffers', () => {
    expect(offersReducer(initialState, setInitialOffers(sampleOffers))).toEqual({
      ...initialState,
      initialOffers: sampleOffers,
    });
  });

  it('should handle setOffers', () => {
    expect(offersReducer(initialState, setOffers(sampleOffers))).toEqual({
      ...initialState,
      offers: sampleOffers,
    });
  });

  it('should handle setOffersLoading', () => {
    const loadingState = false;
    expect(offersReducer(initialState, setOffersLoading(loadingState))).toEqual({
      ...initialState,
      offersLoading: loadingState,
    });
  });
});
