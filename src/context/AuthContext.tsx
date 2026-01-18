import { useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContextDef';
import type { User } from '../types';
import { AUTH_STORAGE_KEYS } from '../constants';

function getInitialToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
}

function getInitialUser(): User | null {
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, newToken);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
