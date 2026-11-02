export const EMPTY_VALUE = '—';

export const formatMoney = (value: number | null | undefined): string =>
  typeof value === 'number' ? `₽ ${value}` : EMPTY_VALUE;

export const formatNumber = (value: number | null | undefined): string =>
  typeof value === 'number' ? String(value) : EMPTY_VALUE;
