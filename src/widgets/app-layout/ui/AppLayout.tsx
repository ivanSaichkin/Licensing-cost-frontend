import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { BottomNavigation } from './BottomNavigation';
import './AppLayout.css';

/**
 * Мобильная оболочка приложения: колонка 390×844 с контентом
 * и закреплённой нижней таб-панелью (как в SSR-шаблонах прошлых лаб).
 */
export const AppLayout: FC = () => (
  <div className="appContainer">
    <main className="appContent">
      <Outlet />
    </main>
    <BottomNavigation />
  </div>
);
