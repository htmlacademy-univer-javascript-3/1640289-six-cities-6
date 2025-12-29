import { describe, it, expect, vi } from 'vitest';
import offersReducer, { setOffers, setInitialOffers, setOffersLoading } from './offer.ts';
import { MainOfferInfo } from '../../shared/types/offer.ts';
import { OffersSortType } from '../../shared/constants/offer.ts';

vi.mock('../../shared/utils/offer.ts', () => ({
  getSortedOffers: vi.fn(),
}));

describe('offersSlice reducer', () => {
  const INITIAL_STATE = {
    initialOffers: [],
    offers: [],
    offersLoading: true,
    offersSort: OffersSortType.Popular,
  };

  const SAMPLE_OFFERS: MainOfferInfo[] = [
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
    expect(offersReducer(undefined, { type: undefined })).toEqual(INITIAL_STATE);
  });

  it('should handle setInitialOffers', () => {
    expect(offersReducer(INITIAL_STATE, setInitialOffers(SAMPLE_OFFERS))).toEqual({
      ...INITIAL_STATE,
      initialOffers: SAMPLE_OFFERS,
    });
  });

  it('should handle setOffers', () => {
    expect(offersReducer(INITIAL_STATE, setOffers(SAMPLE_OFFERS))).toEqual({
      ...INITIAL_STATE,
      offers: SAMPLE_OFFERS,
    });
  });

  it('should handle setOffersLoading', () => {
    const LOADING_STATE = false;
    expect(offersReducer(INITIAL_STATE, setOffersLoading(LOADING_STATE))).toEqual({
      ...INITIAL_STATE,
      offersLoading: LOADING_STATE,
    });
  });
});
