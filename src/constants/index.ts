export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';

export const USERS_PER_PAGE = 6;

export const AUTH_STORAGE_KEYS = {
	ACCESS_TOKEN: 'accessToken',
	USER: 'user',
} as const;
