import currentOfferReducer, {
  setCurrentOffer,
  setCurrentOfferId,
  setCurrentOfferLoading,
  setCurrentOfferFeedbacks,
  setCurrentOfferNearbyOffers,
} from './current-offer.ts';
import { AdditionalOfferInfo, MainOfferInfo, OfferFeedback } from '../../shared/types/offer.ts';

const INITIAL_STATE = {
  currentOffer: null,
  currentOfferId: undefined,
  currentOfferLoading: false,
  currentOfferFeedbacks: [],
  currentOfferNearby: [],
};

describe('currentOfferSlice', () => {
  it('should return the initial state', () => {
    expect(currentOfferReducer(undefined, { type: undefined })).toEqual(INITIAL_STATE);
  });

  it('should handle setCurrentOffer action', () => {
    const NEW_OFFER: AdditionalOfferInfo = {
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

    const action = setCurrentOffer(NEW_OFFER);
    const EXPECTED_STATE = {
      ...INITIAL_STATE,
      currentOffer: NEW_OFFER,
    };

    expect(currentOfferReducer(INITIAL_STATE, action)).toEqual(EXPECTED_STATE);
  });

  it('should handle setCurrentOfferId action', () => {
    const OFFER_ID = '123';
    const action = setCurrentOfferId(OFFER_ID);
    const EXPECTED_STATE = {
      ...INITIAL_STATE,
      currentOfferId: OFFER_ID,
    };

    expect(currentOfferReducer(INITIAL_STATE, action)).toEqual(EXPECTED_STATE);
  });

  it('should handle setCurrentOfferLoading action', () => {
    const LOADING_STATE = true;
    const action = setCurrentOfferLoading(LOADING_STATE);
    const EXPECTED_STATE = {
      ...INITIAL_STATE,
      currentOfferLoading: LOADING_STATE,
    };

    expect(currentOfferReducer(INITIAL_STATE, action)).toEqual(EXPECTED_STATE);
  });

  it('should handle setCurrentOfferFeedbacks action', () => {
    const FEEDBACKS: OfferFeedback[] = [
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
    const action = setCurrentOfferFeedbacks(FEEDBACKS);
    const EXPECTED_STATE = {
      ...INITIAL_STATE,
      currentOfferFeedbacks: FEEDBACKS,
    };

    expect(currentOfferReducer(INITIAL_STATE, action)).toEqual(EXPECTED_STATE);
  });

  it('should handle setCurrentOfferNearbyOffers action', () => {
    const NEARBY_OFFERS: MainOfferInfo[] = [
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
    const action = setCurrentOfferNearbyOffers(NEARBY_OFFERS);
    const EXPECTED_STATE = {
      ...INITIAL_STATE,
      currentOfferNearby: NEARBY_OFFERS,
    };

    expect(currentOfferReducer(INITIAL_STATE, action)).toEqual(EXPECTED_STATE);
  });
});
