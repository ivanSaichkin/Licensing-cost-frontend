import type { FC } from 'react';
import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  deleteLicensing,
  fetchLicensings,
  LicensingCard,
  splitIntoColumns,
} from '@/entities/licensing';
import {
  applyFilter,
  LicensingFilter,
  setMaxCommission,
} from '@/features/licensing-filter';
import { buildLicensingRoute } from '@/shared/config';
import { MockNotice, PageLoader, StateScreen } from '@/shared/ui';

import './GridPage.css';

/**
 * «Плитка» — список моделей в две колонки. Фильтр хранится в Redux
 * и передаётся в запрос к бэкенду параметром max_commission.
 */
export const GridPage: FC = () => {
  const dispatch = useAppDispatch();
  const { maxCommission, appliedMaxCommission } = useAppSelector(
    (state) => state.filter,
  );
  const { items, isLoading, error, mockFallback } = useAppSelector(
    (state) => state.licensing,
  );
  const isAuthenticated = useAppSelector(
    (state) => state.session.isAuthenticated,
  );
  const isBusy = useAppSelector((state) => state.requests.pending > 0);

  useEffect(() => {
    dispatch(
      fetchLicensings({
        maxCommission: appliedMaxCommission,
        isGuest: !isAuthenticated,
      }),
    );
  }, [dispatch, appliedMaxCommission, isAuthenticated]);

  const [leftColumn, rightColumn] = useMemo(
    () => splitIntoColumns(items),
    [items],
  );

  const handleApply = () => {
    dispatch(applyFilter());
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Удалить модель лицензирования?')) {
      void dispatch(deleteLicensing(id));
    }
  };

  return (
    <div className="gridPage">
      <h1 className="pageTitle">Модели лицензирования</h1>

      <MockNotice isVisible={mockFallback} />

      <LicensingFilter
        maxCommission={maxCommission}
        onMaxCommissionChange={(value) =>
          dispatch(setMaxCommission(value))
        }
        onApply={handleApply}
        disabled={isLoading || isBusy}
      />

      {isLoading && items.length === 0 ? (
        <PageLoader />
      ) : error && items.length === 0 ? (
        <StateScreen
          title="Не удалось загрузить модели"
          description={error}
        />
      ) : items.length === 0 ? (
        <StateScreen
          title="Ничего не найдено"
          description="По выбранной комиссии моделей нет. Увеличьте значение фильтра и нажмите «Найти»."
        />
      ) : (
        <>
          {error ? (
            <div className="gridError" role="alert">
              {error}
            </div>
          ) : null}

          <div className="cardsGrid">
            <div className="gridColumn">
              {leftColumn.map((licensing) => (
                <LicensingCard
                  key={licensing.id}
                  licensing={licensing}
                  href={buildLicensingRoute(licensing.id)}
                  isBusy={isBusy}
                  onDelete={
                    isAuthenticated && licensing.is_creator === 1
                      ? () => handleDelete(licensing.id)
                      : undefined
                  }
                />
              ))}
            </div>

            <div className="gridColumn">
              {rightColumn.map((licensing) => (
                <LicensingCard
                  key={licensing.id}
                  licensing={licensing}
                  href={buildLicensingRoute(licensing.id)}
                  isBusy={isBusy}
                  onDelete={
                    isAuthenticated && licensing.is_creator === 1
                      ? () => handleDelete(licensing.id)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
