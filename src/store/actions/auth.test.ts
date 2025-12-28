import { describe, it, expect, vi } from 'vitest';
import { authCheck } from './auth.ts';
import { setAuthStatus, setName } from '../slices/auth';
import { AuthStatus } from '../../shared/constants/auth';
import { configureStore } from '@reduxjs/toolkit';

vi.mock('../../shared/utils/api', () => ({
  ApiEndpoint: { Login: '/login' },
  saveToken: vi.fn(),
  removeToken: vi.fn(),
}));

const apiMock = {
  get: vi.fn(),
};

const mockReducer = (state = {},) => state;

describe('authCheck async thunk', () => {
  it('should dispatch correct actions on success', () => {
    const mockUser = { name: 'Test User' };
    apiMock.get.mockResolvedValueOnce({ data: mockUser });

    const store = configureStore({
      reducer: mockReducer,
    });

    store.dispatch(authCheck());

    const actions = [
      {
        'payload': 'Test User',
        'type': 'auth/setName',
      },
      {
        'payload': 'AUTH',
        'type': 'auth/setAuthStatus',
      },
    ];
    expect(actions).toEqual([
      setName('Test User'),
      setAuthStatus(AuthStatus.Auth),
    ]);
  });

  it('should dispatch setAuthStatus with NoAuth on error', () => {
    apiMock.get.mockRejectedValueOnce(new Error('API error'));

    const store = configureStore({
      reducer: mockReducer,
    });

    store.dispatch(authCheck());

    const actions = [
      {
        'payload': 'NO_AUTH',
        'type': 'auth/setAuthStatus',
      },
    ];
    expect(actions).toEqual([setAuthStatus(AuthStatus.NoAuth)]);
  });
});
