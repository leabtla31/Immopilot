import type { Metadata } from "next";

import { ModulePreview } from "@/components/layout/module-preview";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("roadmap");

export const metadata: Metadata = { title: item.label };

export default function Page() {
  return (
    <ModulePreview
      item={item}
      sprint={4}
      capabilities={[
        "Visualiser vos jalons de 2027 à 2040",
        "Explorer votre futur avec le Mode Vision 2026 → 2045",
        "Suivre la progression de chaque objectif",
      ]}
    />
  );
}
