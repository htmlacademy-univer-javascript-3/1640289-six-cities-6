import { configureStore } from '@reduxjs/toolkit';

import { reducer } from './reducer.ts';
import apiClient from '../api/api.ts';

// export const store = configureStore({ reducer });

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: apiClient,
      },
    }),
});

export type AppDispatchType = typeof store.dispatch;
