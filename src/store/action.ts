import { createAction } from '@reduxjs/toolkit';
import { City } from '../mocks/city.ts';
import { OffersSortType } from '../shared/constants/offer.ts';

export const setCity = createAction<City>('city/set');
export const setOffers = createAction<{ id: number; city: string; title: string }[]>('offers/set');
export const setOffersSort = createAction<OffersSortType>('offers/setSort');
export const setCurrentOfferId = createAction<string | undefined>('offers/setId');
