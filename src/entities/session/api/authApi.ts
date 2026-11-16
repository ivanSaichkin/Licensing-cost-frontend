import axios from 'axios';

import type { LoginResponse } from '../model/types';

export interface LoginResult {
  token: string;
  login: string;
}

/**
 * Авторизация намеренно сделана только на axios, без кодогенерации
 * и без createAsyncThunk: состояние в Redux кладём вручную.
 */
export const loginRequest = async (
  login: string,
  password: string,
): Promise<LoginResult> => {
  const { data } = await axios.post<LoginResponse>('/api/users/login', {
    login,
    password,
  });

  if (!data.access_token) {
    throw new Error('Веб-сервис не вернул access_token');
  }

  return { token: data.access_token, login };
};

/**
 * Выход также только axios; после успеха/ошибки локальное состояние
 * очищается вызывающим кодом.
 */
export const logoutRequest = async (token: string): Promise<void> => {
  await axios.post('/api/users/logout', null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
