import type { FC } from 'react';
import { Provider } from 'react-redux';

import { store, useAppSelector } from '@/app/store';
import { LoadingOverlay } from '@/shared/ui';

import { AppRouter } from './providers';

const AppContent: FC = () => {
  const isRequestPending = useAppSelector(
    (state) => state.requests.pending > 0,
  );

  return (
    <>
      <AppRouter />
      <LoadingOverlay isVisible={isRequestPending} />
    </>
  );
};

export const App: FC = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);
