// Netlify runs this automatically after every verified (non-spam) form submission.
// It forwards the lead to the Go High Level inbound webhook set in the
// GHL_WEBHOOK_URL environment variable (Netlify > Site configuration > Environment variables).
export const handler = async (event) => {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { statusCode: 200, body: 'GHL_WEBHOOK_URL not set; skipped' };

  const { payload } = JSON.parse(event.body);
  const d = payload.data || {};
  const lead = {
    name: d.name,
    phone: d.phone,
    zip: d.zip,
    property_type: d.property_type,
    leak_description: d.leak_description,
    photo_url: d.photo?.url || d.photo || '',
    source_domain: d.source_domain,
    source_page: d.source_page,
    landing_page: d.landing_page,
    form_location: d.form_location,
    utm_source: d.utm_source,
    utm_medium: d.utm_medium,
    utm_campaign: d.utm_campaign,
    utm_term: d.utm_term,
    utm_content: d.utm_content,
    submitted_at: payload.created_at,
    tags: ['web-lead', d.source_domain, d.property_type].filter(Boolean),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  return { statusCode: res.ok ? 200 : 502, body: `GHL responded ${res.status}` };
};
