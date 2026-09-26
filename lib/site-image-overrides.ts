import { SITE_IMAGES } from "@/lib/site-images";

/**
 * Photos built into the site can be replaced from the admin (Photos du site → Remplacer).
 * The backend stores { key: url } (key = SITE_IMAGES key); no entry = default photo.
 */
export type SiteImageOverrides = Record<string, string>;

const API = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/** Uploaded files come back as "/uploads/…" on the API server: make them absolute */
export const absoluteUpload = (url: string) => (url.startsWith("/uploads/") ? `${PUBLIC_API}${url}` : url);

/** Server-side: current replacements (refreshed every minute, never blocks the page) */
export async function getSiteImageOverrides(): Promise<SiteImageOverrides> {
  try {
    const res = await fetch(`${API}/site-images`, { next: { revalidate: 60 } });
    if (!res.ok) return {};
    return (await res.json()) as SiteImageOverrides;
  } catch {
    return {};
  }
}

const keyBySrc: Record<string, string> = Object.fromEntries(
  Object.entries(SITE_IMAGES).map(([key, img]) => [img.src, key]),
);

/** The photo to show for a built-in image path: the replacement if there is one, else the default */
export function siteImageSrc(defaultSrc: string, overrides: SiteImageOverrides): string {
  const key = keyBySrc[defaultSrc];
  const url = key ? overrides[key] : undefined;
  return url ? absoluteUpload(url) : defaultSrc;
}
