import { IS_MOCK_MODE } from '@/shared/config';

import { httpLicensingRepository } from './httpLicensingRepository';
import { mockLicensingRepository } from './mockLicensingRepository';
import type { LicensingRepository } from './types';

export const licensingRepository: LicensingRepository = IS_MOCK_MODE
  ? mockLicensingRepository
  : httpLicensingRepository;
