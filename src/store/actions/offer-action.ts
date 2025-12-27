import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StateType } from '../reducer.ts';
import {AdditionalOfferInfo, MainOfferInfo, OfferFeedback} from '../../shared/types/offer.ts';
import { ApiEndpoint } from '../../api/api.utils.ts';
import {
  setCity, setCurrentOffer,
  setCurrentOfferFeedbacks, setCurrentOfferLoading,
  setCurrentOfferNearbyOffers,
  setOffers,
  setOffersLoading
} from '../action.ts';
import { AppDispatchType } from '../index.ts';
import {NavigateFunction} from 'react-router-dom';
import {RoutePath} from '../../shared/constants/router.ts';
import {FeedbackInfo} from '../../shared/types/user.ts';

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
    dispatch(setOffersLoading(false));
  },
);


export const fetchReviews = createAsyncThunk<void, { offerId: string }, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'feedbacks/set',
  async ({offerId}, {dispatch, extra: api}) => {
    const { data } = await api.get<OfferFeedback[]>(`${ApiEndpoint.Feedbacks}/${offerId}`);

    dispatch(setCurrentOfferFeedbacks(data));
  },
);

export const fetchNearby = createAsyncThunk<void, { offerId: string }, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'nearby/fetch',
  async ({offerId}, {dispatch, extra: api}) => {
    const { data } = await api.get<MainOfferInfo[]>(`${ApiEndpoint.Offers}/${offerId}/${ApiEndpoint.Nearby}`);

    dispatch(setCurrentOfferNearbyOffers(data));
  },
);

export const fetchCurrentOffer = createAsyncThunk<void, { offerId: string; navigate: NavigateFunction }, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'offer/set',
  async ({offerId, navigate}, {dispatch, extra: api}) => {
    dispatch(setCurrentOfferLoading(true));

    try {
      const { data } = await api.get<AdditionalOfferInfo>(`${ApiEndpoint.Offers}/${offerId}`);

      dispatch(fetchReviews({offerId}));
      dispatch(fetchNearby({offerId}));
      dispatch(setCurrentOffer(data));
    } catch {
      navigate(RoutePath.BadRoute);
    }

    dispatch(setCurrentOfferLoading(false));
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
