import raw from '../../site.config.json';

export const config = raw;
export type PageId = keyof typeof raw.pages;

export interface PageConfig {
  path: string;
  label: string;
  primaryKeyword: string;
  supportingTerms: string[];
  anchor: string;
  serviceName?: string;
  parent?: string;
  card?: { title: string; blurb: string; icon: string };
  logo?: { line1: string; line2: string };
}

// Header logo text: a page can override the site-wide logo in site.config.json.
export function logoFor(pathname: string) {
  const p = Object.values(raw.pages as Record<string, PageConfig>).find((pg) => pg.path === pathname);
  return p?.logo ?? raw.logo;
}

export const servicePageIds = Object.entries(raw.pages as Record<string, PageConfig>)
  .filter(([, p]) => p.card)
  .map(([id]) => id);

export function page(id: string): PageConfig {
  const p = (raw.pages as Record<string, PageConfig>)[id];
  if (!p) throw new Error(`No page "${id}" in site.config.json`);
  return p;
}

export const allCities = raw.serviceArea.counties.flatMap((c) => c.cities);

export const telHref = `tel:${raw.contact.phoneE164}`;

export const licenseLine = `${raw.license.label} ${raw.license.number}`;

export function absUrl(path: string): string {
  return new URL(path, raw.site.url).href;
}
