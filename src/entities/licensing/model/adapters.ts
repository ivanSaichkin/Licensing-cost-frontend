import type {
  DsLicensingDraftSerializer,
  DsLicensingFeedSerializer,
  DsLicensingListSerializer,
} from '@/shared/api/generated/Api';

import type { Licensing, LicensingStatus } from './types';

type ApiLicensing =
  | DsLicensingDraftSerializer
  | DsLicensingFeedSerializer
  | DsLicensingListSerializer;

const toStatus = (status?: string): LicensingStatus => {
  if (status === 'draft' || status === 'published' || status === 'deleted') {
    return status;
  }

  return 'published';
};

export const toLicensing = (item: ApiLicensing): Licensing => ({
  id: item.id ?? 0,
  title: item.title ?? 'Без названия',
  description: item.description ?? '',
  commission_per_unit: item.commission_per_unit ?? null,
  min_for_calc: item.min_for_calc ?? null,
  image_url: item.image_url ?? '',
  video_url: item.video_url ?? '',
  status: toStatus(item.status),
  likes_count: 'likes_count' in item ? (item.likes_count ?? 0) : 0,
  is_creator:
    'is_creator' in item && item.is_creator === 1 ? 1 : 0,
  is_liked: 'is_liked' in item && item.is_liked === 1 ? 1 : 0,
  created_at: item.created_at,
  published_at: item.published_at ?? null,
});

export const toLicensingList = (items: ApiLicensing[]): Licensing[] =>
  items.map(toLicensing);
