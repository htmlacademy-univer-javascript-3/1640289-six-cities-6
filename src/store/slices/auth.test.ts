import authReducer, { setAuthStatus, setName } from './auth';
import { AuthStatus } from '../../shared/constants/auth.ts';

const INITIAL_STATE = {
  authorizationStatus: AuthStatus.Unknown,
  name: '',
};

describe('authSlice', () => {
  it('should return the initial state', () => {
    const result = authReducer(undefined, { type: '' });
    expect(result).toEqual(INITIAL_STATE);
  });

  it('should handle setAuthStatus', () => {
    const NEW_STATUS = AuthStatus.Auth;
    const result = authReducer(INITIAL_STATE, setAuthStatus(NEW_STATUS));

    expect(result.authorizationStatus).toBe(NEW_STATUS);
  });

  it('should handle setName', () => {
    const NEW_NAME = 'John Doe';
    const result = authReducer(INITIAL_STATE, setName(NEW_NAME));

    expect(result.name).toBe(NEW_NAME);
  });
});
