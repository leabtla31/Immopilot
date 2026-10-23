import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";

import { AmbientBackground } from "@/components/layout/ambient-background";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { inter } from "@/styles/fonts";

import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Copilote patrimoine immobilier`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    siteName: siteConfig.name,
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#101115" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <AmbientBackground />
          {children}
        </Providers>
        {/* Analytics only exist on Vercel deployments. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
