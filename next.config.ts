import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWAInit({
  dest: "public",
  fallbacks: {
    document: "/offline",
  },
  disable: isDev,
});

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 refuses to optimise images served from localhost; in development the uploaded
    // photos (portfolio, avant/après, replaced site photos) come from the local API on :8080.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: process.env.API_HOSTNAME || "api.atoutservice92.fr",
      },
      ...(process.env.CDN_HOSTNAME
        ? [{ protocol: "https" as const, hostname: process.env.CDN_HOSTNAME }]
        : []),
    ],
  },
};

// Skip PWA wrapper in dev to avoid Turbopack/webpack conflict
export default isDev ? withNextIntl(nextConfig) : withNextIntl(withPWA(nextConfig));
