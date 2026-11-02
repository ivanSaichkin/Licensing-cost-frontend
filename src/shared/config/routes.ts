export const ROUTES = {
  FEED: '/',
  GRID: '/grid',
  LICENSING: '/licensing',
} as const;

export const LICENSING_ROUTE_PATTERN = `${ROUTES.LICENSING}/:id`;

export const buildLicensingRoute = (id: number): string =>
  `${ROUTES.LICENSING}/${id}`;

export const isFeedRoute = (pathname: string): boolean =>
  pathname === ROUTES.FEED || pathname.startsWith(`${ROUTES.LICENSING}/`);

export const isGridRoute = (pathname: string): boolean =>
  pathname === ROUTES.GRID;
