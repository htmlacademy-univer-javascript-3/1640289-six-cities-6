import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StateType } from '../reducer.ts';
import { MainOfferInfo } from '../../shared/types/offer.ts';
import { ApiEndpoint } from '../../api/api.utils.ts';
import { setCity, setIsLoading, setOffers } from '../action.ts';
import { AppDispatchType } from '../index.ts';

export const fetchOffers = createAsyncThunk<void, undefined, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'offers/fetchOffers',
  async (_arg, {dispatch, extra: api}) => {
    const { data } = await api.get<MainOfferInfo[]>(ApiEndpoint.Offers);

    console.log(data);

    const city = data[0].city;

    dispatch(setCity(city));
    dispatch(setOffers(data));
    dispatch(setIsLoading(false));
  },
);
