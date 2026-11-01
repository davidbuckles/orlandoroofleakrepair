# Flat roof leak lead-gen site (Astro + Tailwind)

Static lead-gen template. Built first for **orlandoroofleakrepair.com** (flat and low-slope roof leaks); clone it for the other domains.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview    # serves dist/ to check the production build
```

## Where things live

| What | File |
| --- | --- |
| Name, domain, phone, license, cities, keywords, tracking IDs, colors, nav | `site.config.json` |
| Page copy, titles, meta descriptions, FAQs, related links | `src/content/pages/*.md` (filename = page id in config) |
| Quote page / thank-you page | `src/pages/get-a-quote.astro`, `src/pages/thank-you.astro` |
| Shared sections (hero, form, steps, areas, FAQ, footer) | `src/components/` |
| GTM dataLayer events | `src/scripts/tracking.ts` |
| Lead → Go High Level | `netlify/functions/submission-created.mjs` |
| www → non-www redirect | written at build by `astro.config.mjs` |

## Before launch (not done yet)

- [ ] **Phone:** `contact.phoneDisplay` / `phoneE164` are Bradford's forwarding line (407-947-1851). Swap in this site's CallRail number.
- [ ] **GTM:** put the container ID in `tracking.gtmId`. Inside GTM, add GA4, Clarity and CallRail tags.
- [ ] **Cost page:** has no price ranges. Add real ranges from Bradford's jobs if you want them on the page.
- [ ] **Photos:** none yet. Add real job photos only: put them in `src/assets/photos/`, then list them in `site.config.json` → `photos.hero` (filename) and `photos.projects` (`{ "file", "title", "city", "alt" }`). Astro converts them to WebP with width/height set. The "Real Repairs. Real Results." section stays hidden until `projects` has entries.
- [ ] **Years in business / reviews:** set `trust.yearsInBusiness` and `trust.reviews` once confirmed. They show up automatically.
- [ ] **Business name:** "Orlando Flat Roof Leak Repair". Confirm it's registered as a Florida fictitious name and qualified under CCC1335348 with DBPR.
- [ ] **Text alerts:** decide who gets Go High Level lead texts and during which hours.

## GTM events pushed by the site

| Event | When | Parameters |
| --- | --- | --- |
| `click_to_call` | any `tel:` tap | `click_location` (hero, header, sticky_bar, bottom_cta, footer, quote_page, thank_you) |
| `generate_lead` | thank-you page load after a submit (once) | `property_type` |
| `faq_open` | FAQ opened | `faq_question` |
| `scroll_depth` | 25/50/75/90% | `percent_scrolled` |

`phone_call` (calls over 60 s) comes from CallRail's GA4 integration, not the site.

In GTM: make a Custom Event trigger for each event name, add Data Layer Variables for the parameters, and send them to GA4 as events. Mark `generate_lead`, `click_to_call` and `phone_call` as key events in GA4.

## Spam protection

Honeypot field + Netlify's built-in spam filter are always on. Set `forms.recaptcha` to `true` to add Netlify reCAPTCHA. It costs mobile PageSpeed points, so turn it on only if spam gets through.

## Cloning for another domain

1. Copy the repo (new GitHub repo per domain).
2. Edit `site.config.json`: domain, url, businessName, phone (that site's CallRail number), GTM/GA4 IDs, colors, `pages` (paths + keywords).
3. **Rewrite every file in `src/content/pages/`.** Don't just swap place names; Google treats that as doorway pages. New copy, new FAQs, new photos.
4. Create a new Netlify site for it (steps below).

## Deploy to Netlify

1. Push this folder to a new **private** GitHub repo.
2. Netlify → **Add new site → Import an existing project → GitHub** → pick the repo. Build command `npm run build` and publish dir `dist` are read from `netlify.toml`.
3. **Forms:** Site configuration → Forms → **Enable form detection**, then redeploy so Netlify finds the `quote` form.
4. **Lead email:** Forms → Form notifications → Add notification → Email → `David@Bradford-Roofing.com`, form `quote`.
5. **Go High Level:** Site configuration → Environment variables → add `GHL_WEBHOOK_URL` = your GHL inbound webhook URL, then redeploy.
6. **Domain:** Domain management → Add domain → `orlandoroofleakrepair.com` (add `www` too). Point DNS at Netlify, then wait for the HTTPS certificate.
7. **Test:** submit the form on the live site. Check the email, the thank-you page, the GHL contact, and GA4 DebugView.
8. Search Console: verify via DNS and submit `https://orlandoroofleakrepair.com/sitemap-index.xml`.
