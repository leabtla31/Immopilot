/**
 * Fixed, GPU-cheap ambient light behind every screen: three blurred radial
 * glows and a whisper of grain. Gives glass surfaces something to refract.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute -top-[22%] -left-[8%] h-[62vh] w-[58vw] rounded-full bg-[radial-gradient(closest-side,var(--aurora-1),transparent)] blur-3xl" />
      <div className="absolute top-[8%] -right-[12%] h-[58vh] w-[52vw] rounded-full bg-[radial-gradient(closest-side,var(--aurora-2),transparent)] blur-3xl" />
      <div className="absolute -bottom-[25%] left-[25%] h-[55vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,var(--aurora-3),transparent)] blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
