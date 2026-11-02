import type { FC } from 'react';
import { useState } from 'react';

import { LicensingSlide, useLicensings } from '@/entities/licensing';
import { PageLoader, StateScreen } from '@/shared/ui';

/**
 * «Лента» — полноэкранная карточка модели с видео и кнопкой
 * «следующий→», как в SSR-шаблоне feed.
 */
export const FeedPage: FC = () => {
  const { licensings, isLoading, error } = useLicensings();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const safeIndex = Math.min(currentIndex, licensings.length - 1);
  const currentLicensing = licensings[safeIndex];
  const hasNext = safeIndex < licensings.length - 1;

  const handleNext = () => {
    setCurrentIndex((index) => Math.min(index + 1, licensings.length - 1));
  };
  return (
    <LicensingSlide
      key={currentLicensing.id}
      licensing={currentLicensing}
      hasNext={hasNext}
      onNext={handleNext}
    />
  );
};
