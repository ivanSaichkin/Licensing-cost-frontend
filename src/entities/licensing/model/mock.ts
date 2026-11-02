import type { Licensing } from './types';

/**
 * Мок-коллекция из первой лабораторной (ветка `ssr-in-memory`):
 * пять опубликованных моделей лицензирования с теми же названиями,
 * описаниями, комиссиями и количеством лайков.
 *
 * Изображения и видео лежат в `public/media/licensing` — это те же
 * файлы, которые раньше отдавал MinIO в лабораторных 1-4.
 *
 * Trial добавлен как опубликованная карточка с пустыми `image_url`
 * и `video_url`, чтобы на нём показать работу дефолтных медиа
 * (см. лабораторную 5, п. 7.2 методических указаний).
 */
export const MOCK_LICENSINGS: Licensing[] = [
  {
    id: 1,
    title: 'Per User',
    description:
      'Модель лицензирования на одного пользователя. Комиссия начисляется за каждое активное рабочее место.',
    commission_per_unit: 120,
    min_for_calc: 1,
    image_url: '/media/licensing/per_user.jpg',
    video_url: '/media/licensing/per_user.mp4',
    status: 'published',
    likes_count: 12,
    is_creator: 0,
  },
  {
    id: 2,
    title: 'Per Core',
    description:
      'Модель лицензирования по ядрам процессора. Комиссия рассчитывается на каждое физическое ядро сервера.',
    commission_per_unit: 280,
    min_for_calc: 4,
    image_url: '/media/licensing/per_core.jpg',
    video_url: '/media/licensing/per_core.mp4',
    status: 'published',
    likes_count: 13,
    is_creator: 0,
  },
  {
    id: 3,
    title: 'Subscription',
    description:
      'Подписочная модель. Ежемесячная комиссия за доступ к продукту без права бессрочного использования.',
    commission_per_unit: 350,
    min_for_calc: 1,
    image_url: '/media/licensing/subscription.jpg',
    video_url: '/media/licensing/subscription.mp4',
    status: 'published',
    likes_count: 16,
    is_creator: 0,
  },
  {
    id: 4,
    title: 'Enterprise Agreement',
    description:
      'Корпоративное соглашение с фиксированной комиссией за весь пакет. Минимальный порог входа — 50 единиц.',
    commission_per_unit: 590,
    min_for_calc: 50,
    image_url: '/media/licensing/enterprise.jpg',
    video_url: '/media/licensing/enterprise.mp4',
    status: 'published',
    likes_count: 17,
    is_creator: 0,
  },
  {
    id: 5,
    title: 'Concurrent',
    description:
      'Плавающая лицензия. Комиссия начисляется за одновременные подключения, а не за всех пользователей.',
    commission_per_unit: 220,
    min_for_calc: 5,
    image_url: '/media/licensing/concurrent.jpg',
    video_url: '/media/licensing/concurrent.mp4',
    status: 'published',
    likes_count: 12,
    is_creator: 0,
  },
  {
    id: 6,
    title: 'Trial',
    description:
      'Пробная модель. Нулевая комиссия на период тестирования и знакомства с продуктом.',
    commission_per_unit: 0,
    min_for_calc: 1,
    image_url: '',
    video_url: '',
    status: 'published',
    likes_count: 2,
    is_creator: 0,
  },
];
