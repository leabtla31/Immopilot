import { createStore } from "zustand/vanilla";

/**
 * Global UI preferences. Created per request/tree (not as a module singleton)
 * so server-rendered state never leaks between users. Persisted in a cookie so
 * the server renders the right layout on first paint (no flash).
 */
export interface UiState {
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  mobileNavOpen: boolean;
}

export interface UiActions {
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
}

export type UiStore = UiState & UiActions;

export const SIDEBAR_COOKIE = "immopilot.sidebar-collapsed";

function persistSidebar(collapsed: boolean) {
  document.cookie = `${SIDEBAR_COOKIE}=${collapsed ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
}

export function createUiStore(initial: Partial<UiState> = {}) {
  return createStore<UiStore>()((set, get) => ({
    sidebarCollapsed: false,
    commandOpen: false,
    mobileNavOpen: false,
    ...initial,
    toggleSidebar: () => {
      const next = !get().sidebarCollapsed;
      persistSidebar(next);
      set({ sidebarCollapsed: next });
    },
    setCommandOpen: (commandOpen) => set({ commandOpen }),
    setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  }));
}
