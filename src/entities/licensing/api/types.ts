import type { Licensing } from '../model/types';

export interface LicensingRepository {
  getAll: () => Promise<Licensing[]>;
}
