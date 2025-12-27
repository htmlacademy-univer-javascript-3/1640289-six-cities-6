import { createAction } from '@reduxjs/toolkit';
import { OffersSortType } from '../shared/constants/offer.ts';
import { MainOfferInfo, OfferCity } from '../shared/types/offer.ts';
import {AuthStatus} from '../shared/constants/auth.ts';

export const setCity = createAction<OfferCity>('city/set');
export const setOffers = createAction<MainOfferInfo[]>('offers/set');
export const setOffersSort = createAction<OffersSortType>('offers/setSort');
export const setCurrentOfferId = createAction<string | undefined>('offers/setId');
export const setIsLoading = createAction<boolean>('loading/set');
export const setAuthStatus = createAction<AuthStatus>('auth/set');
export const setName = createAction<string>('name/set');
