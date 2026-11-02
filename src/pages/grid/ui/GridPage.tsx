import type { FC } from 'react';
import { useMemo, useState } from 'react';

import {
  filterByMaxCommission,
  LicensingCard,
  splitIntoColumns,
  useLicensings,
} from '@/entities/licensing';
import {
  DEFAULT_MAX_COMMISSION,
  LicensingFilter,
} from '@/features/licensing-filter';
import { buildLicensingRoute } from '@/shared/config';
import { PageLoader, StateScreen } from '@/shared/ui';

import './GridPage.css';

/**
 * «Плитка» — список моделей в две колонки с фильтром по комиссии.
 */
export const GridPage: FC = () => {
  const { licensings, isLoading, error } = useLicensings();
  const [maxCommission, setMaxCommission] = useState(DEFAULT_MAX_COMMISSION);
  const [appliedMaxCommission, setAppliedMaxCommission] = useState(
    DEFAULT_MAX_COMMISSION,
  );

  const visibleLicensings = useMemo(
    () => filterByMaxCommission(licensings, appliedMaxCommission),
    [licensings, appliedMaxCommission],
  );

  const [leftColumn, rightColumn] = useMemo(
    () => splitIntoColumns(visibleLicensings),
    [visibleLicensings],
  );

  const handleApply = () => {
    setAppliedMaxCommission(maxCommission);
  };

  return (
    <div className="gridPage">
      <h1 className="pageTitle">Модели лицензирования</h1>

      <LicensingFilter
        maxCommission={maxCommission}
        onMaxCommissionChange={setMaxCommission}
        onApply={handleApply}
        disabled={isLoading}
      />

      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <StateScreen
          title="Не удалось загрузить модели"
          description={error}
        />
      ) : visibleLicensings.length === 0 ? (
        <StateScreen
          title="Ничего не найдено"
          description="По выбранной комиссии моделей нет. Увеличьте значение фильтра и нажмите «Найти»."
        />
      ) : (
        <div className="cardsGrid">
          <div className="gridColumn">
            {leftColumn.map((licensing) => (
              <LicensingCard
                key={licensing.id}
                licensing={licensing}
                href={buildLicensingRoute(licensing.id)}
              />
            ))}
          </div>

          <div className="gridColumn">
            {rightColumn.map((licensing) => (
              <LicensingCard
                key={licensing.id}
                licensing={licensing}
                href={buildLicensingRoute(licensing.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
