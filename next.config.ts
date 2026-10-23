import type { NextConfig } from "next";

/**
 * Two build targets from the same code base:
 * - default: full-stack app (Vercel + PostgreSQL).
 * - `STATIC_EXPORT=true`: static demo (GitHub Pages…) served from
 *   `NEXT_PUBLIC_BASE_PATH`, backed by the bundled demo workspace.
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  // `*.api.ts` files are server-only routes: included in the full-stack build,
  // invisible to the static export.
  pageExtensions: isStaticExport ? ["tsx", "ts"] : ["tsx", "ts", "api.ts"],
  experimental: {
    // Tree-shake barrel-heavy packages so only used icons/components ship.
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion", "radix-ui"],
  },
  ...(isStaticExport
    ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } }
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
      }),
};

export default nextConfig;
