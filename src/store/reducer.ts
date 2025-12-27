import { createReducer } from '@reduxjs/toolkit';

import {
  setAuthStatus,
  setCity,
  setCurrentOfferId, setCurrentOfferLoading, setCurrentOfferFeedbacks,
  setIsLoading,
  setName,
  setOffers,
  setOffersLoading,
  setOffersSort, setCurrentOfferNearbyOffers, setCurrentOffer
} from './action';
import { OffersSortType } from '../shared/constants/offer.ts';
import {AdditionalOfferInfo, MainOfferInfo, OfferCity, OfferFeedback} from '../shared/types/offer.ts';
import { getSortedOffers } from '../shared/utils/offer.ts';
import {AuthStatus} from '../shared/constants/auth.ts';

export interface StateType {
  city: OfferCity;
  isLoading: boolean;
  authorizationStatus: AuthStatus;
  name?: string;
  offers: MainOfferInfo[];
  offersLoading: boolean;
  offersSort: OffersSortType;
  currentOffer: AdditionalOfferInfo | null;
  currentOfferLoading: boolean;
  currentOfferFeedbacks: OfferFeedback[];
  currentOfferNearby: MainOfferInfo[];
  currentOfferId?: string;
}

const stateType: StateType = {
  city: { name: '', location: { latitude: 0, longitude: 0, zoom: 0 } },
  offersLoading: true,

  currentOffer: null,
  currentOfferLoading: false,
  currentOfferFeedbacks: [],
  currentOfferNearby: [],
  isLoading: true,
  authorizationStatus: AuthStatus.Unknown,
  name: '',
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
    .addCase(setCurrentOffer, (state, { payload }) => {
      state.currentOffer = payload;
    })
    .addCase(setOffersSort, (state, { payload }) => {
      state.offersSort = payload;

      const offersToSort = [...state.offers];

      state.offers = getSortedOffers(payload, offersToSort);
    })
    .addCase(setIsLoading, (state, { payload }) => {
      state.isLoading = payload;
    })
    .addCase(setCurrentOfferFeedbacks, (state, { payload }) => {
      state.currentOfferFeedbacks = payload;
    })
    .addCase(setCurrentOfferNearbyOffers, (state, { payload }) => {
      state.currentOfferNearby = payload;
    })
    .addCase(setOffersLoading, (state, { payload }) => {
      state.offersLoading = payload;
    })
    .addCase(setCurrentOfferLoading, (state, { payload }) => {
      state.currentOfferLoading = payload;
    })
    .addCase(setName, (state, { payload }) => {
      state.name = payload;
    })
    .addCase(setAuthStatus, (state, { payload }) => {
      state.authorizationStatus = payload;
    });
});
