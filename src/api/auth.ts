import apiClient from './apiClient';
import type { LoginRequest, SignUpRequest, AuthResponse } from '../types';

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

export async function signUp(userData: SignUpRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/users/add', userData);
  const fakeToken = `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return {
    ...response.data,
    accessToken: fakeToken,
    refreshToken: fakeToken,
  };
}
