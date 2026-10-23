import { cn } from "@/utils/cn";

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small label above the title. */
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 pt-4 pb-8 sm:flex-row sm:items-end sm:justify-between sm:pt-8 sm:pb-10",
        className,
      )}
    >
      <div className="max-w-2xl space-y-2.5">
        {eyebrow ? (
          <div className="text-sm font-medium text-muted-foreground">{eyebrow}</div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{title}</h1>
        {description ? (
          <p className="text-base leading-7 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
