import { createReducer } from '@reduxjs/toolkit';

import {setCity, setCurrentOfferId, setIsLoading, setOffers, setOffersSort} from './action';
import { offerMocks } from '../mocks/offer.ts';
import { OffersSortType } from '../shared/constants/offer.ts';
import { MainOfferInfo, OfferCity} from '../shared/types/offer.ts';
import { getSortedOffers } from '../shared/utils/offer.ts';

export interface StateType {
  city: OfferCity;
  isLoading: boolean;
  offers: MainOfferInfo[];
  offersSort: OffersSortType;
  currentOfferId?: string;
}

const stateType: StateType = {
  city: { name: '', location: { latitude: 0, longitude: 0, zoom: 0 } },
  isLoading: true,
  offers: [],
  offersSort: OffersSortType.Popular,
  currentOfferId: undefined
};

export const reducer = createReducer(stateType, (builder) => {
  builder
    .addCase(setCity, (state, { payload }) => {
      state.city = payload;
    })
    .addCase(setOffers, (state, { payload }) => {
      state.offers = payload;
    })
    .addCase(setCurrentOfferId, (state, { payload }) => {
      state.currentOfferId = payload;
    })
    .addCase(setOffersSort, (state, { payload }) => {
      state.offersSort = payload;

      const offersToSort = [...state.offers];

      state.offers = getSortedOffers(payload, offersToSort);
    })
    .addCase(setIsLoading, (state, { payload }) => {
      state.isLoading = payload;
    });
});
