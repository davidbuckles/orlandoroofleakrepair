import { config, allCities, absUrl, page, servicePageIds } from './config';

const orgId = `${config.site.url}/#business`;
const siteId = `${config.site.url}/#website`;

const cityNodes = () => allCities.map((name) => ({ '@type': 'City', name: `${name}, ${config.site.state}` }));
const countyNodes = () =>
  config.serviceArea.counties.map((c) => ({ '@type': 'AdministrativeArea', name: `${c.name} County, ${config.site.state}` }));

export function website() {
  return {
    '@type': 'WebSite',
    '@id': siteId,
    name: config.site.businessName,
    url: absUrl('/'),
    publisher: { '@id': orgId },
    inLanguage: 'en-US',
  };
}

// Service-area business: no street address on purpose (brief: no fake address).
export function roofingContractor() {
  const node: Record<string, unknown> = {
    '@type': 'RoofingContractor',
    '@id': orgId,
    name: config.site.businessName,
    url: absUrl('/'),
    telephone: config.contact.phoneE164,
    description: config.site.description,
    areaServed: [...cityNodes(), ...countyNodes()],
    knowsAbout: ['Roof leak repair', 'Shingle roofs', 'Tile roofs', 'Metal roofs', 'Flat roofs', 'TPO roofs', 'Modified bitumen roofs', 'Roof flashing'],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: `${config.license.credentialName} ${config.license.number}`,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Roof leak repair services',
      itemListElement: servicePageIds.map((id) => {
        const p = page(id);
        return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: p.serviceName, url: absUrl(p.path) } };
      }),
    },
  };
  if (config.site.sameAs.length) node.sameAs = config.site.sameAs;
  if (config.claims.emergency247) {
    node.openingHoursSpecification = {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    };
  }
  const r = config.trust.reviews;
  if (r.enabled && r.rating && r.count) {
    node.aggregateRating = { '@type': 'AggregateRating', ratingValue: r.rating, reviewCount: r.count };
  }
  return node;
}

export function service(name: string, path: string, description: string) {
  return {
    '@type': 'Service',
    name,
    serviceType: name,
    description,
    url: absUrl(path),
    provider: { '@id': orgId },
    areaServed: cityNodes(),
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbs(crumbs: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

export function crumbsFor(id: string) {
  const home = { name: 'Home', path: '/' };
  if (id === 'home') return [home];
  const p = page(id);
  const trail = [{ name: p.label, path: p.path }];
  if (p.parent) trail.unshift({ name: page(p.parent).label, path: page(p.parent).path });
  return [home, ...trail];
}
