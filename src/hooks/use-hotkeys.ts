"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export interface HotkeyOptions {
  /** Require ⌘ (macOS) or Ctrl (others). */
  mod?: boolean;
  /** Fire even while typing in a field. */
  allowInInputs?: boolean;
}

/** Bind a single-key shortcut. The handler is kept fresh without re-binding. */
export function useHotkey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {},
) {
  const handlerRef = useRef(handler);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });
  const { mod = false, allowInInputs = false } = options;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (mod !== (event.metaKey || event.ctrlKey)) return;
      if (!allowInInputs && isEditable(event.target)) return;
      handlerRef.current(event);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, mod, allowInInputs]);
}

/**
 * Linear-style two-key sequences: press `G` then `D` to go to the dashboard.
 * `bindings` maps the second key to an action.
 */
export function useSequenceHotkeys(
  leader: string,
  bindings: Record<string, () => void>,
  timeoutMs = 900,
) {
  const bindingsRef = useRef(bindings);
  useLayoutEffect(() => {
    bindingsRef.current = bindings;
  });

  useEffect(() => {
    let armedUntil = 0;
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || isEditable(event.target)) return;
      const key = event.key.toLowerCase();
      const now = Date.now();
      if (now < armedUntil) {
        armedUntil = 0;
        const action = Object.entries(bindingsRef.current).find(
          ([k]) => k.toLowerCase() === key,
        )?.[1];
        if (action) {
          event.preventDefault();
          action();
        }
        return;
      }
      if (key === leader.toLowerCase()) armedUntil = now + timeoutMs;
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [leader, timeoutMs]);
}
