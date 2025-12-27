import axios from 'axios';
import { getToken } from './api.utils.ts';

export const AUTH_TOKEN_KEY = 'six-cities-token';

const API_URL = 'https://14.design.htmlacademy.pro/six-cities';
const API_TIMEOUT = 5000;

export const createApiClient = () => {
  const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
  });

  api.interceptors.request.use(
    (config) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers['X-Token'] = token;
      }

      return config;
    },
  );

  return api;
};

const apiClient = createApiClient();

export default apiClient;
