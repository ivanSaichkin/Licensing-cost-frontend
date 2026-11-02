export const DEFAULT_IMAGE_URL = '/media/default_image.png';
export const DEFAULT_VIDEO_URL = '/media/default_video.mp4';

export const resolveImageUrl = (url?: string | null): string =>
  url && url.trim().length > 0 ? url : DEFAULT_IMAGE_URL;

export const resolveVideoUrl = (url?: string | null): string =>
  url && url.trim().length > 0 ? url : DEFAULT_VIDEO_URL;
