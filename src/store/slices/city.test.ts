import cityReducer, { setCity } from './city.ts';
import { OfferCity } from '../../shared/types/offer';

const initialState = {
  city: { name: '', location: { latitude: 0, longitude: 0, zoom: 0 } },
};

describe('citySlice', () => {
  it('should return the initial state', () => {
    expect(cityReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle setCity action', () => {
    const newCity: OfferCity = {
      name: 'Moscow',
      location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 },
    };

    const action = setCity(newCity);
    const expectedState = {
      city: newCity,
    };

    expect(cityReducer(initialState, action)).toEqual(expectedState);
  });
});
