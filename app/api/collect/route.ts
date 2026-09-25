import { createHash, createHmac } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Anonymising relay for visitor analytics (see docs/superpowers/specs/2026-09-25-visitor-analytics-design.md).
 *
 * The browser sends a page view or event here; this function derives everything it needs from the
 * request (town, device, daily visitor hash), then forwards ONLY anonymous data to the backend.
 * The IP address and user-agent never leave this function and are never stored — which keeps the
 * tool within the CNIL exemption for audience measurement (no consent banner needed).
 */

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python|axios|node-fetch/i;
const EVENTS = new Set(["phone_click", "quote_step", "quote_submitted"]);

interface Payload {
  type: "pageview" | "event";
  name?: string;
  path: string;
  /** Referrer of the page where the visit STARTED (kept in memory client-side for the whole visit) */
  referrer?: string;
  utm?: { utm_source?: string; utm_medium?: string; utm_campaign?: string };
  /** true when the landing URL had a Google Ads click id (gclid) — the id itself is never sent */
  paid?: boolean;
  props?: Record<string, string>;
}

function device(ua: string) {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

function referrerHost(referrer: string | undefined, ownHost: string | null) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host && host !== ownHost?.replace(/^www\./, "").split(":")[0] ? host : null;
  } catch {
    return null;
  }
}

/** Where the visit came from, in words the owner understands. */
function source(host: string | null, utmSource?: string, utmMedium?: string, paid?: boolean) {
  const s = (utmSource ?? "").toLowerCase();
  const m = (utmMedium ?? "").toLowerCase();
  const isPaid = paid || ["cpc", "ppc", "paid", "paidsearch", "paid_social"].includes(m);
  if (isPaid && (s.includes("google") || paid)) return "Google Ads";
  if (isPaid && (s.includes("facebook") || s.includes("instagram") || s.includes("meta"))) return "Publicité Meta";
  if (s) return s.charAt(0).toUpperCase() + s.slice(1);
  if (!host) return "Direct";
  if (/(^|\.)google\./.test(host)) return "Google";
  if (/(^|\.)bing\./.test(host)) return "Bing";
  if (/facebook\.|fb\.|messenger\./.test(host)) return "Facebook";
  if (/instagram\./.test(host)) return "Instagram";
  if (/linkedin\.|lnkd\./.test(host)) return "LinkedIn";
  if (/pagesjaunes\./.test(host)) return "PagesJaunes";
  return host;
}

/** Daily-rotating visitor id: same person = same id today, a different id tomorrow. */
function visitorHash(ip: string, ua: string) {
  const day = new Date().toISOString().slice(0, 10);
  const salt = createHmac("sha256", process.env.ANALYTICS_SALT_SECRET ?? "dev-only-salt").update(day).digest("hex");
  return createHash("sha256").update(`${salt}|${ip}|${ua}`).digest("hex").slice(0, 16);
}

const clip = (v: unknown, max: number) => (typeof v === "string" && v ? v.slice(0, max) : undefined);

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  const key = process.env.ANALYTICS_INGEST_KEY;
  if (!key || !ua || BOT.test(ua)) return new NextResponse(null, { status: 204 });

  let body: Payload;
  try {
    body = JSON.parse(await req.text()); // sendBeacon posts text/plain
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (body.type !== "pageview" && !(body.type === "event" && body.name && EVENTS.has(body.name))) {
    return new NextResponse(null, { status: 400 });
  }
  const path = clip(body.path, 300);
  if (!path?.startsWith("/")) return new NextResponse(null, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "0.0.0.0";
  const host = referrerHost(body.referrer, req.headers.get("host"));
  const utm = body.utm ?? {};
  // Vercel adds these geolocation headers (city is URL-encoded); absent in local development.
  const city = req.headers.get("x-vercel-ip-city");

  const context = {
    path: path.split("?")[0],
    source: source(host, clip(utm.utm_source, 100), clip(utm.utm_medium, 100), body.paid === true).slice(0, 100),
    referrerHost: host ?? undefined,
    utmSource: clip(utm.utm_source, 100),
    utmMedium: clip(utm.utm_medium, 100),
    utmCampaign: clip(utm.utm_campaign, 150),
    country: clip(req.headers.get("x-vercel-ip-country"), 2),
    city: city ? clip(decodeURIComponent(city), 100) : undefined,
    device: device(ua),
    visitor: visitorHash(ip, ua),
  };

  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  try {
    await fetch(`${apiUrl}/analytics/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-ingest-key": key },
      body: JSON.stringify({ type: body.type, name: body.name, props: body.props, context }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Analytics must never break the site: drop the event silently.
  }
  return new NextResponse(null, { status: 204 });
}
