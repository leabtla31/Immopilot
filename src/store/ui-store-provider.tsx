"use client";

import * as React from "react";
import { useStore } from "zustand";

import { createUiStore, type UiState, type UiStore } from "./ui-store";

type UiStoreApi = ReturnType<typeof createUiStore>;

const UiStoreContext = React.createContext<UiStoreApi | null>(null);

export function UiStoreProvider({
  initial,
  children,
}: {
  initial?: Partial<UiState>;
  children: React.ReactNode;
}) {
  const [store] = React.useState(() => createUiStore(initial));
  return <UiStoreContext.Provider value={store}>{children}</UiStoreContext.Provider>;
}

/** Select a slice of the UI store. Re-renders only when the slice changes. */
export function useUiStore<T>(selector: (state: UiStore) => T): T {
  const store = React.useContext(UiStoreContext);
  if (!store) throw new Error("useUiStore must be used within <UiStoreProvider>");
  return useStore(store, selector);
}
