import currentOfferReducer, {
  setCurrentOffer,
  setCurrentOfferId,
  setCurrentOfferLoading,
  setCurrentOfferFeedbacks,
  setCurrentOfferNearbyOffers,
} from './current-offer.ts';
import { AdditionalOfferInfo, MainOfferInfo, OfferFeedback } from '../../shared/types/offer.ts';

const initialState = {
  currentOffer: null,
  currentOfferId: undefined,
  currentOfferLoading: false,
  currentOfferFeedbacks: [],
  currentOfferNearby: [],
};

describe('currentOfferSlice', () => {
  it('should return the initial state', () => {
    expect(currentOfferReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle setCurrentOffer action', () => {
    const newOffer: AdditionalOfferInfo = {
      id: '1',
      title: 'Offer 1',
      type: 'apartment',
      price: 100,
      city: { name: 'City', location: { latitude: 52.52, longitude: 13.4050, zoom: 10 } },
      location: { latitude: 52.52, longitude: 13.4050, zoom: 10 },
      isFavorite: false,
      isPremium: true,
      rating: 4.5,
      description: 'Description of offer 1',
      bedrooms: 2,
      goods: ['TV', 'Washing machine'],
      host: {
        name: 'Host Name',
        avatarUrl: 'https://example.com/avatar.jpg',
        isPro: true,
      },
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      maxAdults: 4,
    };

    const action = setCurrentOffer(newOffer);
    const expectedState = {
      ...initialState,
      currentOffer: newOffer,
    };

    expect(currentOfferReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle setCurrentOfferId action', () => {
    const offerId = '123';
    const action = setCurrentOfferId(offerId);
    const expectedState = {
      ...initialState,
      currentOfferId: offerId,
    };

    expect(currentOfferReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle setCurrentOfferLoading action', () => {
    const loadingState = true;
    const action = setCurrentOfferLoading(loadingState);
    const expectedState = {
      ...initialState,
      currentOfferLoading: loadingState,
    };

    expect(currentOfferReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle setCurrentOfferFeedbacks action', () => {
    const feedbacks: OfferFeedback[] = [
      {
        id: 'feedback1',
        date: '2025-12-28',
        user: { name: 'User1', avatarUrl: 'https://example.com/avatar1.jpg', isPro: true },
        comment: 'Great offer',
        rating: 5,
      },
      {
        id: 'feedback2',
        date: '2025-12-27',
        user: { name: 'User2', avatarUrl: 'https://example.com/avatar2.jpg', isPro: false },
        comment: 'Not bad',
        rating: 3,
      },
    ];
    const action = setCurrentOfferFeedbacks(feedbacks);
    const expectedState = {
      ...initialState,
      currentOfferFeedbacks: feedbacks,
    };

    expect(currentOfferReducer(initialState, action)).toEqual(expectedState);
  });

  it('should handle setCurrentOfferNearbyOffers action', () => {
    const nearbyOffers: MainOfferInfo[] = [
      {
        id: '2',
        title: 'Nearby Offer 1',
        type: 'house',
        price: 120,
        city: { name: 'City 1', location: { latitude: 53.52, longitude: 13.4050, zoom: 10 } },
        location: { latitude: 53.52, longitude: 13.4050, zoom: 10 },
        isFavorite: true,
        isPremium: false,
        rating: 4.0,
        previewImage: 'https://example.com/nearby1.jpg',
      },
      {
        id: '3',
        title: 'Nearby Offer 2',
        type: 'apartment',
        price: 90,
        city: { name: 'City 2', location: { latitude: 54.52, longitude: 13.4050, zoom: 10 } },
        location: { latitude: 54.52, longitude: 13.4050, zoom: 10 },
        isFavorite: false,
        isPremium: true,
        rating: 4.2,
        previewImage: 'https://example.com/nearby2.jpg',
      },
    ];
    const action = setCurrentOfferNearbyOffers(nearbyOffers);
    const expectedState = {
      ...initialState,
      currentOfferNearby: nearbyOffers,
    };

    expect(currentOfferReducer(initialState, action)).toEqual(expectedState);
  });
});
