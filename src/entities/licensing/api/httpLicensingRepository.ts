import { API_BASE_URL } from '@/shared/config';

import type { Licensing } from '../model/types';
import type { LicensingRepository } from './types';

/**
 * Источник данных лабораторной 6: Go-веб-сервис из лабораторных 3-4.
 * Запрос идёт на относительный `/api`, его проксирует Vite (см. vite.config.ts).
 */
export const httpLicensingRepository: LicensingRepository = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/licensings`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(
        `Веб-сервис вернул ошибку HTTP ${response.status} при загрузке моделей`,
      );
    }

    const payload: unknown = await response.json();

    if (!Array.isArray(payload)) {
      throw new Error('Веб-сервис вернул данные в неизвестном формате');
    }

    return payload as Licensing[];
  },
};
