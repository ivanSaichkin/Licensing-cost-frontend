import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { isAddRoute, isFeedRoute, isGridRoute, ROUTES } from '@/shared/config';

import './BottomNavigation.css';

interface NavItemProps {
  label: string;
  to: string;
  isActive: boolean;
}

const NavItem: FC<NavItemProps> = ({ label, to, isActive }) => (
  <Link
    className={`navItem ${isActive ? 'navItemActive' : ''}`}
    to={to}
    aria-current={isActive ? 'page' : undefined}
  >
    <span className="navLabel">{label}</span>
  </Link>
);

/**
 * Нижняя таб-панель из трёх пунктов: Лента, Добавление, Плитка.
 * Как в SSR-шаблонах предыдущих лабораторных.
 */
export const BottomNavigation: FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bottomNav" aria-label="Основная навигация">
      <NavItem
        label="Лента"
        to={ROUTES.FEED}
        isActive={isFeedRoute(pathname)}
      />
      <NavItem
        label="Добавление"
        to={ROUTES.ADD}
        isActive={isAddRoute(pathname)}
      />
      <NavItem
        label="Плитка"
        to={ROUTES.GRID}
        isActive={isGridRoute(pathname)}
      />
    </nav>
  );
};
