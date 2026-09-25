# Visitor analytics (first-party, cookieless) — design

**Goal:** see in `/admin/analytics` who visits (pages, town, source, device) and what it produces (quote
requests, phone clicks), per source / campaign / service, without cookies or stored IP addresses — so it
stays within the CNIL audience-measurement exemption and needs no banner.

**Approved by owner 2026-09-25** (layout inspired by the archived Immo project, minus its RGPD problems:
raw IPs stored forever, IPs sent to ipapi.co, backend requests counted as page views).

## Data flow

```
browser ──(sendBeacon)──▶ Next route /api/collect (Vercel) ──(server-to-server, secret key)──▶ Nest POST /analytics/collect ──▶ Postgres
                            • drops bots                                                      • stores the event
                            • town/country from x-vercel-ip-* headers
                            • visitor = sha256(day salt + IP + UA), 16 hex chars — IP never leaves this function
                            • device from UA, then UA discarded
```

## Stored (tables `page_views`, `site_events`)

page view: date, path, source (Google, Google Ads, Facebook, Direct, …), referrer host, utm source/medium/campaign,
country, city, device, visitor hash. Event: same + `name` (`phone_click`, `quote_submitted`, `quote_step`) and small
`props` (location, step, service). **Not stored:** IP, full user-agent, full referrer URL, gclid.

The visitor hash changes every day (salt = HMAC(secret, date)), so a person can't be followed across days.

## Rules

- Only public pages (`app/[locale]`) are tracked; admin, API and bots are not.
- Retention: 25 months, enforced by `RetentionService` (CNIL maximum for exempt audience measurement).
- Admin read endpoint `GET /analytics/traffic?days=7|30|365` (JWT admin).

## Dashboard

KPIs (visitors, page views, quote requests, phone clicks, conversion rate) · visits per day ·
sources with quotes/calls per source · Google Ads campaigns · top towns · top pages · devices ·
services (visits → quotes) · quote form drop-off per step. Existing business charts stay below.
