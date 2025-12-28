import { configureStore } from '@reduxjs/toolkit';

import apiClient from '../api/api.ts';
import rootReducer from './slices/root.ts';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: apiClient,
      },
    }),
});

export type AppDispatchType = typeof store.dispatch;
export type StateType = ReturnType<typeof store.getState>;
