# Image register

Every image used by the site, where it comes from, and how it may be used.
Update this file whenever an image is added, replaced or removed.

## Rules

- **Stock photos are decoration only.** Never present a stock photo as one of our own
  projects (Réalisations, Avant/Après, case studies). That is misleading advertising
  (Code de la consommation, art. L121-2).
- **Photos showing a recognisable person are never used in ads** (Google Ads, social ads,
  flyers) unless we hold a signed model release from that person.
- Unsplash License: free commercial use, no attribution required; forbidden to resell
  unmodified or to build a competing photo library. https://unsplash.com/license

## Stock photos in use (owner's selection, 2026-09-25)

**Source of truth: `lib/site-images.ts`** (also shown in the admin → *Photos du site*, with download buttons).
Files live in `public/images/stock/` — never hotlinked from Unsplash, so visitors' IP addresses are not sent
to a third party (RGPD). Only photos 1–6 are kept; 7–13 (case-study placeholders and before/after samples)
were removed on 2026-09-25.

| # | File | Subject | Used on | Status |
|---|---|---|---|---|
| 1 | `maison-contemporaine.jpg` | Contemporary house | Homepage hero | OK decoration |
| 2 | `cuisine-blanche.jpg` | White kitchen | Homepage hero, Rénovation header | OK decoration |
| 3 | `rouleau-peinture.jpg` | Paint roller | Homepage hero, Peinture header | OK decoration |
| 4 | `salle-de-bains-lumineuse.jpg` | Bright bathroom | Homepage hero, Salles de bains header | OK decoration |
| 5 | `electricien-au-travail.jpg` | Electrician at work (**recognisable person**) | Électricité header | ⚠️ **NEVER USE IN ADS.** Site only. No model release. Replace with a photo of our own team when available. |
| 6 | `salon-parquet.jpg` | Living room with parquet | Revêtements de sol header | OK decoration |

Service pages no longer use a before/after slider as hero; the Avant/Après gallery only shows real projects
added from the admin.

## Own assets

| File | What | Owner |
|---|---|---|
| `public/main.png` | Current logo | Atouts Services |
| `public/models/hex-nut.glb` | 3D hex nut (generated with Three.js GLTFExporter) | Atouts Services |
| `public/icons/*.svg` | App / PWA icons | Atouts Services |
| `../brand-archive/logo-ancien-atouts-services.png` (outside the site) | **Old logo**, archived 2026-09-25 (was `public/ats.png` + an identical Lovable copy, both removed) | Atouts Services |

Unused Next.js template SVGs removed 2026-09-25.
