import type { FC } from 'react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  fetchFeed,
  LicensingSlide,
  toggleLike,
} from '@/entities/licensing';
import { buildLicensingRoute, ROUTES } from '@/shared/config';
import { MockNotice, PageLoader, StateScreen } from '@/shared/ui';

/**
 * «Лента» — полноэкранная карточка модели с видео и кнопкой
 * «следующий→».
 *
 * Данные загружаются через GET /api/licensing/feed: этот endpoint
 * возвращает is_liked, поэтому состояние лайка не теряется после
 * перезагрузки страницы. Список GET /api/licensings используется
 * только плиткой.
 */
export const FeedPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state) => state.session.isAuthenticated,
  );
  const { feed, nextFeed, isLoading, error, mockFallback } = useAppSelector(
    (state) => state.licensing,
  );
  const isBusy = useAppSelector((state) => state.requests.pending > 0);

  const routeId = id === undefined ? undefined : Number(id);
  const isValidRouteId =
    routeId === undefined ||
    (Number.isInteger(routeId) && routeId > 0);

  useEffect(() => {
    if (!isValidRouteId) {
      return;
    }

    void dispatch(
      fetchFeed({
        id: routeId,
        isGuest: !isAuthenticated,
      }),
    );
  }, [dispatch, routeId, isAuthenticated, isValidRouteId]);

  if (!isValidRouteId) {
    return (
      <StateScreen
        theme="dark"
        title="Модель не найдена"
        description="Некорректная ссылка на модель."
        action={<Link to={ROUTES.GRID}>Перейти в плитку</Link>}
      />
    );
  }

  if (isLoading && !feed) {
    return <PageLoader theme="dark" />;
  }

  if (error && !feed) {
    return (
      <StateScreen
        theme="dark"
        title="Не удалось загрузить ленту"
        description={error}
      />
    );
  }

  if (!feed) {
    return (
      <StateScreen
        theme="dark"
        title={
          routeId === undefined ? 'Пока нет моделей' : 'Модель не найдена'
        }
        description={
          routeId === undefined
            ? 'Опубликованных моделей лицензирования пока нет.'
            : 'Возможно, ссылка устарела или модель удалена.'
        }
        action={<Link to={ROUTES.GRID}>Перейти в плитку</Link>}
      />
    );
  }

  const handleNext = () => {
    if (nextFeed) {
      navigate(buildLicensingRoute(nextFeed.id));
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, {
        state: { from: buildLicensingRoute(feed.id) },
      });
      return;
    }

    void dispatch(
      toggleLike({
        id: feed.id,
        like: feed.is_liked !== 1,
      }),
    );
  };

  return (
    <>
      <MockNotice isVisible={mockFallback} />
      <LicensingSlide
        key={feed.id}
        licensing={feed}
        hasNext={Boolean(nextFeed)}
        onNext={handleNext}
        onLike={handleLike}
        isLiked={feed.is_liked === 1}
        isBusy={isBusy}
      />
    </>
  );
};
