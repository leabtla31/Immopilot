import type { Metadata } from "next";

import { ModulePreview } from "@/components/layout/module-preview";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("listings");

export const metadata: Metadata = { title: item.label };

export default function Page() {
  return (
    <ModulePreview
      item={item}
      sprint={6}
      capabilities={[
        "Analyser une annonce en quelques secondes",
        "Obtenir rentabilité, cash-flow et score IA",
        "Savoir quelle marge de négociation viser",
      ]}
    />
  );
}
