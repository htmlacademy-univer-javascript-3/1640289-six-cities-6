import { AUTH_TOKEN_KEY } from '../constants/api.ts';

export const getToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ?? '';
};

export const saveToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export enum ApiEndpoint {
  Offers = 'offers',
  Login = 'login',
  Logout = 'logout',
  Feedbacks = 'comments',
  Nearby = 'nearby',
  Favorites = 'favorite'
}
