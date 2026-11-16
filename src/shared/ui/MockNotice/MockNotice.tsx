import type { FC } from 'react';

import './MockNotice.css';

interface MockNoticeProps {
  isVisible: boolean;
}

export const MockNotice: FC<MockNoticeProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="mockNotice" role="status">
      Бэкенд недоступен — показаны mock-данные
    </div>
  );
};
