import localFont from "next/font/local";

/** Inter (variable, self-hosted): no third-party request, no layout shift. */
export const inter = localFont({
  src: "./fonts/InterVariable-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  preload: true,
});
