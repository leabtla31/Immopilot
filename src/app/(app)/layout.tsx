import { cookies } from "next/headers";

import { AppShell } from "@/components/layout/app-shell";
import { env, isDemoMode } from "@/config/env";
import { getSession } from "@/lib/auth/session";
import { getUserSummary } from "@/services/wealth.service";
import { SIDEBAR_COOKIE } from "@/store/ui-store";
import { UiStoreProvider } from "@/store/ui-store-provider";

/** Sidebar state comes from a cookie on the server; a static export has no request. */
async function readSidebarCollapsed(): Promise<boolean> {
  if (env.STATIC_EXPORT) return false;
  return (await cookies()).get(SIDEBAR_COOKIE)?.value === "1";
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [{ userId }, sidebarCollapsed] = await Promise.all([getSession(), readSidebarCollapsed()]);
  const user = await getUserSummary(userId);

  return (
    <UiStoreProvider initial={{ sidebarCollapsed }}>
      <AppShell user={user} demo={isDemoMode}>
        {children}
      </AppShell>
    </UiStoreProvider>
  );
}
