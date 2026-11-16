export const DEFAULT_IMAGE_URL = '/media/default_image.png';
export const DEFAULT_VIDEO_URL = '/media/default_video.mp4';

const S3_ORIGINS = ['http://localhost:9000', 'http://127.0.0.1:9000'];

/**
 * Ссылки MinIO из ответа бэкенда переводим на прокси Vite `/s3`,
 * чтобы не было прямых запросов на localhost:9000 и CORS.
 */
export const resolveMediaUrl = (url?: string | null): string => {
  const trimmed = url?.trim();

  if (!trimmed) {
    return '';
  }

  const origin = S3_ORIGINS.find((candidate) => trimmed.startsWith(candidate));

  return origin ? `/s3${trimmed.slice(origin.length)}` : trimmed;
};

export const resolveImageUrl = (url?: string | null): string =>
  resolveMediaUrl(url) || DEFAULT_IMAGE_URL;

export const resolveVideoUrl = (url?: string | null): string =>
  resolveMediaUrl(url) || DEFAULT_VIDEO_URL;
