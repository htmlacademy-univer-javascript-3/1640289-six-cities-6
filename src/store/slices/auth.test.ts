import authReducer, { setAuthStatus, setName } from './auth';
import { AuthStatus } from '../../shared/constants/auth.ts';

describe('authSlice', () => {
  it('should return the initial state', () => {
    const initialState = {
      authorizationStatus: AuthStatus.Unknown,
      name: '',
    };

    const result = authReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle setAuthStatus', () => {
    const initialState = {
      authorizationStatus: AuthStatus.Unknown,
      name: '',
    };

    const newStatus = AuthStatus.Auth;
    const result = authReducer(initialState, setAuthStatus(newStatus));

    expect(result.authorizationStatus).toBe(newStatus);
  });

  it('should handle setName', () => {
    const initialState = {
      authorizationStatus: AuthStatus.Unknown,
      name: '',
    };

    const newName = 'John Doe';
    const result = authReducer(initialState, setName(newName));

    expect(result.name).toBe(newName);
  });
});
