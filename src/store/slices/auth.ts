import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthStatus } from '../../shared/constants/auth.ts';

interface AuthState {
  authorizationStatus: AuthStatus;
  name?: string;
}

const INITIAL_STATE: AuthState = {
  authorizationStatus: AuthStatus.Unknown,
  name: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    setAuthStatus(state, action: PayloadAction<AuthStatus>) {
      state.authorizationStatus = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
  },
});

export const { setAuthStatus, setName } = authSlice.actions;
export default authSlice.reducer;
