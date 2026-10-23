"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Toast host. Trigger toasts anywhere with `import { toast } from "sonner"`. */
function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={(resolvedTheme as ToasterProps["theme"]) ?? "system"}
      position="bottom-right"
      gap={10}
      offset={20}
      toastOptions={{
        classNames: {
          toast:
            "glass-strong! rounded-2xl! border! border-border! shadow-float! px-4! py-3.5! gap-3! font-sans!",
          title: "text-sm! font-medium! text-foreground!",
          description: "text-[13px]! text-muted-foreground!",
          actionButton: "rounded-full! bg-primary! text-primary-foreground! text-xs! font-medium!",
          cancelButton: "rounded-full! bg-secondary! text-foreground! text-xs!",
          icon: "text-violet!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
