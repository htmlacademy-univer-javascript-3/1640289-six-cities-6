import axios from 'axios';
import { getToken } from '../shared/utils/api.ts';
import { API_TIMEOUT, API_URL } from '../shared/constants/api.ts';

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
