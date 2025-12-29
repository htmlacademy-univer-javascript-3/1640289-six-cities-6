import React from 'react';
import { renderHook } from '@testing-library/react';

import { useAppDispatch } from './use-store';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

describe('Hook: useStore', () => {
  describe('useAppDispatch', () => {
    it('should return dispatch function', () => {
      const mockCity = {
        name: 'Paris',
        location: {
          latitude: 48.85661,
          longitude: 2.351499,
        },
        zoom: 13,
      };

      const createMockStore = (city = mockCity) => configureStore({
        reducer: {
          city: () => ({ city }),
        },
      });

      const wrapper = (store: ReturnType<typeof createMockStore>) => {
        const Wrapper = ({ children }: { children: React.ReactNode }) => (
          <Provider store={store}>{children}</Provider>
        );

        Wrapper.displayName = 'Wrapper';
        return Wrapper;
      };

      const store = createMockStore();


      const { result } = renderHook(() => useAppDispatch(), { wrapper: wrapper(store) });

      expect(result.current).toBeInstanceOf(Function);
    });
  });
});
