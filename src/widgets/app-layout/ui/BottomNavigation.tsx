import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { isAddRoute, isFeedRoute, isGridRoute, ROUTES } from '@/shared/config';

import './BottomNavigation.css';

interface NavItemProps {
  label: string;
  to?: string;
  isActive: boolean;
  isAvailable?: boolean;
}

const NavItem: FC<NavItemProps> = ({
  label,
  to,
  isActive,
  isAvailable = true,
}) => {
  if (!isAvailable || !to) {
    return (
      <span
        className={`navItem navItemLocked ${
          isActive ? 'navItemActive' : ''
        }`}
        aria-disabled="true"
        aria-current={isActive ? 'page' : undefined}
        title="Недоступно для гостя"
      >
        <span className="navLabel">{label}</span>
      </span>
    );
  }

  return (
    <Link
      className={`navItem ${isActive ? 'navItemActive' : ''}`}
      to={to}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="navLabel">{label}</span>
    </Link>
  );
};

/**
 * Нижняя таб-панель из четырёх пунктов: Лента, Добавление, Плитка, Вход.
 * По заданию лабораторной 5 доступны только «Лента» и «Плитка»:
 * «Добавление» и «Вход» отображаются, но не нажимаются.
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
        isAvailable={false}
      />
      <NavItem
        label="Плитка"
        to={ROUTES.GRID}
        isActive={isGridRoute(pathname)}
      />
      <NavItem label="Вход" isActive={false} isAvailable={false} />
    </nav>
  );
};
