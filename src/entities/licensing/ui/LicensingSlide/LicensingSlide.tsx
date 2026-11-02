import type { FC } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

import {
  formatMoney,
  formatNumber,
  resolveImageUrl,
  resolveVideoUrl,
} from '@/shared/lib';

import type { Licensing } from '../../model/types';
import './LicensingSlide.css';

interface LicensingSlideProps {
  licensing: Licensing;
  initialDescriptionExpanded?: boolean;
  hasNext?: boolean;
  onNext?: () => void;
}

/**
 * Полноэкранная карточка ленты: видео (или обложка), заголовок,
 * раскрываемое описание, параметры расчёта, лайки и кнопка «следующий».
 * Используется и на странице «Лента», и на странице «Подробнее».
 */
export const LicensingSlide: FC<LicensingSlideProps> = ({
  licensing,
  initialDescriptionExpanded = false,
  hasNext = false,
  onNext,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(
    initialDescriptionExpanded,
  );
  const [isVideoFailed, setIsVideoFailed] = useState(false);

  const title = licensing.title || 'Без названия';
  const description = licensing.description || 'Описание отсутствует';
  const imageUrl = resolveImageUrl(licensing.image_url);
  const videoUrl = resolveVideoUrl(licensing.video_url);

  const handleDescriptionToggle = () => {
    setIsDescriptionExpanded((isExpanded) => !isExpanded);
  };

  return (
    <section className="feedPage">
      <div className="feedVideoWrapper">
        {isVideoFailed ? (
          <img className="feedMedia" src={imageUrl} alt={title} />
        ) : (
          <video
            className="feedMedia"
            src={videoUrl}
            poster={imageUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-label={title}
            onError={() => setIsVideoFailed(true)}
          />
        )}

        <div className="feedOverlay">
          <div className="feedLeft">
            <h2 className="feedTitle">{title}</h2>

            <div className="feedDescWrapper">
              <p
                className={`feedDesc ${
                  isDescriptionExpanded ? 'feedDescFull' : 'feedDescShort'
                }`}
              >
                {description}
              </p>

              <button
                type="button"
                className="feedMoreLink"
                onClick={handleDescriptionToggle}
              >
                {isDescriptionExpanded ? 'Меньше' : 'Ещё'}
              </button>
            </div>
          </div>

          <div className="feedRight">
            <div className="feedParamRow">
              <span className="feedParamLabel">Комиссия:</span>
              <span className="feedParamValue">
                {formatMoney(licensing.commission_per_unit)}
              </span>
            </div>

            <div className="feedParamRow">
              <span className="feedParamLabel">Мин. для расчёта:</span>
              <span className="feedParamValue">
                {formatNumber(licensing.min_for_calc)}
              </span>
            </div>

            <span
              className="feedLike"
              aria-label={`Лайков: ${licensing.likes_count}`}
            >
              <span className="feedHeart">❤️</span>
              <span className="feedLikeCount">{licensing.likes_count}</span>
            </span>

            <Button
              type="button"
              className="feedNextButton"
              disabled={!hasNext}
              onClick={onNext}
            >
              следующий→
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
