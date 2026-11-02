import type { Licensing } from './types';

/**
 * Фильтр плитки по максимальной комиссии.
 * Повторяет поведение бэкенда: 0 или отрицательное значение — без фильтра.
 */
export const filterByMaxCommission = (
  licensings: Licensing[],
  maxCommission: number,
): Licensing[] => {
  if (maxCommission <= 0) {
    return licensings;
  }

  return licensings.filter(
    (licensing) => (licensing.commission_per_unit ?? 0) <= maxCommission,
  );
};

/**
 * Раскладывает карточки по двум колонкам так же, как это делал
 * SSR-шаблон плитки: чётные индексы — в левую, нечётные — в правую.
 */
export const splitIntoColumns = (
  licensings: Licensing[],
): [Licensing[], Licensing[]] => {
  const leftColumn: Licensing[] = [];
  const rightColumn: Licensing[] = [];

  licensings.forEach((licensing, index) => {
    if (index % 2 === 0) {
      leftColumn.push(licensing);
    } else {
      rightColumn.push(licensing);
    }
  });

  return [leftColumn, rightColumn];
};

export const findLicensingIndex = (
  licensings: Licensing[],
  id: number,
): number => licensings.findIndex((licensing) => licensing.id === id);
