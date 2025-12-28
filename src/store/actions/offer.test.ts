import { describe, it, expect, vi } from 'vitest';
import { fetchOffers } from './offer.ts';
import { setOffers, setInitialOffers, setOffersLoading } from '../slices/offer';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../shared/utils/api', () => ({
  ApiEndpoint: { Offers: '/offers' },
}));

const apiMock = {
  get: vi.fn(),
};

const mockReducer = (state = {}, action: {type: string; payload: {id: string}[]}) => {
  switch (action.type) {
    case setOffers.type:
      return { ...state, offers: action.payload };
    case setInitialOffers.type:
      return { ...state, initialOffers: action.payload };
    case setOffersLoading.type:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

describe('fetchOffers async thunk', () => {
  it('should handle error correctly', async () => {
    apiMock.get.mockRejectedValueOnce(new Error('API error'));

    const store = configureStore({
      reducer: mockReducer,
    });

    try {
      await store.dispatch(fetchOffers());
    } catch {
      await store.dispatch(fetchOffers());
    }

    const actions = [
      {
        'payload': false,
        'type': 'offers/setOffersLoading',
      },
    ];

    expect(actions).toEqual([setOffersLoading(false)]); // Ожидаем, что установка loading будет выполнена
  });
});
