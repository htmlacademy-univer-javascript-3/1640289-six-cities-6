import { createAction } from '@reduxjs/toolkit';
import { City } from '../mocks/city.ts';

export const setCity = createAction<City>('city/set');
export const setOffers = createAction<{ id: number; city: string; title: string }[]>('offers/set');
