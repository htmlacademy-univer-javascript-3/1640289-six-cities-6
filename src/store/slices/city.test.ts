import cityReducer, { setCity } from './city.ts';
import { OfferCity } from '../../shared/types/offer';

const INITIAL_STATE = {
  city: { name: '', location: { latitude: 0, longitude: 0, zoom: 0 } },
};

describe('citySlice', () => {
  it('should return the initial state', () => {
    expect(cityReducer(undefined, { type: undefined })).toEqual(INITIAL_STATE);
  });

  it('should handle setCity action', () => {
    const NEW_CITY: OfferCity = {
      name: 'Moscow',
      location: { latitude: 55.7558, longitude: 37.6176, zoom: 10 },
    };

    const action = setCity(NEW_CITY);
    const expectedState = {
      city: NEW_CITY,
    };

    expect(cityReducer(INITIAL_STATE, action)).toEqual(expectedState);
  });
});
