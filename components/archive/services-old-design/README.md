# "Nos services" — old design (archived 2026-10-07)

The homepage services section as it was before the showroom:
the five services in a circle around the 3D nut, with the faded logo behind them.
Kept here so we can switch back to it at any time. Same code as git tag `services-old-design`.

## Switch back to it

In `app/[locale]/page.tsx`, replace

    import { Services } from "@/components/Services";

with

    import { ServicesOldDesign as Services } from "@/components/archive/services-old-design/ServicesOldDesign";

Nothing else to change. To return to the showroom, put the first line back.
