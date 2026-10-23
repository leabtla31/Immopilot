import type { Metadata } from "next";

import { ModulePreview } from "@/components/layout/module-preview";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("simulation");

export const metadata: Metadata = { title: item.label };

export default function Page() {
  return (
    <ModulePreview
      item={item}
      sprint={3}
      capabilities={[
        "Projeter crédit, capital remboursé et intérêts année par année",
        "Mesurer cash-flow, rentabilité, fiscalité et TRI",
        "Estimer le temps avant la liberté financière",
      ]}
    />
  );
}
