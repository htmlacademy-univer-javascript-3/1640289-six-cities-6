import { createReducer } from '@reduxjs/toolkit';

import { setCity, setOffers } from './action';
import { offerMocks } from '../mocks/offer.ts';
import { City } from '../mocks/city.ts';

const stateType = {
  city: City.Paris,
  offers: offerMocks
};

export const reducer = createReducer(stateType, (builder) => {
  builder
    .addCase(setCity, (state, { payload }) => {
      state.city = payload;
    })
    .addCase(setOffers, (state) => {
      state.offers = offerMocks;
    });
});
