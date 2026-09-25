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

## Stock photos in use (kept 2026-09-25)

Served from `public/images/stock/` (downloaded 2026-09-25) — never hotlinked from Unsplash, so visitors'
IP addresses are not sent to a third party (RGPD). The file name of #5 carries the ad warning.

| # | Unsplash photo ID | Subject | Used on | Status |
|---|---|---|---|---|
| 1 | `1600585154340-be6161a56a0c` | Contemporary house | Homepage hero | OK decoration |
| 2 | `1484154218962-a197022b5858` | White kitchen | Homepage hero, Rénovation header | OK decoration |
| 3 | `1562259949-e8e7689d7828` | Paint roller | Homepage hero, Peinture header | OK decoration |
| 4 | `1552321554-5fefe8c9ef14` | Bright bathroom | Homepage hero, Salles de bains header | OK decoration |
| 5 | `1621905251189-08b45d6a269e` | Electrician at work (**recognisable person**) | Électricité header | ⚠️ **NEVER USE IN ADS.** Site only. No model release; looks like our employee. Replace with a photo of our own team when available. |
| 6 | `1600210492486-724fe5c67fb0` | Living room with parquet | Revêtements de sol header | OK decoration |

## Must be replaced before launch

| Unsplash photo ID | Where | Why |
|---|---|---|
| `1620626011761-996317b8d101` | Case study "Issy-les-Moulineaux" (`lib/services-data.ts`) | Stock photo presented as our project |
| `1507652313519-d4e9174996dd` | Case study "Boulogne-Billancourt" (`lib/services-data.ts`) | Stock photo presented as our project |

## Development-only samples (never shown in production)

`TEMP preview` block in `app/[locale]/services/[slug]/page.tsx`:
`1584622650111-993a426fbf0a`, `1600566752355-35792bedcfea`, `1604709177225-055f99402ea3`,
`1564540583246-934409427776`, `1631889993959-41b4e9c6e3c5` (plus #4, #7, #8 above).

## Own assets

| File | What | Owner |
|---|---|---|
| `public/main.png` | Current logo | Atouts Services |
| `public/models/hex-nut.glb` | 3D hex nut (generated with Three.js GLTFExporter) | Atouts Services |
| `public/icons/*.svg` | App / PWA icons | Atouts Services |
| `../brand-archive/logo-ancien-atouts-services.png` (outside the site) | **Old logo**, archived 2026-09-25 (was `public/ats.png` + an identical Lovable copy, both removed) | Atouts Services |

Unused Next.js template SVGs removed 2026-09-25.
