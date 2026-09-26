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

### Blog cover photos (added 2026-09-26)

Files in `public/images/blog/<article-slug>.jpg`, resized to 1600 px, self-hosted. Chosen for each article's topic;
no recognisable person. Checked as free Unsplash License photos (Unsplash+ photos cannot be downloaded without a subscription).

| # | File | Subject | Unsplash page | Status |
|---|---|---|---|---|
| 7 | `maprimerenov-2026-travaux-eligibles.jpg` | Outdoor heat pump | [4VCm8l6wLQY](https://unsplash.com/photos/4VCm8l6wLQY) | OK decoration (a brand name is visible on the unit — avoid in ads) |
| 8 | `tva-10-ou-5-5-travaux.jpg` | Calculator, pen, paper | [I3HPUolh5hA](https://unsplash.com/photos/I3HPUolh5hA) | OK decoration |
| 9 | `norme-nf-c-15-100-refaire-electricite.jpg` | Electrical panel | [ufo5IiRdqjc](https://unsplash.com/photos/ufo5IiRdqjc) | OK decoration |
| 10 | `travaux-copropriete-autorisation.jpg` | Haussmannian building facade | [yyb5HOnHfus](https://unsplash.com/photos/yyb5HOnHfus) | OK decoration |
| 11 | `douche-italienne-erreurs-a-eviter.jpg` | Glass walk-in shower | [Ies-rhvusTs](https://unsplash.com/photos/Ies-rhvusTs) | OK decoration — **never present it as our own work** |
| 12 | `duree-renovation-salle-de-bains.jpg` | Renovated bathroom | [JUdaVudt_Ok](https://unsplash.com/photos/JUdaVudt_Ok) | OK decoration — **never present it as our own work** |
| 13 | `parquet-ou-carrelage-cuisine.jpg` | White kitchen, wood-look floor | [UD0_vxdKYMg](https://unsplash.com/photos/UD0_vxdKYMg) | OK decoration |
| 14 | `renover-appartement-ancien-boulogne-billancourt.jpg` | Herringbone parquet | [_e2Jw79ssKo](https://unsplash.com/photos/_e2Jw79ssKo) | OK decoration |


Service pages no longer use a before/after slider as hero; the Avant/Après gallery only shows real projects
added from the admin.

### Service icons

"Nos services" uses **Phosphor Icons** (duotone weight) from the `@phosphor-icons/react` package, MIT
licence (licence text ships with the npm package). No image files. Fluent Emoji 3D icons were tried
on 2026-09-26 and dropped (too playful for the brand).

## Own assets

| File | What | Owner |
|---|---|---|
| `public/images/brand/logo-atouts-services.png` | **Current logo** (2026-09-26), transparent PNG 1400 px, made from the owner's `public/new logo.png`. Used in header, footer, 404, client area, JSON-LD and as the "Nos services" backdrop | Atouts Services |
| `public/images/brand/logo-mark.png`, `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, `public/icons/icon-*.png` | Roof + house mark cut from the new logo (letters removed) for favicon / app icons | Atouts Services |
| `public/main.png` | Previous logo (white background), no longer referenced | Atouts Services |
| `public/models/hex-nut.glb` | 3D hex nut (generated with Three.js GLTFExporter) | Atouts Services |
| `public/icons/*.svg` | App / PWA icons | Atouts Services |
| `../brand-archive/logo-ancien-atouts-services.png` (outside the site) | **Old logo**, archived 2026-09-25 (was `public/ats.png` + an identical Lovable copy, both removed) | Atouts Services |

Unused Next.js template SVGs removed 2026-09-25.
