// next.config.js
import { join } from "path";
import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    ppr: 'incremental',
    reactCompiler: true
  },
  // Enable static exports for PWA
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true
  }
};

const baseConfig = {
    reactStrictMode: true,
    // other config
};

const withPWA = nextPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    buildExcludes: [
        /middleware-manifest\.json$/,
        /app-build-manifest\.json$/,
        /_middleware.js$/,
    ],
    runtimeCaching: [
        {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
                cacheName: "html-cache",
                expiration: {
                    maxEntries: 50,
                },
                networkTimeoutSeconds: 3,
            },
        },
        {
            urlPattern: /\.(?:js|css)$/,
            handler: "StaleWhileRevalidate",
            options: {
                cacheName: "static-resources",
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|ttf|woff2?)$/,
            handler: "CacheFirst",
            options: {
                cacheName: "image-cache",
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
                },
            },
        },
    ],
});


export default withPWA(baseConfig);
