import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except: api, _next, static files, admin, robots, sitemap
  matcher: [
    '/((?!api|_next|admin|.*\\..*|robots\\.txt|sitemap\\.xml).*)',
  ],
};
