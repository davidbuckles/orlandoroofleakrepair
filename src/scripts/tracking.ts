// Pushes engagement events to the GTM dataLayer and fills hidden form fields.
type DL = Record<string, unknown>[];
const dl: DL = ((window as any).dataLayer = (window as any).dataLayer || []);

// click_to_call: every tel: link, with where it was tapped
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a[href^="tel:"]') as HTMLAnchorElement | null;
  if (!a) return;
  dl.push({ event: 'click_to_call', click_location: a.dataset.location || 'inline', page_path: location.pathname });
});

// faq_open
document.querySelectorAll<HTMLDetailsElement>('details[data-faq]').forEach((d) => {
  d.addEventListener('toggle', () => {
    if (d.open) dl.push({ event: 'faq_open', faq_question: d.dataset.faq });
  });
});

// scroll_depth at 25/50/75/90%
const marks = [25, 50, 75, 90];
const hit = new Set<number>();
window.addEventListener(
  'scroll',
  () => {
    const h = document.documentElement;
    const pct = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
    for (const m of marks) {
      if (pct >= m && !hit.has(m)) {
        hit.add(m);
        dl.push({ event: 'scroll_depth', percent_scrolled: m });
      }
    }
  },
  { passive: true },
);

// Keep first-touch UTMs for the session so they survive page changes before the form.
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const params = new URLSearchParams(location.search);
function store(key: string, val: string) {
  try { sessionStorage.setItem(key, val); } catch {}
}
function read(key: string) {
  try { return sessionStorage.getItem(key) || ''; } catch { return ''; }
}
UTM.forEach((k) => {
  const v = params.get(k);
  if (v && !read(k)) store(k, v);
});
if (!read('landing_page')) store('landing_page', location.pathname);

document.querySelectorAll<HTMLFormElement>('form[data-quote-form]').forEach((form) => {
  const set = (name: string, val: string) => {
    const el = form.elements.namedItem(name) as HTMLInputElement | null;
    if (el) el.value = val;
  };
  set('source_page', location.pathname);
  set('landing_page', read('landing_page'));
  UTM.forEach((k) => set(k, read(k)));
  form.addEventListener('submit', () => {
    const type = (form.elements.namedItem('property_type') as RadioNodeList | null)?.value || '';
    store('lead_property_type', type);
    store('lead_pending', '1');
  });
});
