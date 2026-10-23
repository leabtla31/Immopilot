import type { Metadata } from "next";

import { ModulePreview } from "@/components/layout/module-preview";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("advisor");

export const metadata: Metadata = { title: item.label };

export default function Page() {
  return (
    <ModulePreview
      item={item}
      sprint={7}
      capabilities={[
        "Demander « Dois-je acheter ce bien ? »",
        "Obtenir des réponses fondées sur vos simulations",
        "Comparer les quartiers en langage naturel",
      ]}
    />
  );
}
