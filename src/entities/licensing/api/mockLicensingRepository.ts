import { MOCK_LICENSINGS } from '../model/mock';
import type { LicensingRepository } from './types';

const MOCK_DELAY_MS = 350;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

/**
 * Источник данных лабораторной 5: коллекция mock-объектов.
 * Небольшая задержка имитирует сетевой запрос и позволяет показать
 * состояние загрузки, но никаких обращений к бэкенду не происходит.
 */
export const mockLicensingRepository: LicensingRepository = {
  async getAll() {
    await delay(MOCK_DELAY_MS);

    return MOCK_LICENSINGS.filter(
      (licensing) => licensing.status === 'published',
    );
  },
};
