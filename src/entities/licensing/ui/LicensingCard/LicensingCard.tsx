import type { FC, SyntheticEvent } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import {
  DEFAULT_IMAGE_URL,
  formatMoney,
  formatNumber,
  resolveImageUrl,
} from '@/shared/lib';

import type { Licensing } from '../../model/types';
import './LicensingCard.css';

interface LicensingCardProps {
  licensing: Licensing;
  href: string;
}

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const image = event.currentTarget;

  if (!image.src.endsWith(DEFAULT_IMAGE_URL)) {
    image.src = DEFAULT_IMAGE_URL;
  }
};

export const LicensingCard: FC<LicensingCardProps> = ({
  licensing,
  href,
}) => {
  const title = licensing.title || 'Без названия';

  return (
    <Card className="tariffCard">
      <Link
        className="tariffImageLink"
        to={href}
        aria-label={`Открыть модель «${title}»`}
      >
        <Card.Img
          className="tariffImage"
          variant="top"
          src={resolveImageUrl(licensing.image_url)}
          alt={title}
          onError={handleImageError}
        />
      </Link>

      <Card.Body className="tariffBody">
        <div className="tariffTitle">{title}</div>

        <div className="tariffFooter">
          <span className="tariffPrice">
            {formatMoney(licensing.commission_per_unit)}
          </span>
          <span className="tariffMin">
            Мин: {formatNumber(licensing.min_for_calc)}
          </span>
        </div>

        <div className="tariffLikesRow">
          <span
            className="tariffLikes"
            aria-label={`Лайков: ${licensing.likes_count}`}
          >
            ❤️ {licensing.likes_count}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};
