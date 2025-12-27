import { createReducer } from '@reduxjs/toolkit';

import { setCity, setCurrentOfferId, setOffers, setOffersSort } from './action';
import { offerMocks } from '../mocks/offer.ts';
import { City } from '../mocks/city.ts';
import { OffersSortType } from '../shared/constants/offer.ts';
import { DetailedOffer } from '../shared/types/offer.ts';
import { getSortedOffers } from '../shared/utils/offer.ts';

interface StateType {
  city: City;
  offers: DetailedOffer[];
  offersSort: OffersSortType;
  currentOfferId?: string;
}

const stateType: StateType = {
  city: City.Paris,
  offers: offerMocks,
  offersSort: OffersSortType.Popular,
  currentOfferId: undefined
};

export const reducer = createReducer(stateType, (builder) => {
  builder
    .addCase(setCity, (state, { payload }) => {
      state.city = payload;
    })
    .addCase(setOffers, (state) => {
      state.offers = offerMocks;
    })
    .addCase(setCurrentOfferId, (state, { payload }) => {
      state.currentOfferId = payload;
    })
    .addCase(setOffersSort, (state, { payload }) => {
      state.offersSort = payload;

      const offersToSort = [...offerMocks];

      state.offers = getSortedOffers(payload, offersToSort);
    });
});
