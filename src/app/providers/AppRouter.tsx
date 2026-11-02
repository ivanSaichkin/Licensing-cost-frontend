import type { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AddPage } from '@/pages/add';
import { FeedPage } from '@/pages/feed';
import { GridPage } from '@/pages/grid';
import { LICENSING_ROUTE_PATTERN, ROUTES } from '@/shared/config';
import { AppLayout } from '@/widgets/app-layout';

export const AppRouter: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.FEED} element={<FeedPage />} />
        <Route path={ROUTES.GRID} element={<GridPage />} />
        <Route path={ROUTES.ADD} element={<AddPage />} />
        <Route path={ROUTES.LICENSING} element={<FeedPage />} />
        <Route path={LICENSING_ROUTE_PATTERN} element={<FeedPage />} />
        <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
