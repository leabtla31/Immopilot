import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

import { IconTile } from "./icon-tile";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        className,
      )}
    >
      <IconTile icon={icon} tone="violet" size="lg" />
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export { EmptyState };
