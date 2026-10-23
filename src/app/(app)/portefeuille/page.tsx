import type { Metadata } from "next";

import { ModulePreview } from "@/components/layout/module-preview";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("portfolio");

export const metadata: Metadata = { title: item.label };

export default function Page() {
  return (
    <ModulePreview
      item={item}
      sprint={6}
      capabilities={[
        "Centraliser biens, crédits et actifs financiers",
        "Suivre la valeur et l'équité de chaque bien",
        "Mesurer vos revenus locatifs nets",
      ]}
    />
  );
}
