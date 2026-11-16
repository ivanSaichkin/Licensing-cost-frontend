import type { FC } from 'react';
import { Spinner } from 'react-bootstrap';

import './LoadingOverlay.css';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="loadingOverlay" role="status" aria-live="polite">
      <Spinner animation="border" className="loadingOverlaySpinner" />
      <span className="visually-hidden">Выполняется запрос</span>
    </div>
  );
};
