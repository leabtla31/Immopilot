import type { Metadata } from "next";

import { ModulePreview } from "@/components/layout/module-preview";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("compare");

export const metadata: Metadata = { title: item.label };

export default function Page() {
  return (
    <ModulePreview
      item={item}
      sprint={3}
      capabilities={[
        "Comparer résidence principale, locatif, ou les deux",
        "Visualiser patrimoine, dette et revenus passifs côte à côte",
        "Identifier la stratégie gagnante selon votre horizon",
      ]}
    />
  );
}
