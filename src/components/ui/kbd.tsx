import { cn } from "@/utils/cn";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5.5 min-w-5.5 items-center justify-center rounded-md border border-border bg-surface-strong px-1.5",
        "font-sans text-xs font-medium text-muted-foreground shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
