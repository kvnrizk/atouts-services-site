# Be verified and visible on Google — action plan

Written 2026-09-27. Site live: https://www.atoutservice92.fr (Vercel) · API https://api.atoutservice92.fr (Render) · DB Neon · photos Cloudinary.

Same details EVERYWHERE (name / address / phone), letter for letter:

> **Atouts Services** · 20 rue d'Estienne d'Orves, 92130 Issy-les-Moulineaux · **06 34 02 61 80** · https://www.atoutservice92.fr

## Before anything: put the pending changes online

Not committed yet (front, branch `redesign`): Mutuelle de Poitiers instead of AXA, "Île-de-France" instead of "IDF",
and the Google name data (WebSite + alternate spellings "Atout Services", "Atoutservice92"…). → commit + push → Vercel redeploys.

## Tomorrow — the owner (≈ 2 h)

1. **Buy `atoutservices92.fr`** at OVH (≈ €7/year). Free since it expired; Google still shows it for "Atouts Services".
   Then tell Claude → redirect it to www.atoutservice92.fr.
2. **Google Search Console** — https://search.google.com/search-console (Gmail atouts.services92@gmail.com)
   - Add property → **Domain** → `atoutservice92.fr` → copy the TXT `google-site-verification=…`
   - OVH → DNS zone → Add an entry → **TXT**, subdomain `@`, paste → wait 10 min → **Verify**
   - Sitemaps → `sitemap.xml` → Submit
   - URL inspection → `https://www.atoutservice92.fr/` → Request indexing (same for /services/… and /blog)
3. **Google Business Profile** — https://business.google.com
   - First search "Atouts Services Issy" on **Google Maps**: if a listing exists → "Claim this business"; otherwise create it.
   - Category: **Entreprise de rénovation** (+ Électricien, Peintre, Entreprise de salles de bains).
   - "I serve customers at their address": Issy-les-Moulineaux, Boulogne-Billancourt, Vanves, Meudon, Paris, Hauts-de-Seine.
   - Hours, description, services, website, phone, **10+ real job photos**.
   - Verification (postcard / phone / video). Send the profile link to Claude → added to the site.
4. **PagesJaunes** — https://www.pagesjaunes.fr/pros/55983801 → "claim / create Solocal account" →
   website = www.atoutservice92.fr (not Instagram), add renovation / bathrooms / floors, photos.
5. **Mappy** listing says "électricité générale" only → request correction to renovation.
6. **Bing Places** (https://www.bingplaces.com — can import from Google) and **Apple Business Connect** (https://businessconnect.apple.com).
7. **Review the 6 city pages** in /admin/city-pages (Issy, Boulogne, Vanves, Meudon, Paris 15e, Paris 16e) → publish.
8. **Ask 10–15 recent happy clients for a Google review** (link from the Business Profile → "Ask for reviews").

## Tomorrow — Claude

- Commit + push the pending changes; check live.
- Redirect atoutservices92.fr once bought.
- Write 8–10 new city pages (Sèvres, Clamart, Malakoff, Montrouge, Châtillon, Saint-Cloud, Paris 7e, 14e, 17e) as drafts.
- Rework the 5 service pages around real searches (prix, délais, aides, FAQ with FAQPage data).
- Prepare copy-paste texts for the directories below.
- Add the Business Profile link to the site (`sameAs`) + "Laisser un avis" link, once it exists.

## Next days — directories (same details everywhere)

Travaux.com · Houzz · Habitatpresto · Hellopro · StarOfService · 118712 · Yelp · Facebook page · Instagram bio link → website.

## Security to-do (secrets were pasted in chat)

- Cloudinary: generate a new API key → update `CLOUDINARY_URL` on Render.
- Neon: reset the `neondb_owner` password → update `DATABASE_URL` on Render.
- Admin password: change it (it was sent in chat).

## Still open

- Email: contact@atoutservice92.fr (OVH redirect to Gmail) + SMTP sender (Brevo/Resend, SPF/DKIM/DMARC) → quote notifications.
- `lib/legal.ts`: Mutuelle de Poitiers address + policy number, share capital, RM number.
- Certifications (RGE / Qualibat / Qualifelec?) → show on site + listings if they exist.
- Optional: Google Ads account (also unlocks Keyword Planner volumes for the keyword study).

Expected: brand name searches in 1–3 weeks; "rénovation Issy / Boulogne" 1–3 months; sitelinks (the Facebook-style result) are chosen by Google, typically after 1–3 months of brand searches.
