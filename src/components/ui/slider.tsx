"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/utils/cn";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const thumbs = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "group/slider relative flex w-full touch-none items-center py-2 select-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary shadow-[inset_0_1px_1px_rgb(0_0_0/0.04)]">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,color-mix(in_oklch,var(--violet)_70%,var(--blue)),var(--violet))]" />
      </SliderPrimitive.Track>
      {thumbs.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(
            "block size-5 cursor-grab rounded-full border border-black/5 bg-white shadow-[0_1px_2px_rgb(0_0_0/0.12),0_4px_10px_-2px_rgb(0_0_0/0.18)]",
            "transition-[transform,box-shadow] duration-200 ease-out-quint hover:scale-110 active:scale-95 active:cursor-grabbing",
            "focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
