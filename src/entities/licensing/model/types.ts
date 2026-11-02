export type LicensingStatus = 'draft' | 'published' | 'deleted';

/**
 * Модель лицензирования (услуга) в том виде, в котором её отдаёт
 * Go-веб-сервис из лабораторных 3-4.
 */
export interface Licensing {
  id: number;
  title: string;
  description: string;
  commission_per_unit: number | null;
  min_for_calc: number | null;
  image_url: string;
  video_url: string;
  status: LicensingStatus;
  likes_count: number;
  is_creator?: 0 | 1;
  is_liked?: 0 | 1;
  created_at?: string;
  published_at?: string | null;
}
