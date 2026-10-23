"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only after hydration — for UI that depends on client-only state (theme, media). */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
