import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AdditionalOfferInfo, MainOfferInfo, OfferFeedback } from '../../shared/types/offer.ts';
import { ApiEndpoint } from '../../shared/utils/api.ts';

import { AppDispatchType, StateType } from '../index.ts';
import { NavigateFunction } from 'react-router-dom';
import { RoutePath } from '../../shared/constants/router.ts';
import { FeedbackInfo } from '../../shared/types/user.ts';
import { setCity } from '../slices/city.ts';
import {setInitialOffers, setOffers, setOffersLoading} from '../slices/offer.ts';
import {
  setCurrentOffer,
  setCurrentOfferFeedbacks,
  setCurrentOfferLoading,
  setCurrentOfferNearbyOffers
} from '../slices/current-offer.ts';

export const fetchOffers = createAsyncThunk<void, undefined, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'offers/fetchOffers',
  async (_arg, {dispatch, extra: api}) => {
    const { data } = await api.get<MainOfferInfo[]>(ApiEndpoint.Offers);

    const city = data[0].city;

    dispatch(setCity(city));
    dispatch(setOffers(data));
    dispatch(setInitialOffers(data));
    dispatch(setOffersLoading(false));
  },
);


export const fetchReviews = createAsyncThunk<OfferFeedback[], { offerId: string }, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'feedbacks/set',
  async ({offerId}, {dispatch, extra: api, rejectWithValue}) => {
    try {
      const { data } = await api.get<OfferFeedback[]>(`${ApiEndpoint.Feedbacks}/${offerId}`);

      dispatch(setCurrentOfferFeedbacks(data));

      return data;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const fetchNearby = createAsyncThunk<MainOfferInfo[], { offerId: string }, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'nearby/fetch',
  async ({offerId}, {dispatch, extra: api, rejectWithValue}) => {

    try {
      const { data } = await api.get<MainOfferInfo[]>(`${ApiEndpoint.Offers}/${offerId}/${ApiEndpoint.Nearby}`);

      dispatch(setCurrentOfferNearbyOffers(data));

      return data;
    } catch {
      return rejectWithValue('Failed to fetch nearby offers');
    }
  },
);

export const fetchCurrentOffer = createAsyncThunk<AdditionalOfferInfo, { offerId: string; navigate: NavigateFunction }, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'offer/set',
  async ({offerId, navigate}, {dispatch, extra: api, rejectWithValue}) => {
    dispatch(setCurrentOfferLoading(true));

    try {
      const { data } = await api.get<AdditionalOfferInfo>(`${ApiEndpoint.Offers}/${offerId}`);

      dispatch(fetchReviews({ offerId }));
      dispatch(fetchNearby({ offerId }));
      dispatch(setCurrentOffer(data));

      return data;
    } catch {
      navigate(RoutePath.NotFound);
      return rejectWithValue(null);
    } finally {
      dispatch(setCurrentOfferLoading(false));
    }
  },
);

export const postReview = createAsyncThunk<void, FeedbackInfo, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'review/post',
  async ({comment, rating, offerId}, {dispatch, extra: api}) => {
    await api.post(`${ApiEndpoint.Feedbacks}/${offerId}`, {comment, rating});

    dispatch(fetchReviews({offerId}));
  },
);
