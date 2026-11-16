export const ROUTES = {
  FEED: '/',
  GRID: '/grid',
  ADD: '/add',
  LOGIN: '/login',
  LICENSING: '/licensing',
} as const;

export const LICENSING_ROUTE_PATTERN = `${ROUTES.LICENSING}/:id`;

export const buildLicensingRoute = (id: number): string =>
  `${ROUTES.LICENSING}/${id}`;

export const isFeedRoute = (pathname: string): boolean =>
  pathname === ROUTES.FEED ||
  pathname === ROUTES.LICENSING ||
  pathname.startsWith(`${ROUTES.LICENSING}/`);

export const isGridRoute = (pathname: string): boolean =>
  pathname === ROUTES.GRID;

export const isAddRoute = (pathname: string): boolean =>
  pathname === ROUTES.ADD;

export const isLoginRoute = (pathname: string): boolean =>
  pathname === ROUTES.LOGIN;
