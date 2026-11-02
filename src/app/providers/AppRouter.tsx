import type { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { FeedPage } from '@/pages/feed';
import { GridPage } from '@/pages/grid';
import { LicensingPage } from '@/pages/licensing';
import { LICENSING_ROUTE_PATTERN, ROUTES } from '@/shared/config';
import { AppLayout } from '@/widgets/app-layout';

export const AppRouter: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.FEED} element={<FeedPage />} />
        <Route path={ROUTES.GRID} element={<GridPage />} />
        <Route path={LICENSING_ROUTE_PATTERN} element={<LicensingPage />} />
        <Route
          path="*"
          element={<Navigate to={ROUTES.FEED} replace />}
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
