import favoritesReducer, { setFavorites } from './favorite.ts';
import { MainOfferInfo } from '../../shared/types/offer.ts';

const INITIAL_STATE = {
  offerFavorites: [],
};

describe('favoritesSlice', () => {
  it('should return the initial state', () => {
    expect(favoritesReducer(undefined, { type: undefined })).toEqual(INITIAL_STATE);
  });

  it('should handle setFavorites action', () => {
    const FAVORITE_OFFERS: MainOfferInfo[] = [
      {
        id: '1',
        title: 'Favorite Offer 1',
        type: 'apartment',
        price: 100,
        city: { name: 'City 1', location: { latitude: 52.52, longitude: 13.4050, zoom: 10 } },
        location: { latitude: 52.52, longitude: 13.4050, zoom: 10 },
        isFavorite: true,
        isPremium: true,
        rating: 4.5,
        previewImage: 'https://example.com/favorite1.jpg',
      },
      {
        id: '2',
        title: 'Favorite Offer 2',
        type: 'house',
        price: 150,
        city: { name: 'City 2', location: { latitude: 53.52, longitude: 13.4050, zoom: 10 } },
        location: { latitude: 53.52, longitude: 13.4050, zoom: 10 },
        isFavorite: true,
        isPremium: false,
        rating: 4.2,
        previewImage: 'https://example.com/favorite2.jpg',
      },
    ];

    const action = setFavorites(FAVORITE_OFFERS);
    const expectedState = {
      offerFavorites: FAVORITE_OFFERS,
    };

    expect(favoritesReducer(INITIAL_STATE, action)).toEqual(expectedState);
  });
});
