import * as React from "react";

import { cn } from "@/utils/cn";

const fieldBase = [
  "w-full min-w-0 rounded-xl border border-border bg-surface-sunken text-sm text-foreground tabular",
  "placeholder:text-faint-foreground",
  "transition-[border-color,box-shadow,background-color] duration-200 ease-out-quint",
  "hover:border-border-strong",
  "focus-visible:border-[color-mix(in_oklch,var(--violet)_45%,transparent)] focus-visible:bg-surface-strong focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:outline-none",
  "aria-invalid:border-rose/50 aria-invalid:ring-rose-soft",
  "disabled:cursor-not-allowed disabled:opacity-50",
];

export interface InputProps extends React.ComponentProps<"input"> {
  /** Content rendered inside the field, before the value (icon, "€"). */
  startAdornment?: React.ReactNode;
  /** Content rendered inside the field, after the value (unit, "%"). */
  endAdornment?: React.ReactNode;
}

function Input({ className, type = "text", startAdornment, endAdornment, ...props }: InputProps) {
  const input = (
    <input
      type={type}
      data-slot="input"
      className={cn(
        fieldBase,
        "h-11 px-3.5",
        startAdornment ? "pl-10" : null,
        endAdornment ? "pr-12" : null,
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );

  if (!startAdornment && !endAdornment) return input;

  return (
    <div className="relative">
      {startAdornment ? (
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted-foreground [&_svg]:size-4">
          {startAdornment}
        </span>
      ) : null}
      {input}
      {endAdornment ? (
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-muted-foreground">
          {endAdornment}
        </span>
      ) : null}
    </div>
  );
}

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldBase, "field-sizing-content min-h-24 px-3.5 py-3 leading-6", className)}
      {...props}
    />
  );
}

export { Input, Textarea };
