export const APP_NAME = 'Monorepo API';
export const APP_VERSION = '1.0.0';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const API_ROUTES = {
  HEALTH: '/health',
  USERS: '/api/users',
  PRODUCTS: '/api/products',
} as const;
