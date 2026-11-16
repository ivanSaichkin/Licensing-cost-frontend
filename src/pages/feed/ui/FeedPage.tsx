import type { FC } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  fetchLicensings,
  findLicensingIndex,
  LicensingSlide,
  toggleLike,
} from '@/entities/licensing';
import { buildLicensingRoute, ROUTES } from '@/shared/config';
import { MockNotice, PageLoader, StateScreen } from '@/shared/ui';

/**
 * «Лента» — полноэкранная карточка модели с видео и кнопкой
 * «следующий→». Данные приходят из Go-веб-сервиса; у гостя при
 * недоступном бэкенде используется mock-коллекция.
 */
export const FeedPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.session.isAuthenticated,
  );
  const { items, isLoading, error, mockFallback } = useAppSelector(
    (state) => state.licensing,
  );
  const isBusy = useAppSelector((state) => state.requests.pending > 0);

  useEffect(() => {
    dispatch(
      fetchLicensings({
        maxCommission: 0,
        isGuest: !isAuthenticated,
      }),
    );
  }, [dispatch, isAuthenticated]);

  if (isLoading && items.length === 0) {
    return <PageLoader theme="dark" />;
  }

  if (error && items.length === 0) {
    return (
      <StateScreen
        theme="dark"
        title="Не удалось загрузить ленту"
        description={error}
      />
    );
  }

  if (items.length === 0) {
    return (
      <StateScreen
        theme="dark"
        title="Пока нет моделей"
        description="Опубликованных моделей лицензирования пока нет."
      />
    );
  }

  const licensingId = id === undefined ? null : Number(id);
  const currentIndex =
    licensingId === null
      ? 0
      : Number.isInteger(licensingId)
        ? findLicensingIndex(items, licensingId)
        : -1;
  const licensing = currentIndex >= 0 ? items[currentIndex] : undefined;

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

  const nextLicensing = items[currentIndex + 1];

  const handleNext = () => {
    if (nextLicensing) {
      navigate(buildLicensingRoute(nextLicensing.id));
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: `/licensing/${licensing.id}` } });
      return;
    }

    void dispatch(
      toggleLike({
        id: licensing.id,
        like: licensing.is_liked !== 1,
      }),
    );
  };

  return (
    <>
      <MockNotice isVisible={mockFallback} />
      <LicensingSlide
        key={licensing.id}
        licensing={licensing}
        hasNext={Boolean(nextLicensing)}
        onNext={handleNext}
        onLike={handleLike}
        isLiked={licensing.is_liked === 1}
        isBusy={isBusy}
      />
    </>
  );
};
