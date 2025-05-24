import http from './api';
import { LoginResponse, LogoutResponse } from '../types/auth';
import { LOCALSTORAGE_KEYS } from '../lib/constants'

export const login = async (data: { token: string }): Promise<LoginResponse> => {
  try {
    const response = await http.post<LoginResponse>('/api/login', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const response = await http.post<LogoutResponse>('/api/logout');
    window.localStorage.setItem(LOCALSTORAGE_KEYS.AUTHENTICATED, 'false');
    return response;
  } catch (error) {
    throw error;
  }
};
  