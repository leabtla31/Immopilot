import { Reveal, RevealItem } from "@/components/motion/reveal";

import { DashboardHeader } from "./dashboard-header";
import { GoalsCard } from "./goals-card";
import { InsightCard } from "./insight-card";
import { KpiGrid } from "./kpi-grid";
import { NetWorthCard } from "./net-worth-card";
import { NextStepCard } from "./next-step-card";
import { RoadmapStrip } from "./roadmap-strip";
import type { DashboardModel } from "../lib/build-dashboard";

/**
 * Dashboard layout (12-column grid on xl):
 *   hero (8) · goals (4)
 *   4 KPIs (3 each)
 *   AI suggestion (7) · next step (5)
 *   roadmap (12)
 */
export function DashboardView({ model }: { model: DashboardModel }) {
  return (
    <>
      <DashboardHeader model={model} />
      <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 xl:gap-5">
        <RevealItem className="md:col-span-2 xl:col-span-8">
          <NetWorthCard model={model} />
        </RevealItem>
        <RevealItem className="md:col-span-2 xl:col-span-4">
          <GoalsCard goals={model.goals} />
        </RevealItem>

        <KpiGrid model={model} />

        <RevealItem className="md:col-span-2 xl:col-span-7">
          <InsightCard insights={model.insights} />
        </RevealItem>
        {model.nextStep ? (
          <RevealItem className="md:col-span-2 xl:col-span-5">
            <NextStepCard step={model.nextStep} />
          </RevealItem>
        ) : null}

        <RevealItem className="md:col-span-2 xl:col-span-12">
          <RoadmapStrip items={model.roadmap} freedomYear={model.freedom.year} />
        </RevealItem>
      </Reveal>
    </>
  );
}
