import { useEffect, useState } from 'react';

import { licensingRepository } from '../api';
import type { Licensing } from './types';

interface UseLicensingsResult {
  licensings: Licensing[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Загружает опубликованные модели лицензирования.
 * В lab 5 репозиторий отдаёт mock-коллекцию, в lab 6 — данные из API.
 */
export const useLicensings = (): UseLicensingsResult => {
  const [licensings, setLicensings] = useState<Licensing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadLicensings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await licensingRepository.getAll();

        if (!isCancelled) {
          setLicensings(data);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Не удалось загрузить модели лицензирования',
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadLicensings();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { licensings, isLoading, error };
};
