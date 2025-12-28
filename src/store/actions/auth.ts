import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatchType, StateType } from '../index.ts';
import { AxiosInstance } from 'axios';
import { ApiEndpoint, removeToken, saveToken } from '../../shared/utils/api.ts';
import { AuthStatus } from '../../shared/constants/auth.ts';
import { RoutePath } from '../../shared/constants/router.ts';
import { AuthData } from '../../shared/types/auth.ts';
import { UserInfo } from '../../shared/types/user.ts';
import { NavigateFunction } from 'react-router-dom';
import { setAuthStatus, setName } from '../slices/auth.ts';

export const authCheck = createAsyncThunk<void, undefined, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'auth/check',
  async (_arg, {dispatch, extra: api}) => {
    try {
      const { data } = await api.get<UserInfo>(ApiEndpoint.Login);

      dispatch(setName(data.name));
      dispatch(setAuthStatus(AuthStatus.Auth));
    } catch {
      dispatch(setAuthStatus(AuthStatus.NoAuth));
    }
  },
);

export const authLogin = createAsyncThunk<void, {payload: AuthData; navigate: NavigateFunction }, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'auth/login',
  async ({payload, navigate}, {dispatch, extra: api}) => {
    const { data } = await api.post<UserInfo>(ApiEndpoint.Login, payload);

    saveToken(data.token);

    dispatch(setName(data.name));
    dispatch(setAuthStatus(AuthStatus.Auth));
    navigate(RoutePath.Main);
  },
);

export const authLogout = createAsyncThunk<void, {navigate: NavigateFunction}, {
  dispatch: AppDispatchType;
  state: StateType;
  extra: AxiosInstance;
}>(
  'auth/logout',
  async ({navigate}, {dispatch, extra: api}) => {
    await api.delete(ApiEndpoint.Logout);

    removeToken();

    dispatch(setName(''));
    dispatch(setAuthStatus(AuthStatus.NoAuth));
    navigate(RoutePath.Main);
  },
);
