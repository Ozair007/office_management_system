import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, AUTH_STORAGE_KEYS } from '../constants';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 400) {
      console.error('Bad request');
    }

    if (status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      window.location.href = '/signup';
    }

    if (status === 403) {
      console.error('Access forbidden');
    }

    if (status === 404) {
      console.error('Not found');
    }

    if (status && status >= 500) {
      console.error('Server error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
