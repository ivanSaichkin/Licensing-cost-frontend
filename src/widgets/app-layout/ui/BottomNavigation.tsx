import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { clearLicensing } from '@/entities/licensing';
import { loggedOut, logoutRequest } from '@/entities/session';
import { resetFilter } from '@/features/licensing-filter';
import {
  isAddRoute,
  isFeedRoute,
  isGridRoute,
  isLoginRoute,
  ROUTES,
} from '@/shared/config';
import { clearStoredAuth } from '@/shared/lib';
import { requestFinished, requestStarted } from '@/shared/model';

import './BottomNavigation.css';

interface NavItemProps {
  label: string;
  to?: string;
  isActive: boolean;
  isAvailable?: boolean;
  onClick?: () => void;
}

const NavItem: FC<NavItemProps> = ({
  label,
  to,
  isActive,
  isAvailable = true,
  onClick,
}) => {
  if (onClick) {
    return (
      <button
        type="button"
        className={`navItem navItemButton ${
          isActive ? 'navItemActive' : ''
        }`}
        onClick={onClick}
      >
        <span className="navLabel">{label}</span>
      </button>
    );
  }

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
 * Меню гостя: Лента, Добавление (недоступно), Плитка, Вход.
 * Меню пользователя: Лента, Добавление, Плитка, Выход.
 */
export const BottomNavigation: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector(
    (state) => state.session,
  );

  const handleLogout = async () => {
    dispatch(requestStarted());

    try {
      if (token) {
        await logoutRequest(token);
      }
    } catch {
      // Локальный выход выполняем даже если сервер недоступен.
    } finally {
      clearStoredAuth();
      dispatch(loggedOut());
      dispatch(resetFilter());
      dispatch(clearLicensing());
      dispatch(requestFinished());
      window.location.assign(ROUTES.FEED);
    }
  };

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
        isAvailable={isAuthenticated}
      />
      <NavItem
        label="Плитка"
        to={ROUTES.GRID}
        isActive={isGridRoute(pathname)}
      />
      {isAuthenticated ? (
        <NavItem
          label="Выход"
          isActive={false}
          onClick={() => {
            void handleLogout();
          }}
        />
      ) : (
        <NavItem
          label="Вход"
          to={ROUTES.LOGIN}
          isActive={isLoginRoute(pathname)}
        />
      )}
    </nav>
  );
};
