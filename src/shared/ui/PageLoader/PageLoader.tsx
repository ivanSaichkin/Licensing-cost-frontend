import type { FC } from 'react';
import { Spinner } from 'react-bootstrap';

import './PageLoader.css';

interface PageLoaderProps {
  theme?: 'light' | 'dark';
}

export const PageLoader: FC<PageLoaderProps> = ({ theme = 'light' }) => (
  <div
    className={`pageLoader pageLoader_${theme}`}
    role="status"
    aria-live="polite"
  >
    <Spinner animation="border" className="pageLoaderSpinner" />
    <span className="visually-hidden">Загрузка данных</span>
  </div>
);
