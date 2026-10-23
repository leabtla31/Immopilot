import { cn } from "@/utils/cn";

/** Shimmering placeholder. Purely decorative: wrap groups in `aria-busy` regions. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "animate-shimmer rounded-lg bg-secondary",
        "bg-[linear-gradient(90deg,transparent_25%,var(--highlight)_50%,transparent_75%)] bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
