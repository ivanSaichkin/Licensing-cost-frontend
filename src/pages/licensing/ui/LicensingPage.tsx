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
 * «Подробнее» — карточка конкретной модели из плитки.
 * Описание раскрыто целиком, кнопка «следующий→» ведёт к следующей
 * модели в том же порядке, что и в ленте.
 */
export const LicensingPage: FC = () => {
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
        title="Не удалось загрузить модель"
        description={error}
      />
    );
  }

  const licensingId = Number(id);
  const currentIndex = Number.isInteger(licensingId)
    ? findLicensingIndex(licensings, licensingId)
    : -1;
  const licensing =
    currentIndex >= 0 ? licensings[currentIndex] : undefined;
  const nextLicensing =
    currentIndex >= 0 ? licensings[currentIndex + 1] : undefined;

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

  const handleNext = () => {
    if (nextLicensing) {
      navigate(buildLicensingRoute(nextLicensing.id));
    }
  };

  return (
    <LicensingSlide
      key={licensing.id}
      licensing={licensing}
      initialDescriptionExpanded
      hasNext={Boolean(nextLicensing)}
      onNext={handleNext}
    />
  );
};
