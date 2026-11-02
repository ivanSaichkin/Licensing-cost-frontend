import type { FC, FormEvent } from 'react';
import { Button, Form } from 'react-bootstrap';

import {
  COMMISSION_STEP,
  MAX_COMMISSION,
  MIN_COMMISSION,
} from '../model/constants';
import './LicensingFilter.css';

interface LicensingFilterProps {
  maxCommission: number;
  onMaxCommissionChange: (value: number) => void;
  onApply: () => void;
  disabled?: boolean;
}

/**
 * Фильтр плитки по максимальной комиссии — повторяет слайдер
 * из SSR-шаблона плитки (0–600 ₽ с шагом 10).
 */
export const LicensingFilter: FC<LicensingFilterProps> = ({
  maxCommission,
  onMaxCommissionChange,
  onApply,
  disabled = false,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply();
  };

  return (
    <form className="filterForm" onSubmit={handleSubmit}>
      <div className="sliderRow">
        <label className="filterLabel" htmlFor="maxCommission">
          Макс. комиссия:{' '}
          <span className="filterValue">{maxCommission}</span> ₽
        </label>

        <Form.Range
          id="maxCommission"
          min={MIN_COMMISSION}
          max={MAX_COMMISSION}
          step={COMMISSION_STEP}
          value={maxCommission}
          disabled={disabled}
          onChange={(event) =>
            onMaxCommissionChange(Number(event.currentTarget.value))
          }
        />
      </div>

      <Button type="submit" className="searchButton" disabled={disabled}>
        Найти
      </Button>
    </form>
  );
};
