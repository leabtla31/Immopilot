import type { Metadata } from "next";

import { DashboardView } from "@/features/dashboard";
import { getDashboard } from "@/features/dashboard/server/get-dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const model = await getDashboard();
  return <DashboardView model={model} />;
}
