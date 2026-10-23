import type { Metadata } from "next";

import { ModulePreview } from "@/components/layout/module-preview";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("neighborhoods");

export const metadata: Metadata = { title: item.label };

export default function Page() {
  return (
    <ModulePreview
      item={item}
      sprint={5}
      capabilities={[
        "Explorer une carte interactive de Toulouse",
        "Comparer 10 quartiers notés par l'IA",
        "Repérer l'impact de la ligne C sur la plus-value",
      ]}
    />
  );
}
