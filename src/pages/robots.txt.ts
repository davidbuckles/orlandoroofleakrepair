import type { APIRoute } from 'astro';
import { absUrl } from '../lib/config';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\nDisallow: /thank-you/\n\nSitemap: ${absUrl('/sitemap-index.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
