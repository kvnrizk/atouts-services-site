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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: process.env.API_HOSTNAME || "api.atouts-services.fr",
      },
      ...(process.env.CDN_HOSTNAME
        ? [{ protocol: "https" as const, hostname: process.env.CDN_HOSTNAME }]
        : []),
    ],
  },
};

// Skip PWA wrapper in dev to avoid Turbopack/webpack conflict
export default isDev ? withNextIntl(nextConfig) : withNextIntl(withPWA(nextConfig));
