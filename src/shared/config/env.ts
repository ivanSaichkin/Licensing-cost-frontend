export type ApiMode = 'mock' | 'api';

/**
 * Режим получения данных.
 *
 * lab 5 — `mock`: карточки берутся из коллекции mock-объектов, бэкенд не нужен.
 * lab 6 — `api`: данные запрашиваются у Go-веб-сервиса через Vite-прокси.
 */
const configuredMode = import.meta.env.VITE_API_MODE;

export const API_MODE: ApiMode = configuredMode === 'api' ? 'api' : 'mock';

export const IS_MOCK_MODE = API_MODE === 'mock';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';
