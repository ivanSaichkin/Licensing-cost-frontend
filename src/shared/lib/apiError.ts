import axios from 'axios';

export const getApiErrorStatus = (error: unknown): number | null => {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? null;
  }

  return null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (typeof data === 'string' && data.trim()) {
      return data;
    }

    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message?: unknown }).message;

      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }

    if (error.response?.status === 401) {
      return 'Требуется авторизация';
    }

    if (error.response?.status === 403) {
      return 'Доступ запрещён';
    }

    if (error.response?.status === 409) {
      return 'Черновик уже существует';
    }

    if (!error.response || (error.response.status ?? 0) >= 500) {
      return 'Веб-сервис недоступен';
    }

    return `${fallback} (HTTP ${error.response.status})`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const isNotFoundError = (error: unknown): boolean =>
  getApiErrorStatus(error) === 404;

export const isConflictError = (error: unknown): boolean =>
  getApiErrorStatus(error) === 409;

export const isUnauthorizedError = (error: unknown): boolean =>
  getApiErrorStatus(error) === 401;
