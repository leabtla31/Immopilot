"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Recharts is ~100 kB: load it after the page is interactive. The skeleton
 * reserves the exact chart footprint so nothing shifts (CLS = 0).
 */
export const NetWorthChartLazy = dynamic(
  () => import("./net-worth-chart").then((m) => m.NetWorthChart),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-5" aria-busy="true" aria-label="Chargement du graphique">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-64 max-w-[60%]" />
          <Skeleton className="h-9 w-48 rounded-full" />
        </div>
        <Skeleton className="h-[260px] rounded-2xl sm:h-[300px]" />
      </div>
    ),
  },
);
