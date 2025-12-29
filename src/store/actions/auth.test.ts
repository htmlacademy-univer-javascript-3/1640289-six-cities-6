import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authCheck, authLogin, authLogout } from './auth';
import { AuthStatus } from '../../shared/constants/auth';
import { RoutePath } from '../../shared/constants/router';
import * as apiUtils from '../../shared/utils/api';
import * as authSlice from '../slices/auth';
import { UserInfo } from '../../shared/types/user';
import { AuthData } from '../../shared/types/auth';
import { AxiosInstance } from 'axios';

vi.mock('../../shared/utils/api', () => ({
  saveToken: vi.fn(),
  removeToken: vi.fn(),
}));

vi.mock('../../shared/constants/api', () => ({
  ApiEndpoint: {
    Login: '/login',
    Logout: '/logout',
  },
}));

vi.mock('../slices/auth', () => ({
  setAuthStatus: vi.fn((status: AuthStatus) => ({ type: 'auth/setAuthStatus', payload: status })),
  setName: vi.fn((name: string) => ({ type: 'auth/setName', payload: name })),
}));

describe('Auth Actions', () => {
  const mockDispatch = vi.fn();
  const mockNavigate = vi.fn();

  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  } as unknown as AxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('authCheck', () => {
    it('must set the Auth status upon successful verification', async () => {
      const MOCK_USER_INFO: UserInfo = {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'john@example.com',
        token: 'mock-token',
      };

      (mockApi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_USER_INFO });

      const action = authCheck();
      await action(mockDispatch, vi.fn(), mockApi);

      expect(mockApi.get).toHaveBeenCalledWith('/login');
      expect(authSlice.setName).toHaveBeenCalledWith(MOCK_USER_INFO.name);
      expect(authSlice.setAuthStatus).toHaveBeenCalledWith(AuthStatus.Auth);
    });

    it('must set the NoAuth status in case of verification error', async () => {
      (mockApi.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Unauthorized'));

      const action = authCheck();
      await action(mockDispatch, vi.fn(), mockApi);

      expect(mockApi.get).toHaveBeenCalledWith('/login');
      expect(authSlice.setAuthStatus).toHaveBeenCalledWith(AuthStatus.NoAuth);
      expect(authSlice.setName).not.toHaveBeenCalled();
    });
  });

  describe('authLogin', () => {
    it('must log in and redirect to the main page', async () => {
      const MOCK_AUTH_DATA: AuthData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const MOCK_USER_INFO: UserInfo = {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'test@example.com',
        token: 'mock-token-12345',
      };

      (mockApi.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_USER_INFO });

      const action = authLogin({ payload: MOCK_AUTH_DATA, navigate: mockNavigate });
      await action(mockDispatch, vi.fn(), mockApi);

      expect(mockApi.post).toHaveBeenCalledWith('/login', MOCK_AUTH_DATA);
      expect(apiUtils.saveToken).toHaveBeenCalledWith(MOCK_USER_INFO.token);
      expect(authSlice.setName).toHaveBeenCalledWith(MOCK_USER_INFO.name);
      expect(authSlice.setAuthStatus).toHaveBeenCalledWith(AuthStatus.Auth);
      expect(mockNavigate).toHaveBeenCalledWith(RoutePath.Main);
    });
  });

  describe('authLogout', () => {
    it('must log out and redirect to the main page', async () => {
      (mockApi.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const action = authLogout({ navigate: mockNavigate });
      await action(mockDispatch, vi.fn(), mockApi);

      expect(mockApi.delete).toHaveBeenCalledWith('/logout');
      expect(apiUtils.removeToken).toHaveBeenCalled();
      expect(authSlice.setName).toHaveBeenCalledWith('');
      expect(authSlice.setAuthStatus).toHaveBeenCalledWith(AuthStatus.NoAuth);
      expect(mockNavigate).toHaveBeenCalledWith(RoutePath.Main);
    });

    it('must clear the user\'s data when logging out', async () => {
      (mockApi.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const action = authLogout({ navigate: mockNavigate });
      await action(mockDispatch, vi.fn(), mockApi);

      expect(authSlice.setName).toHaveBeenCalledWith('');
      expect(authSlice.setAuthStatus).toHaveBeenCalledWith(AuthStatus.NoAuth);
    });
  });

  describe('Integration scenarios', () => {
    it('must correctly process the full cycle: input -> check -> output', async () => {
      const MOCK_AUTH_DATA: AuthData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const MOCK_USER_INFO: UserInfo = {
        name: 'John Doe',
        avatarUrl: 'avatar.jpg',
        isPro: false,
        email: 'test@example.com',
        token: 'mock-token',
      };

      (mockApi.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_USER_INFO });

      const loginAction = authLogin({ payload: MOCK_AUTH_DATA, navigate: mockNavigate });
      await loginAction(mockDispatch, vi.fn(), mockApi);

      expect(authSlice.setAuthStatus).toHaveBeenCalledWith(AuthStatus.Auth);

      (mockApi.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: MOCK_USER_INFO });

      const checkAction = authCheck();
      await checkAction(mockDispatch, vi.fn(), mockApi);

      expect(authSlice.setAuthStatus).toHaveBeenCalledWith(AuthStatus.Auth);

      (mockApi.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      const logoutAction = authLogout({ navigate: mockNavigate });
      await logoutAction(mockDispatch, vi.fn(), mockApi);

      expect(authSlice.setAuthStatus).toHaveBeenCalledWith(AuthStatus.NoAuth);
      expect(authSlice.setName).toHaveBeenCalledWith('');
    });
  });
});
