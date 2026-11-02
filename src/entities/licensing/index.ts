export type { Licensing, LicensingStatus } from './model/types';
export {
  filterByMaxCommission,
  findLicensingIndex,
  splitIntoColumns,
} from './model/selectors';
export { useLicensings } from './model/useLicensings';
export { LicensingCard } from './ui/LicensingCard/LicensingCard';
export { LicensingSlide } from './ui/LicensingSlide/LicensingSlide';
