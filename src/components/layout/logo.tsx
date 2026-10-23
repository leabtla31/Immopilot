import { cn } from "@/utils/cn";

/** ImmoPilot mark: a roof that doubles as an ascending trajectory. */
function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-[10px]",
        "bg-[linear-gradient(140deg,color-mix(in_oklch,var(--violet)_88%,white),color-mix(in_oklch,var(--violet)_55%,var(--blue)))]",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_4px_12px_-4px_color-mix(in_oklch,var(--violet)_70%,transparent)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none">
        <path
          d="M4.5 13.2 12 6.5l7.5 6.7"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 17.5h7"
          stroke="white"
          strokeOpacity="0.7"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function Logo({ className, collapsed = false }: { className?: string; collapsed?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {collapsed ? null : (
        <span className="text-[15px] font-semibold tracking-tight">
          Immo<span className="text-muted-foreground">Pilot</span>
        </span>
      )}
    </span>
  );
}

export { Logo, LogoMark };
