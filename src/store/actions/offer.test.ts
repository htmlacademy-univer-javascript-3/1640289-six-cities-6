import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosInstance } from 'axios';
import {
  fetchOffers,
  fetchReviews,
  fetchNearby,
  fetchCurrentOffer,
  postReview,
  fetchFavorites,
  setBookmarkOffer,
} from './offer';
import * as citySlice from '../slices/city';
import * as offerSlice from '../slices/offer';
import * as currentOfferSlice from '../slices/current-offer';
import * as favoriteSlice from '../slices/favorite';
import {MainOfferInfo, AdditionalOfferInfo, OfferFeedback, OfferCity} from '../../shared/types/offer';
import { FeedbackInfo } from '../../shared/types/user';
import { RoutePath } from '../../shared/constants/router';

vi.mock('../../shared/utils/api', () => ({
  ApiEndpoint: {
    Offers: '/offers',
    Feedbacks: '/comments',
    Favorites: '/favorite',
    Nearby: 'nearby',
  },
}));

vi.mock('../slices/city', () => ({
  setCity: vi.fn((city: OfferCity) => ({ type: 'city/setCity', payload: city })),
}));

vi.mock('../slices/offer', () => ({
  setOffers: vi.fn((offers: MainOfferInfo[]) => ({ type: 'offer/setOffers', payload: offers })),
  setInitialOffers: vi.fn((offers: MainOfferInfo[]) => ({ type: 'offer/setInitialOffers', payload: offers })),
  setOffersLoading: vi.fn((loading: boolean) => ({ type: 'offer/setOffersLoading', payload: loading })),
}));

vi.mock('../slices/current-offer', () => ({
  setCurrentOffer: vi.fn((offer: AdditionalOfferInfo) => ({ type: 'currentOffer/setCurrentOffer', payload: offer })),
  setCurrentOfferFeedbacks: vi.fn((feedbacks: OfferFeedback[]) => ({ type: 'currentOffer/setCurrentOfferFeedbacks', payload: feedbacks })),
  setCurrentOfferLoading: vi.fn((loading: boolean) => ({ type: 'currentOffer/setCurrentOfferLoading', payload: loading })),
  setCurrentOfferNearbyOffers: vi.fn((offers: MainOfferInfo[]) => ({ type: 'currentOffer/setCurrentOfferNearbyOffers', payload: offers })),
}));

vi.mock('../slices/favorite', () => ({
  setFavorites: vi.fn((favorites: MainOfferInfo[]) => ({ type: 'favorite/setFavorites', payload: favorites })),
}));

describe('Offer Actions', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();
  const mockGetState = vi.fn();

  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
  } as unknown as AxiosInstance;

  const MOCK_CITY = {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 13,
    },
  };

  const MOCK_OFFERS: MainOfferInfo[] = [
    {
      id: '1',
      title: 'Offer 1',
      type: 'apartment',
      price: 120,
      city: MOCK_CITY,
      location: MOCK_CITY.location,
      isFavorite: false,
      isPremium: false,
      rating: 4.5,
      previewImage: 'img1.jpg',
    },
    {
      id: '2',
      title: 'Offer 2',
      type: 'house',
      price: 200,
      city: MOCK_CITY,
      location: MOCK_CITY.location,
      isFavorite: true,
      isPremium: true,
      rating: 4.8,
      previewImage: 'img2.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchOffers', () => {
    it('must download the offers and set the city', async () => {
      (mockApi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_OFFERS });

      const action = fetchOffers();
      await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.get).toHaveBeenCalledWith('offers');
      expect(citySlice.setCity).toHaveBeenCalledWith(MOCK_CITY);
      expect(offerSlice.setOffers).toHaveBeenCalledWith(MOCK_OFFERS);
      expect(offerSlice.setInitialOffers).toHaveBeenCalledWith(MOCK_OFFERS);
      expect(offerSlice.setOffersLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('fetchReviews', () => {
    const MOCK_REVIEWS: OfferFeedback[] = [
      {
        id: '1',
        comment: 'Great place!',
        date: '2024-01-01',
        rating: 5,
        user: {
          name: 'John Doe',
          avatarUrl: 'avatar.jpg',
          isPro: false,
        },
      },
    ];

    it('must upload reviews for suggestions', async () => {
      (mockApi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_REVIEWS });

      const action = fetchReviews({ offerId: '1' });
      const result = await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.get).toHaveBeenCalledWith('comments/1');
      expect(currentOfferSlice.setCurrentOfferFeedbacks).toHaveBeenCalledWith(MOCK_REVIEWS);
      expect(result.payload).toEqual(MOCK_REVIEWS);
    });

    it('should return rejectWithValue in case of error', async () => {
      (mockApi.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed'));

      const action = fetchReviews({ offerId: '1' });
      const result = await action(mockDispatch, mockGetState, mockApi);

      expect(result.payload).toBeNull();
    });
  });

  describe('fetchNearby', () => {
    it('must upload the next offers', async () => {
      const nearbyOffers = [MOCK_OFFERS[1]];
      (mockApi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: nearbyOffers });

      const action = fetchNearby({ offerId: '1' });
      const result = await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.get).toHaveBeenCalledWith('offers/1/nearby');
      expect(currentOfferSlice.setCurrentOfferNearbyOffers).toHaveBeenCalledWith(nearbyOffers);
      expect(result.payload).toEqual(nearbyOffers);
    });

    it('should return rejectWithValue in case of error', async () => {
      (mockApi.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed'));

      const action = fetchNearby({ offerId: '1' });
      const result = await action(mockDispatch, mockGetState, mockApi);

      expect(result.payload).toBe('Failed to fetch nearby offers');
    });
  });

  describe('fetchCurrentOffer', () => {
    const MOCK_ADDITIONAL_OFFER: AdditionalOfferInfo = {
      id: '1',
      title: 'Beautiful Apartment',
      type: 'apartment',
      price: 120,
      city: MOCK_CITY,
      location: MOCK_CITY.location,
      isFavorite: false,
      isPremium: false,
      rating: 4.5,
      description: 'A nice place',
      bedrooms: 2,
      goods: ['Wi-Fi', 'Kitchen'],
      host: {
        name: 'Host',
        avatarUrl: 'host.jpg',
        isPro: true,
      },
      images: ['img1.jpg', 'img2.jpg'],
      maxAdults: 4,
    };

    it('must download the current offer and related data', async () => {
      (mockApi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_ADDITIONAL_OFFER });

      const action = fetchCurrentOffer({ offerId: '1', navigate: mockNavigate });
      const result = await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.get).toHaveBeenCalledWith('offers/1');
      expect(currentOfferSlice.setCurrentOfferLoading).toHaveBeenCalledWith(true);
      expect(currentOfferSlice.setCurrentOffer).toHaveBeenCalledWith(MOCK_ADDITIONAL_OFFER);
      expect(currentOfferSlice.setCurrentOfferLoading).toHaveBeenCalledWith(false);
      expect(result.payload).toEqual(MOCK_ADDITIONAL_OFFER);
    });

    it('it should redirect to NotFound in case of an error', async () => {
      (mockApi.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Not found'));

      const action = fetchCurrentOffer({ offerId: '999', navigate: mockNavigate });
      const result = await action(mockDispatch, mockGetState, mockApi);

      expect(mockNavigate).toHaveBeenCalledWith(RoutePath.NotFound);
      expect(currentOfferSlice.setCurrentOfferLoading).toHaveBeenCalledWith(false);
      expect(result.payload).toBeNull();
    });

    it('must set loading to false even in case of an error', async () => {
      (mockApi.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Error'));

      const action = fetchCurrentOffer({ offerId: '1', navigate: mockNavigate });
      await action(mockDispatch, mockGetState, mockApi);

      const loadingCalls = (currentOfferSlice.setCurrentOfferLoading as unknown as ReturnType<typeof vi.fn>).mock.calls;
      expect(loadingCalls[0][0]).toBe(true);
      expect(loadingCalls[1][0]).toBe(false);
    });
  });

  describe('postReview', () => {
    const MOCK_FEEDBACK_INFO: FeedbackInfo = {
      comment: 'Great place!',
      rating: 5,
      offerId: '1',
    };

    it('must submit a review and upload the updated reviews', async () => {
      (mockApi.post as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const action = postReview(MOCK_FEEDBACK_INFO);
      await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.post).toHaveBeenCalledWith('comments/1', {
        comment: 'Great place!',
        rating: 5,
      });
    });
  });

  describe('fetchFavorites', () => {
    it('must upload your favorite offers', async () => {
      const favoriteOffers = [MOCK_OFFERS[1]];
      (mockApi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: favoriteOffers });

      const action = fetchFavorites();
      const result = await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.get).toHaveBeenCalledWith('favorite');
      expect(favoriteSlice.setFavorites).toHaveBeenCalledWith(favoriteOffers);
      expect(result.payload).toEqual(favoriteOffers);
    });
  });

  describe('setBookmarkOffer', () => {
    const MOCK_ADDITIONAL_OFFER: AdditionalOfferInfo = {
      ...MOCK_OFFERS[0],
      description: 'Description',
      bedrooms: 2,
      goods: ['Wi-Fi'],
      host: {
        name: 'Host',
        avatarUrl: 'host.jpg',
        isPro: true,
      },
      images: ['img1.jpg'],
      maxAdults: 4,
    };

    it('I have to add a suggestion to my favorites', async () => {
      (mockApi.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_ADDITIONAL_OFFER });

      const action = setBookmarkOffer({ offer: MOCK_OFFERS[0], status: 1 });
      const result = await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.post).toHaveBeenCalledWith('favorite/1/1');
      expect(result.payload).toEqual(MOCK_ADDITIONAL_OFFER);
    });

    it('must delete the sentence from favorites', async () => {
      (mockApi.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_ADDITIONAL_OFFER });

      const action = setBookmarkOffer({ offer: MOCK_OFFERS[1], status: 0 });
      await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.post).toHaveBeenCalledWith('favorite/2/0');
    });
  });

  describe('Integration scenarios', () => {
    it('must upload full information about the offer with reviews and the nearest', async () => {
      const MOCK_ADDITIONAL_OFFER: AdditionalOfferInfo = {
        ...MOCK_OFFERS[0],
        description: 'Description',
        bedrooms: 2,
        goods: ['Wi-Fi'],
        host: {
          name: 'Host',
          avatarUrl: 'host.jpg',
          isPro: true,
        },
        images: ['img1.jpg'],
        maxAdults: 4,
      };

      (mockApi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_ADDITIONAL_OFFER });

      const action = fetchCurrentOffer({ offerId: '1', navigate: mockNavigate });
      await action(mockDispatch, mockGetState, mockApi);

      expect(currentOfferSlice.setCurrentOffer).toHaveBeenCalledWith(MOCK_ADDITIONAL_OFFER);
      expect(currentOfferSlice.setCurrentOfferLoading).toHaveBeenCalledTimes(2);
    });

    it('must update favorites after status change', async () => {
      const MOCK_ADDITIONAL_OFFER: AdditionalOfferInfo = {
        ...MOCK_OFFERS[0],
        description: 'Description',
        bedrooms: 2,
        goods: ['Wi-Fi'],
        host: {
          name: 'Host',
          avatarUrl: 'host.jpg',
          isPro: true,
        },
        images: ['img1.jpg'],
        maxAdults: 4,
      };

      (mockApi.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_ADDITIONAL_OFFER });

      const action = setBookmarkOffer({ offer: MOCK_OFFERS[0], status: 1 });
      await action(mockDispatch, mockGetState, mockApi);

      expect(mockApi.post).toHaveBeenCalledWith('favorite/1/1');
    });
  });
});
