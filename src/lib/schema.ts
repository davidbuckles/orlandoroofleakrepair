import { config, allCities, absUrl, page } from './config';

const orgId = `${config.site.url}/#business`;

// Service-area business: no street address on purpose (brief: no fake address).
export function roofingContractor() {
  const node: Record<string, unknown> = {
    '@type': 'RoofingContractor',
    '@id': orgId,
    name: config.site.businessName,
    url: absUrl('/'),
    telephone: config.contact.phoneE164,
    description: config.site.description,
    areaServed: allCities.map((name) => ({
      '@type': 'City',
      name: `${name}, ${config.site.state}`,
    })),
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'license',
      name: `Florida Certified Commercial Roofing Contractor ${config.license.number}`,
    },
  };
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
    areaServed: allCities.map((c) => ({ '@type': 'City', name: `${c}, ${config.site.state}` })),
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
  return [home, { name: p.label, path: p.path }];
}
