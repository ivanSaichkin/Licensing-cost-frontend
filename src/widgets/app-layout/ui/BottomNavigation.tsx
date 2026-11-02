import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { isFeedRoute, isGridRoute, ROUTES } from '@/shared/config';

import './BottomNavigation.css';

interface NavItemProps {
  label: string;
  to?: string;
  isActive?: boolean;
  hint?: string;
}

const NavItem: FC<NavItemProps> = ({
  label,
  to,
  isActive = false,
  hint,
}) => {
  if (!to) {
    return (
      <span
        className="navItem navItemDisabled"
        title={hint}
        aria-label={`${label}: недоступно в лабораторной 5`}
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
 * Нижняя таб-панель из четырёх пунктов. В лабораторной 5 доступны
 * только «Лента» и «Плитка»; «Добавление» и «Вход» появятся в lab 6.
 */
export const BottomNavigation: FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="bottomNav" aria-label="Основная навигация">
      <NavItem label="Лента" to={ROUTES.FEED} isActive={isFeedRoute(pathname)} />
      <NavItem
        label="Добавление"
        hint="Добавление моделей появится в лабораторной 6"
      />
      <NavItem label="Плитка" to={ROUTES.GRID} isActive={isGridRoute(pathname)} />
      <NavItem label="Вход" hint="Авторизация появится в лабораторной 6" />
    </nav>
  );
};
