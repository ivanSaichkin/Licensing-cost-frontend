import type { FC } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  findLicensingIndex,
  LicensingSlide,
  useLicensings,
} from '@/entities/licensing';
import { buildLicensingRoute, ROUTES } from '@/shared/config';
import { PageLoader, StateScreen } from '@/shared/ui';

/**
 * «Лента» — полноэкранная карточка модели с видео и кнопкой
 * «следующий→», как в SSR-шаблоне feed предыдущих лабораторных.
 *
 * Страница открывается:
 *  - на `/` — с первой опубликованной модели;
 *  - на `/licensing/:id` — с конкретной модели (переход из плитки).
 */
export const FeedPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { licensings, isLoading, error } = useLicensings();

  if (isLoading) {
    return <PageLoader theme="dark" />;
  }

  if (error) {
    return (
      <StateScreen
        theme="dark"
        title="Не удалось загрузить ленту"
        description={error}
      />
    );
  }

  if (licensings.length === 0) {
    return (
      <StateScreen
        theme="dark"
        title="Пока нет моделей"
        description="В mock-коллекции нет опубликованных моделей лицензирования."
      />
    );
  }

  const licensingId = id === undefined ? null : Number(id);
  const currentIndex =
    licensingId === null
      ? 0
      : Number.isInteger(licensingId)
        ? findLicensingIndex(licensings, licensingId)
        : -1;
  const licensing =
    currentIndex >= 0 ? licensings[currentIndex] : undefined;

  if (!licensing) {
    return (
      <StateScreen
        theme="dark"
        title="Модель не найдена"
        description="Возможно, ссылка устарела или модель удалена."
        action={<Link to={ROUTES.GRID}>Перейти в плитку</Link>}
      />
    );
  }

  const nextLicensing = licensings[currentIndex + 1];

  const handleNext = () => {
    if (nextLicensing) {
      navigate(buildLicensingRoute(nextLicensing.id));
    }
  };

  return (
    <LicensingSlide
      key={licensing.id}
      licensing={licensing}
      hasNext={Boolean(nextLicensing)}
      onNext={handleNext}
    />
  );
};
