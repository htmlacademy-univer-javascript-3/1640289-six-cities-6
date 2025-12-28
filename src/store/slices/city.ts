import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OfferCity } from '../../shared/types/offer';

interface CityState {
  city: OfferCity;
}

const INITIAL_STATE: CityState = {
  city: { name: '', location: { latitude: 0, longitude: 0, zoom: 0 } },
};

const citySlice = createSlice({
  name: 'city',
  initialState: INITIAL_STATE,
  reducers: {
    setCity(state, action: PayloadAction<OfferCity>) {
      state.city = action.payload;
    },
  },
});

export const { setCity } = citySlice.actions;
export default citySlice.reducer;
