import { cookies } from "next/headers";

import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth/session";
import { getUserSummary } from "@/services/wealth.service";
import { SIDEBAR_COOKIE } from "@/store/ui-store";
import { UiStoreProvider } from "@/store/ui-store-provider";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [{ userId }, cookieStore] = await Promise.all([getSession(), cookies()]);
  const user = await getUserSummary(userId);
  const sidebarCollapsed = cookieStore.get(SIDEBAR_COOKIE)?.value === "1";

  return (
    <UiStoreProvider initial={{ sidebarCollapsed }}>
      <AppShell user={user}>{children}</AppShell>
    </UiStoreProvider>
  );
}
