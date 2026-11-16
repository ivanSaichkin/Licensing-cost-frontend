import { Api } from './generated/Api';

import { getStoredAuth } from '@/shared/lib/authStorage';

/**
 * Единый axios-клиент сгенерированного API.
 *
 * securityWorker добавляет Bearer только к защищённым методам. Публичные
 * `GET /licensings` и `GET /licensing/feed` тоже должны получать токен,
 * если пользователь авторизован — иначе бэкенд не вернёт `is_creator`.
 * Поэтому токен добавляем интерсептором ко всем запросам клиента.
 */
export const api = new Api({
  baseURL: '/api',
  securityWorker: () => {
    const auth = getStoredAuth();

    if (!auth) {
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    };
  },
});

api.instance.interceptors.request.use((config) => {
  const auth = getStoredAuth();

  if (auth) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});
